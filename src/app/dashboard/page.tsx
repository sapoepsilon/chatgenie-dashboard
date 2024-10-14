'use server';
import { Database } from '../../../database.types';
import DashboardClient from './DashboardClient';
import { Suspense } from 'react';
import { fetchPhoneNumbers } from './fetchPhoneNumbers';
import { fetchCalls } from './fetchCalls';
import { fetchTranscripts } from './fetchTranscripts';

export type PhoneNumber = Database["public"]["Tables"]["phone_numbers"]["Row"];
export type Call = Database["public"]["Tables"]["calls"]["Row"];
export type Transcript = Database["public"]["Tables"]["transcripts"]["Row"];

// Mark the Dashboard component as a server component
export default async function Dashboard() {
  const phoneNumbersArray = await fetchPhoneNumbers();
  const callsArray = await fetchCalls();
  const transcriptsArray = await fetchTranscripts();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col h-screen bg-background">
        <DashboardClient
          phoneNumbers={phoneNumbersArray}
          calls={callsArray}
          transcripts={transcriptsArray}
        />
      </div>
    </Suspense>
  );
}
