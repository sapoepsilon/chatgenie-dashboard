import { Database } from '../../../database.types';
import { createClient } from '@/utils/supabase/server';
import DashboardClient from './DashboardClient';
import { Suspense } from 'react';

export type PhoneNumber = Database["public"]["Tables"]["phone_numbers"]["Row"];
export type Call = Database["public"]["Tables"]["calls"]["Row"];
export type Transcript = Database["public"]["Tables"]["transcripts"]["Row"];
const supabase = createClient()

export default async function Dashboard() {
  const { data: phoneNumbers } = await supabase.from('phone_numbers').select('*').returns<PhoneNumber[]>();
  const { data: calls } = await supabase.from('calls').select('*').returns<Call[]>();
  const { data: transcripts } = await supabase.from('transcripts').select('*').returns<Transcript[]>();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col h-screen bg-background">
        <DashboardClient
          phoneNumbers={phoneNumbers || []}
          calls={calls || []}
          transcripts={transcripts || []}
        />
      </div>
    </Suspense>
  );
}
