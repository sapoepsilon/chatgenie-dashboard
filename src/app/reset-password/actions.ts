"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function resetPassword(formData: FormData) {
  const supabase = createClient();

  const newPassword = formData.get("newPassword") as string;

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("Error updating user:", error);
    redirect("/error");
  } else {
    redirect("/login");
  }
}
