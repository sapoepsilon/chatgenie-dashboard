"use server";

import { createClient } from '@/utils/supabase/server';

export async function insertBusinessData(businessName: string, weekSchedule: any, teleOperatorInstructions: string, uploadedFiles: string[]) {
  const supabase = createClient();

  try {
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('businesses')
      .insert([
        {
          business_name: businessName,
          week_schedule: weekSchedule,
          tele_operator_instructions: teleOperatorInstructions,
          uploaded_files: uploadedFiles
        }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
      return { error };
    } else {
      console.log('Data inserted successfully:', data);
      return { data };
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error };
  }
}
