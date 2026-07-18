"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";

const supabase = getBrowserClient();

export function useConversations() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const channelRef = useRef<any>(null);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    const { data: privateChats } = await supabase
      .from("private_conversations")
      .select(`
        *,
        user1:profiles!private_conversations_user1_id_fkey(id, username, display_name, avatar_url, online_status, last_seen),
        user2:profiles!private_conversations_user2_id_fkey(id, username, display_name, avatar_url, online_status, last_seen)
      `)
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    const { data: groups } = await supabase
      .from("group_members")
      .select(`
        group:groups(*)
      `)
      .eq("user_id", user.id);

    const formatted = [
      ...(privateChats?.map((chat) => {
        const otherUser = chat.user1_id === user.id ? chat.user2 : chat.user1;
        return {
          id: chat.id,
          type: "private" as const,
          name: otherUser?.display_name,
          username: otherUser?.username,
          avatar: otherUser?.avatar_url,
          online: otherUser?.online_status,
          lastSeen: otherUser?.last_seen,
          updatedAt: chat.updated_at,
        };
      }) || []),
      ...(groups?.map((g) => ({
        id: g.group.id,
        type: "group" as const,
        name: g.group.name,
        avatar: g.group.icon_url,
        updatedAt: g.group.updated_at,
      })) || []),
    ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    setConversations(formatted);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchConversations();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channelName = `conversations-${user.id}-${Date.now()}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "private_messages" },
        fetchConversations
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_messages" },
        fetchConversations
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [user]);

  return { conversations, loading, refetch: fetchConversations };
}