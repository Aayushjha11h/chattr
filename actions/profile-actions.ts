"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const updates = {
    display_name: formData.get("displayName") as string,
    username: formData.get("username") as string,
    bio: formData.get("bio") as string,
    theme: formData.get("theme") as string,
    privacy_message: formData.get("privacyMessage") as string,
    privacy_add: formData.get("privacyAdd") as string,
    privacy_profile: formData.get("privacyProfile") as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) throw error;

  revalidatePath("/profile");
  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Delete user data (cascade will handle related tables)
  const { error } = await supabase.auth.admin.deleteUser(user.id);

  if (error) throw error;
}