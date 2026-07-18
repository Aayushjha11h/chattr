"use client";

import { useEffect } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";

export function usePresence() {
  const user = useAuthStore((s) => s.user);
  const supabase = getBrowserClient();

  useEffect(() => {
    if (!user) return;

    // Set online
    const setOnline = async () => {
      await supabase
        .from("profiles")
        .update({ online_status: true, last_seen: new Date().toISOString() })
        .eq("id", user.id);
    };

    // Set offline
    const setOffline = async () => {
      await supabase
        .from("profiles")
        .update({ online_status: false, last_seen: new Date().toISOString() })
        .eq("id", user.id);
    };

    setOnline();

    // Handle page visibility
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        setOffline();
      } else {
        setOnline();
      }
    };

    // Handle before unload
    const handleBeforeUnload = () => {
      setOffline();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Heartbeat every 30 seconds
    const heartbeat = setInterval(setOnline, 30000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(heartbeat);
      setOffline();
    };
  }, [user, supabase]);
}