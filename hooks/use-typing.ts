"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";

const supabase = getBrowserClient();
const TYPING_TIMEOUT = 5000;

export function useTyping(conversationId: string, type: "private" | "group") {
  const [typingUsers, setTypingUsers] = useState<any[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const user = useAuthStore((s) => s.user);
  const channelRef = useRef<any>(null);

  const startTyping = useCallback(async () => {
    if (!user) return;

    await supabase.from("typing_status").upsert(
      {
        conversation_id: conversationId,
        conversation_type: type,
        user_id: user.id,
        started_at: new Date().toISOString(),
      },
      { onConflict: "conversation_id,conversation_type,user_id" }
    );

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(stopTyping, TYPING_TIMEOUT);
  }, [user, conversationId, type]);

  const stopTyping = useCallback(async () => {
    if (!user) return;
    await supabase
      .from("typing_status")
      .delete()
      .eq("conversation_id", conversationId)
      .eq("conversation_type", type)
      .eq("user_id", user.id);
  }, [user, conversationId, type]);

  useEffect(() => {
    if (!user) return;

    const fetchTyping = async () => {
      const { data } = await supabase
        .from("typing_status")
        .select("*, user:profiles(id, username, display_name, avatar_url)")
        .eq("conversation_id", conversationId)
        .eq("conversation_type", type)
        .neq("user_id", user.id)
        .gt("started_at", new Date(Date.now() - TYPING_TIMEOUT).toISOString());

      setTypingUsers(data || []);
    };

    fetchTyping();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`typing-${conversationId}-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "typing_status",
          filter: `conversation_id=eq.${conversationId}`,
        },
        fetchTyping
      )
      .subscribe();

    channelRef.current = channel;

    const interval = setInterval(fetchTyping, 2000);

    return () => {
      void supabase.removeChannel(channel);
      channelRef.current = null;
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [conversationId, type, user?.id]);

  return { typingUsers, startTyping, stopTyping };
}