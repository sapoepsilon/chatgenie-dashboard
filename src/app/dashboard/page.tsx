'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area'; 
import { Phone, ChevronRight, Calendar } from 'lucide-react';
import { Database } from '../../../database.types';

type PhoneNumbers = Database["public"]["Tables"]["phone_numbers"]["Row"][];
type Calls = Record<number, Database["public"]["Tables"]["calls"]["Row"][]>;
type Transcripts = Record<number, Record<number, Database["public"]["Tables"]["transcripts"]["Row"][]>>;
  // Applying the types to your data
  const phoneNumbers: PhoneNumbers = [
    { id: 1, name: "John Doe", number: "555-1234" },
    { id: 2, name: "Jane Smith", number: "555-5678" }
  ];
  
  const calls: Calls = {
    1: [
      { id: 1, date: "2024-10-11", time: "14:00", duration: "00:10:00" },
      { id: 2, date: "2024-10-10", time: "16:00", duration: "00:20:00" }
    ],
    2: [
      { id: 1, date: "2024-10-09", time: "13:00", duration: "00:05:00" }
    ]
  };
  
  const transcripts: Transcripts = {
    1: {
      1: [{ id: 1, text: "Hello, how can I help you?", isAgent: true }],
      2: [{ id: 2, text: "I have an issue with my order.", isAgent: false }]
    },
    2: {
      1: [{ id: 3, text: "Thank you for calling.", isAgent: true }]
    }
  };
  

export default function Dashboard() {
  const [selectedNumber, setSelectedNumber] = useState(phoneNumbers[0].id);
  const [selectedCall, setSelectedCall] = useState(calls[phoneNumbers[0].id][0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const selectedCallData = calls[selectedNumber]?.find(call => call.id === selectedCall);
  
  return (
    <div className="flex flex-col h-screen bg-background">

      <div className="flex flex-1 overflow-hidden">
        <div className={`w-80 border-r bg-muted/40 flex flex-col ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
          <div className="p-4 border-b">
            <Input placeholder="Search numbers..." />
          </div>
          <ScrollArea className="flex-grow">
            {phoneNumbers.map((phone) => (
              <div key={phone.id}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-4 py-2 ${selectedNumber === phone.id ? "bg-accent" : ""}`}
                  onClick={() => {
                    setSelectedNumber(phone.id);
                    setSelectedCall(calls[phone.id][0].id);
                  }}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{phone.name}</span>
                    <span className="text-sm text-muted-foreground">{phone.number}</span>
                  </div>
                  {selectedNumber === phone.id && <ChevronRight className="ml-auto h-4 w-4" />}
                </Button>
                {selectedNumber === phone.id && (
                  <div className="pl-6 pr-2 py-2">
                    {calls[phone.id].map((call) => (
                      <Button
                        key={call.id}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start mb-1 ${selectedCall === call.id ? "bg-accent" : ""}`}
                        onClick={() => setSelectedCall(call.id)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        <div className="flex flex-col items-start">
                          <span className="text-sm">{call.date}</span>
                          <span className="text-xs text-muted-foreground">{call.time}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col">
          <header className="p-4 border-b bg-muted/40 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Call Transcripts</h2>
            <Button variant="outline" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Phone className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </header>
          <ScrollArea className="flex-1 p-4">
            {selectedNumber && selectedCall && transcripts[selectedNumber][selectedCall].map((message) => (
              <div key={message.id} className={`flex mb-4 ${message.is_agent ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${message.is_agent ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
          <footer className="p-4 border-t bg-muted/40">
  <div className="flex justify-between items-center text-sm text-muted-foreground">
    <span>
      Call Date: {selectedCallData?.date ?? "Unknown"}
    </span>
  </div>
</footer>


        </div>
      </div>
    </div>
  );
}
