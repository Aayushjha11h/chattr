"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import { getBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function ProfilePictureUpload() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setLoading(true);
    try {
      const supabase = getBrowserClient();

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const filePath = `avatars/${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      // Update profile
      const { data, error } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      setUser(data);
      setPreview(null);
    } catch (err: any) {
      console.error(err);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <Button
        variant="secondary"
        size="icon"
        className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Camera className="w-4 h-4" />
        )}
      </Button>
    </>
  );
}