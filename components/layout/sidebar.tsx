"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils/cn";
import {
  MessageCircle,
  Users,
  UserPlus,
  Settings,
  Search,
  LogOut,
  Menu,
  X,
  Bell,
  Pin,
  Archive,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { NotificationBell } from "./notification-bell";

const navigation = [
  { name: "Chats", href: "/chats", icon: MessageCircle },
  { name: "Friends", href: "/friends", icon: Users },
  { name: "Groups", href: "/groups", icon: UserPlus },
  { name: "Search", href: "/search", icon: Search },
  { name: "Profile", href: "/profile", icon: Settings },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ profile }: { profile: any }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { signOut } = useAuth();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card/50 backdrop-blur-xl transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        {sidebarOpen ? (
          <Link href="/chats" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Chatr</span>
          </Link>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto">
            <MessageCircle className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
                !sidebarOpen && "justify-center"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
              {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              {isActive && sidebarOpen && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-border space-y-2">
        <NotificationBell />
        
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg bg-accent/50",
            !sidebarOpen && "justify-center"
          )}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{profile?.display_name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.display_name}</p>
              <p className="text-xs text-muted-foreground truncate">@{profile?.username}</p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          className={cn("w-full", !sidebarOpen && "px-0")}
          onClick={signOut}
        >
          <LogOut className="w-4 h-4" />
          {sidebarOpen && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}