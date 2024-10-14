import { createClient } from '@/utils/supabase/server';
import { Call } from './page';

export async function fetchCalls(): Promise<Call[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('calls').select('*').returns<Call[]>();

  if (error) {
    console.error('Error fetching calls:', error);
    return [];
  }

  return data || [];
}
