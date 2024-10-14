import { createClient } from '@/utils/supabase/server';
import { PhoneNumber } from './page';

export async function fetchPhoneNumbers(): Promise<PhoneNumber[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('phone_numbers').select('*').returns<PhoneNumber[]>();

  if (error) {
    console.error('Error fetching phone numbers:', error);
    return [];
  }

  return data || [];
}
