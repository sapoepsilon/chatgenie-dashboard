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

    // Check if the business already exists
    const { data: existingBusiness, error: existingBusinessError } =
      await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", userId)
        .single();
    // TODO: Right now only one business per user is allowed. Do we want to allow multiple businesses per user?

    if (existingBusiness) {
      // Check if the data has changed
      const isDataChanged =
        existingBusiness.business_name !== businessName ||
        existingBusiness.week_schedule !== weekSchedule ||
        existingBusiness.tele_operator_instructions !==
          teleOperatorInstructions ||
        existingBusiness.uploaded_files !== uploadedFiles;

      console.log(
        existingBusiness.business_name,
        businessName,
        existingBusiness.week_schedule,
        weekSchedule,
        existingBusiness.tele_operator_instructions,
        teleOperatorInstructions,
        existingBusiness.uploaded_files,
        uploadedFiles
      );
      if (!isDataChanged) {
        return { data: existingBusiness }; // Return existing data if nothing has changed
      }

      // Update the existing business data
      const { data: updatedBusiness, error: updateError } = await supabase
        .from("businesses")
        .update({
          business_name: businessName,
          week_schedule: weekSchedule,
          tele_operator_instructions: teleOperatorInstructions,
          uploaded_files: uploadedFiles,
        })
        .eq("id", existingBusiness.id);

      if (updateError) {
        console.error("Error updating business data:", updateError);
        return { error: updateError };
      }

      return { data: updatedBusiness };
    }

    const { data: businessData, error: businessError } = await supabase
      .from("businesses")
      .insert([
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

// New function to upload phone number
export async function uploadPhoneNumber(
  phoneNumber: string,
  businessName: string
) {
  const supabase = createClient();

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData) {
      throw new Error("User not authenticated");
    }

    const userId = userData.user?.id;

    const { data: businessData, error: businessError } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (businessError || !businessData) {
      console.error("Error fetching business data:", businessError);
      return { error: businessError };
    }

    const { error: phoneError } = await supabase.from("phone_numbers").insert([
      {
        number: phoneNumber,
        name: businessName,
        business_id: businessData.id,
      },
    ]);

    if (phoneError) {
      console.error("Error uploading phone number:", phoneError);
      return { error: phoneError };
    }

    return { data: "Phone number uploaded successfully" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error };
  }
}

// New function to fetch business phone number
export async function fetchBusinessPhoneNumber() {
  const supabase = createClient();

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData) {
      throw new Error("User not authenticated");
    }

    const userId = userData.user?.id;

    // Fetch the business ID first
    const { data: businessData, error: businessError } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (businessError || !businessData) {
      console.error("Error fetching business data:", businessError);
      return { error: businessError };
    }

    // Fetch the phone number using the business ID
    const { data: phoneNumberData, error: phoneNumberError } = await supabase
      .from("phone_numbers")
      .select("number")
      .eq("business_id", businessData.id)
      .single();

    if (phoneNumberError || !phoneNumberData) {
      console.error("Error fetching phone number:", phoneNumberError);
      return { error: phoneNumberError };
    }

    return { data: phoneNumberData.number };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error };
  }
}
