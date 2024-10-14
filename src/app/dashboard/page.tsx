import { Database } from '../../../database.types';
import { createClient } from '@/utils/supabase/server';
import DashboardClient from './DashboardClient';
import { Suspense } from 'react';

export type PhoneNumber = Database["public"]["Tables"]["phone_numbers"]["Row"];
export type Call = Database["public"]["Tables"]["calls"]["Row"];
export type Transcript = Database["public"]["Tables"]["transcripts"]["Row"];
const supabase = createClient()

export default async function Dashboard() {
  const { data: phoneNumbers, error: phoneNumbersError } = await supabase.from('phone_numbers').select('*').returns<PhoneNumber[]>();
  const { data: calls, error: callsError } = await supabase.from('calls').select('*').returns<Call[]>();
  const { data: transcripts, error: transcriptsError } = await supabase.from('transcripts').select('*').returns<Transcript[]>();
  
  if (phoneNumbersError || callsError || transcriptsError) {
    console.error('Error fetching data:', phoneNumbersError || callsError || transcriptsError);
    return <div>Error loading data</div>;
  }

  // Ensure data is not null and is an array
  const phoneNumbersArray = phoneNumbers || [];
  const callsArray = calls || [];
  const transcriptsArray = transcripts || [];

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
