// DashboardClient.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PhoneCallIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Call, Transcript, PhoneNumber } from './page';

interface DashboardClientProps {
    phoneNumbers: PhoneNumber[];
    calls: Call[];
    transcripts: Transcript[];
}

const DashboardClient: React.FC<DashboardClientProps> = ({ phoneNumbers, calls, transcripts }) => {
    const [selectedCall, setSelectedCall] = useState<number | null>(null);

    // Sort callList in descending order by time
    const callList = calls.sort((a: Call, b: Call) => b.time.localeCompare(a.time));
    const getPhoneNumber = (phoneNumberId: number) => {
        const phoneNumber = phoneNumbers.find(phone => phone.id === phoneNumberId);
        return phoneNumber ? phoneNumber.number : 'Unknown';
    };

    const handleCallSelection = (callId: number) => {
        setSelectedCall(callId);
        // Filter the transcripts for the selected call ID
        const callTranscripts = transcripts.filter(transcript => transcript.call_id === callId);
        console.log(`Transcripts for call ${callId}:`, callTranscripts);
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="w-80 border-r bg-muted/40 flex flex-col">
                <ScrollArea className="flex-grow">
                    {callList.map((call) => (
                        <Button
                            key={call.id}
                            variant="ghost"
                            className={`w-full h-16 justify-start px-4 py-2 ${selectedCall === call.id ? "bg-accent" : ""}`}
                            onClick={() => handleCallSelection(call.id)}
                        >
                            <PhoneCallIcon className="mr-2 h-4 w-4" />
                            <div className="flex flex-col items-start">
                                <span className="font-bold">{getPhoneNumber(call.phone_number_id)}</span>
                                <span className="font-medium">{call.date}</span>
                                <span className="text-sm text-muted-foreground">{call.time}</span>
                            </div>
                        </Button>
                    ))}
                </ScrollArea>
            </div>

            <div className="flex-1 flex flex-col">
                <header className="p-4 border-b bg-muted/40 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Call Transcripts</h2>
                </header>
                <ScrollArea className="flex-1 p-4">
                    {selectedCall && (
                        transcripts
                            .filter(transcript => transcript.call_id === selectedCall)
                            .map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex mb-4 ${!message.is_agent ? "justify-start" : "justify-end"}`}
                                >
                                    <div
                                        className={`max-w-[70%] p-3 rounded-lg ${!message.is_agent
                                            ? "bg-gray-200 text-gray-800"
                                            : "bg-blue-500 text-white"
                                            }`}
                                    >
                                        <p className="text-lg">{message.text}</p>
                                    </div>
                                </div>
                            ))
                    )}
                </ScrollArea>
            </div>
        </div>
    );
};

export default DashboardClient;
