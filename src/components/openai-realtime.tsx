'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'function_call';
  content: string;
  timestamp: Date;
  eventType?: string;
}

interface EventLog {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

export default function OpenAIRealtime() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (type: Message['type'], content: string, eventType?: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type,
        content,
        timestamp: new Date(),
        eventType,
      },
    ]);
  };

  const logEvent = (type: string, data: Record<string, unknown>) => {
    setEventLogs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type,
        data,
        timestamp: new Date(),
      },
    ]);
  };

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Get ephemeral token
      const tokenResponse = await fetch('/api/admin/realtime/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2025-06-03',
          voice: 'verse',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get ephemeral token');
      }

      const data = await tokenResponse.json();
      const EPHEMERAL_KEY = data.client_secret.value;

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      pcRef.current = pc;

      // Set up audio element for remote audio
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioRef.current = audioEl;

      pc.ontrack = (e) => {
        if (audioRef.current) {
          audioRef.current.srcObject = e.streams[0];
        }
        addMessage('system', 'Remote audio stream connected');
      };

      // Get user media for microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
      addMessage('system', 'Microphone connected');

      // Set up data channel
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.addEventListener('open', () => {
        addMessage('system', 'Data channel opened');
        setIsConnected(true);
        setIsConnecting(false);
      });

      dc.addEventListener('message', (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log('Received event:', event);
          logEvent(event.type, event);
          
          // Handle different event types
          switch (event.type) {
            case 'session.created':
              addMessage('system', 'Session created successfully', event.type);
              break;
            
            case 'session.updated':
              addMessage('system', 'Session configuration updated', event.type);
              break;
            
            case 'response.created':
              addMessage('system', 'Response generation started', event.type);
              break;
            
            case 'response.done':
              addMessage('system', 'Response completed', event.type);
              if (currentTranscript) {
                setCurrentTranscript('');
              }
              break;
            
            case 'response.text.delta':
              if (event.delta) {
                setCurrentTranscript((prev) => prev + event.delta);
                addMessage('assistant', currentTranscript + event.delta, event.type);
              }
              break;
            
            case 'response.audio_transcript.delta':
              if (event.delta) {
                setCurrentTranscript((prev) => prev + event.delta);
                addMessage('assistant', `[Audio]: ${currentTranscript + event.delta}`, event.type);
              }
              break;
            
            case 'response.audio.delta':
              // Audio chunks are being received
              break;
            
            case 'input_audio_buffer.speech_started':
              addMessage('system', 'Speech detected...', event.type);
              break;
            
            case 'input_audio_buffer.speech_stopped':
              addMessage('system', 'Speech ended', event.type);
              break;
            
            case 'input_audio_buffer.committed':
              addMessage('system', 'Audio input committed', event.type);
              break;
            
            case 'conversation.item.created':
              if (event.item?.content?.[0]?.transcript) {
                addMessage('user', event.item.content[0].transcript, event.type);
              }
              break;
            
            case 'error':
              addMessage('system', `Error: ${event.error?.message || 'Unknown error'}`, event.type);
              setError(event.error?.message || 'An error occurred');
              break;
            
            default:
              console.log('Unhandled event type:', event.type);
          }
        } catch (err) {
          console.error('Error parsing message:', err);
          addMessage('system', 'Error parsing server message', 'error');
        }
      });

      dc.addEventListener('error', (e) => {
        console.error('Data channel error:', e);
        addMessage('system', 'Data channel error occurred');
      });

      // Create offer and establish connection
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2025-06-03';
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpResponse.ok) {
        throw new Error('Failed to establish WebRTC connection');
      }

      const answer = {
        type: 'answer' as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      await pc.setRemoteDescription(answer);

      addMessage('system', 'WebRTC connection established');
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
      setIsConnecting(false);
      disconnect();
    }
  };

  const disconnect = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.srcObject = null;
      audioRef.current = null;
    }

    setIsConnected(false);
    addMessage('system', 'Disconnected');
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        addMessage('system', audioTrack.enabled ? 'Microphone unmuted' : 'Microphone muted');
      }
    }
  };

  const sendTextMessage = (text: string) => {
    if (!dcRef.current || dcRef.current.readyState !== 'open') {
      setError('Data channel not open');
      return;
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: text,
          },
        ],
      },
    };

    dcRef.current.send(JSON.stringify(event));
    addMessage('user', text, 'conversation.item.create');

    // Trigger response
    const responseEvent = {
      type: 'response.create',
    };
    dcRef.current.send(JSON.stringify(responseEvent));
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      sendTextMessage(textInput);
      setTextInput('');
    }
  };

  const updateSessionInstructions = (instructions: string) => {
    if (!dcRef.current || dcRef.current.readyState !== 'open') {
      setError('Data channel not open');
      return;
    }

    const event = {
      type: 'session.update',
      session: {
        instructions: instructions,
      },
    };

    dcRef.current.send(JSON.stringify(event));
    addMessage('system', 'Session instructions updated', 'session.update');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>OpenAI Realtime API</CardTitle>
          <CardDescription>
            Connect to OpenAI&apos;s Realtime API using WebRTC for voice conversations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={connect}
              disabled={isConnected || isConnecting}
              variant={isConnected ? 'secondary' : 'default'}
            >
              {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect'}
            </Button>
            <Button
              onClick={disconnect}
              disabled={!isConnected}
              variant="destructive"
            >
              Disconnect
            </Button>
            {isConnected && (
              <Button
                onClick={toggleMute}
                variant={isMuted ? 'destructive' : 'outline'}
              >
                {isMuted ? 'Unmute' : 'Mute'} Microphone
              </Button>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Connection Status</h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <span className="text-sm">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Microphone Status</h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected && !isMuted ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <span className="text-sm">
                  {!isConnected ? 'Disconnected' : isMuted ? 'Muted' : 'Active'}
                </span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="conversation" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
              <TabsTrigger value="events">Event Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="conversation" className="space-y-4">
              <ScrollArea className="h-[400px] border rounded-md p-4">
                <div className="space-y-3">
                  {messages.filter(m => m.type !== 'system' || m.content.includes('Session created')).map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-50 ml-auto max-w-[80%]'
                          : message.type === 'assistant'
                          ? 'bg-gray-50 mr-auto max-w-[80%]'
                          : 'bg-yellow-50 text-sm italic'
                      }`}
                    >
                      <div className="font-medium text-xs text-gray-500 mb-1">
                        {message.type.toUpperCase()}
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                      <div className="text-sm">{message.content}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {isConnected && (
                <form onSubmit={handleTextSubmit} className="flex gap-2">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={!isConnected}
                  />
                  <Button type="submit" disabled={!isConnected || !textInput.trim()}>
                    Send
                  </Button>
                </form>
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <ScrollArea className="h-[400px] border rounded-md p-4">
                <div className="space-y-2">
                  {eventLogs.map((log) => (
                    <div key={log.id} className="text-xs font-mono">
                      <div className="flex gap-2">
                        <span className="text-gray-500">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                        <span className="font-medium text-blue-600">
                          {log.type}
                        </span>
                      </div>
                      <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {isConnected && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Quick Actions</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => sendTextMessage("Hello! Can you hear me?")}
                  >
                    Test Audio
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => sendTextMessage("What's the weather like today?")}
                  >
                    Ask Weather
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => updateSessionInstructions("You are a helpful assistant. Be concise and friendly.")}
                  >
                    Update Instructions
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}