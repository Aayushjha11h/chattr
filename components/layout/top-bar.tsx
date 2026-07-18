"use client";

import { usePathname } from "next/navigation";
import { useUIStore } from "@/store/ui-store";
import { SearchBar } from "./search-bar";
import { NotificationBell } from "./notification-bell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Video, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMobile } from "@/hooks/use-mobile";

export function TopBar({ profile }: { profile: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMobile();
  const { activeConversation, activeConversationType, toggleInfoPanel } = useUIStore();

  const isChat = pathname.startsWith("/chats/") || pathname.startsWith("/groups/");

  return (
    <header className="h-16 border-b border-border flex items-center px-4 gap-4 bg-card/50 backdrop-blur-xl">
      {isChat && isMobile && (
        <Button variant="ghost" size="icon" onClick={() => router.push("/chats")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
      )}

      <div className="flex-1 max-w-md">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2">
        {isChat && (
          <>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={toggleInfoPanel}>
              <Info className="w-4 h-4" />
            </Button>
          </>
        )}

        <NotificationBell />

        <Link href="/profile">
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback>{profile?.display_name?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}