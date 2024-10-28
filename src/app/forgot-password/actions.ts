"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function sendPasswordResetEmail(formData: FormData) {
  console.log("sendPasswordResetEmail");
  const supabase = createClient();
  const email = formData.get("email") as string;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.BASE_URL}/forgot-password?reset=true`,
  });

  if (error) {
    redirect("/error");
  }
}
