"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { getBrowserClient } from "@/lib/supabase/client";
import { profileUpdateSchema } from "@/lib/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

export function ProfileEditForm({ onCancel }: { onCancel: () => void }) {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    displayName: user?.display_name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    theme: user?.theme || "system",
    privacyMessage: user?.privacy_message || "friends",
    privacyAdd: user?.privacy_add || "everyone",
    privacyProfile: user?.privacy_profile || "everyone",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = profileUpdateSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const supabase = getBrowserClient();
      const { data, error } = await supabase
        .from("profiles")
        .update({
          display_name: form.displayName,
          username: form.username,
          bio: form.bio,
          theme: form.theme,
          privacy_message: form.privacyMessage,
          privacy_add: form.privacyAdd,
          privacy_profile: form.privacyProfile,
        })
        .eq("id", user?.id)
        .select()
        .single();

      if (error) throw error;

      setUser(data);
      onCancel();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={form.displayName}
              onChange={(e) => handleChange("displayName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value.toLowerCase())}
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">{form.bio.length}/500</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              value={form.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="system">System</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}