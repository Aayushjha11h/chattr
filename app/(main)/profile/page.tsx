"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { ProfilePictureUpload } from "@/components/profile/profile-picture-upload";
import { PrivacySettings } from "@/components/profile/privacy-settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Camera, User, Shield, Bell } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [editMode, setEditMode] = useState(false);

  if (!user) return null;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-2xl mx-auto p-6">
        {/* Profile Header */}
        <Card className="border-0 shadow-lg glass-strong mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="text-2xl">{user.display_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <ProfilePictureUpload />
              </div>

              <h1 className="text-2xl font-bold mt-4">{user.display_name}</h1>
              <p className="text-muted-foreground">@{user.username}</p>

              {user.bio && (
                <p className="text-sm text-muted-foreground mt-2 max-w-md">{user.bio}</p>
              )}

              <div className="flex items-center gap-2 mt-4">
                <Badge variant="secondary">
                  {user.online_status ? "Online" : "Offline"}
                </Badge>
                <Badge variant="outline">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </Badge>
              </div>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setEditMode(!editMode)}
              >
                <Camera className="w-4 h-4 mr-2" />
                {editMode ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit / Settings */}
        {editMode ? (
          <ProfileEditForm onCancel={() => setEditMode(false)} />
        ) : (
          <Tabs defaultValue="general">
            <TabsList className="w-full">
              <TabsTrigger value="general">
                <User className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="w-4 h-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Display Name</Label>
                    <p className="text-sm font-medium">{user.display_name}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label>Username</Label>
                    <p className="text-sm font-medium">@{user.username}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                  <Separator />
                  <div>
                    <Label>Theme</Label>
                    <p className="text-sm font-medium capitalize">{user.theme}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="mt-4">
              <PrivacySettings />
            </TabsContent>

            <TabsContent value="notifications" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Notification settings will be available here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{children}</p>;
}