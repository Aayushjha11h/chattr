"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/cn";
import {
  MessageCircle,
  Users,
  UserPlus,
  Search,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const navigation = [
  { name: "Chats", href: "/chats", icon: MessageCircle },
  { name: "Friends", href: "/friends", icon: Users },
  { name: "Groups", href: "/groups", icon: UserPlus },
  { name: "Search", href: "/search", icon: Search },
  { name: "Profile", href: "/profile", icon: Settings },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileDrawer({ profile, isOpen, onOpenChange }: { profile: any; isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center px-4 border-b border-border">
            <Link href="/chats" className="flex items-center gap-2" onClick={() => onOpenChange(false)}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Chatr</span>
            </Link>
          </div>

          {/* Profile */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.display_name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{profile?.display_name}</p>
                <p className="text-sm text-muted-foreground">@{profile?.username}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}