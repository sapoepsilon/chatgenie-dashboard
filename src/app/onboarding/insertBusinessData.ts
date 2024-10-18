"use server";

import { createClient } from "@/utils/supabase/server";
import { TablesInsert } from "../../../database.types";

// Use the 'TablesInsert' type for the 'businesses' table to type the business data.
export async function insertBusinessData(
  businessName: string,
  weekSchedule: TablesInsert<"businesses">["week_schedule"],
  teleOperatorInstructions: string,
  uploadedFiles: TablesInsert<"businesses">["uploaded_files"]
) {
  const supabase = createClient();

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData) {
      throw new Error("User not authenticated");
    }

    const userId = userData.user?.id; // Extract user ID

    const { data: businessData, error: businessError } = await supabase
      .from("businesses")
      .upsert([
        {
          user_id: userId, // Insert user ID
          business_name: businessName,
          week_schedule: weekSchedule,
          tele_operator_instructions: teleOperatorInstructions,
          uploaded_files: uploadedFiles,
        },
      ]);

    if (businessError) {
      console.error("Error inserting business data:", businessError);
      return { error: businessError };
    }

    return { data: { businessData } };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error };
  }
}

// New function to fetch business data
export async function fetchBusinessData() {
  const supabase = createClient();

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData) {
      throw new Error("User not authenticated");
    }

    const userId = userData.user?.id; // Extract user ID

    // Fetch user info to get the business_entity_id
    const { data: businessData, error: businessDataError } = await supabase
      .from("businesses")
      .select()
      .eq("user_id", userId)
      .single();

    if (businessDataError || !businessData) {
      console.error("Error fetching business data:", businessDataError);
      return { error: businessDataError };
    }

    return { data: businessData };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error };
  }
}
