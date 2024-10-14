import { createClient } from '@/utils/supabase/server';
import { Transcript } from './page';

export async function fetchTranscripts(): Promise<Transcript[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('transcripts').select('*').returns<Transcript[]>();

  if (error) {
    console.error('Error fetching transcripts:', error);
    return [];
  }

  return data || [];
}
