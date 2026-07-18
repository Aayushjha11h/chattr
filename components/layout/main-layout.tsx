"use client";

import { useMobile } from "@/hooks/use-mobile";
import { usePresence } from "@/hooks/use-presence";
import { Sidebar } from "./sidebar";
import { MobileDrawer } from "./mobile-drawer";
import { TopBar } from "./top-bar";

interface MainLayoutProps {
  profile: any;
  children: React.ReactNode;
}

export function MainLayout({ profile, children }: MainLayoutProps) {
  const isMobile = useMobile();
  usePresence(); // Track online status

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {!isMobile && <Sidebar profile={profile} />}
      {isMobile && <MobileDrawer profile={profile} />}
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar profile={profile} />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}