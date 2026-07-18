"use client";

import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Moon,
  Sun,
  Monitor,
  LogOut,
  Trash2,
  Bell,
  Volume2,
  Keyboard,
  Download,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Appearance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm font-medium">Theme</p>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                  }`}
                >
                  <Sun className="w-6 h-6" />
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                  }`}
                >
                  <Moon className="w-6 h-6" />
                  <span className="text-sm font-medium">Dark</span>
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    theme === "system" ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                  }`}
                >
                  <Monitor className="w-6 h-6" />
                  <span className="text-sm font-medium">System</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications for new messages</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sound</p>
                <p className="text-sm text-muted-foreground">Play sound for new messages</p>
              </div>
              <Switch checked={sound} onCheckedChange={setSound} />
            </div>
          </CardContent>
        </Card>

        {/* Data */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Chat History
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Chats
            </Button>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">New message</span>
                <kbd className="px-2 py-1 bg-accent rounded text-xs font-mono">Ctrl + N</kbd>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Search</span>
                <kbd className="px-2 py-1 bg-accent rounded text-xs font-mono">Ctrl + K</kbd>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Close chat</span>
                <kbd className="px-2 py-1 bg-accent rounded text-xs font-mono">Esc</kbd>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start text-destructive" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}