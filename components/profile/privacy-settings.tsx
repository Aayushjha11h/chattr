"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { getBrowserClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const privacyOptions = [
  { value: "everyone", label: "Everyone" },
  { value: "friends", label: "Friends Only" },
  { value: "nobody", label: "Nobody" },
];

export function PrivacySettings() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (field: string, value: string) => {
    if (!user) return;
    setLoading(true);

    const supabase = getBrowserClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({ [field]: value })
      .eq("id", user.id)
      .select()
      .single();

    if (!error && data) {
      setUser(data);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Who can message me</p>
              <p className="text-sm text-muted-foreground">Control who can send you direct messages</p>
            </div>
            <Select
              value={user?.privacy_message || "friends"}
              onValueChange={(value) => handleUpdate("privacy_message", value)}
              disabled={loading}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {privacyOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Who can add me as friend</p>
              <p className="text-sm text-muted-foreground">Control who can send you friend requests</p>
            </div>
            <Select
              value={user?.privacy_add || "everyone"}
              onValueChange={(value) => handleUpdate("privacy_add", value)}
              disabled={loading}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {privacyOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Who can see my profile</p>
              <p className="text-sm text-muted-foreground">Control who can view your profile details</p>
            </div>
            <Select
              value={user?.privacy_profile || "everyone"}
              onValueChange={(value) => handleUpdate("privacy_profile", value)}
              disabled={loading}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {privacyOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}