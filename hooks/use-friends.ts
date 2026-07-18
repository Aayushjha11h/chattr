"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";

const supabase = getBrowserClient();

export function useFriends() {
  const [friends, setFriends] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const channelRef = useRef<any>(null);

  const fetchAll = useCallback(async () => {
    if (!user) return;

    const { data: friendships } = await supabase
      .from("friendships")
      .select(`
        *,
        requester:profiles!friendships_requester_id_fkey(id, username, display_name, avatar_url, online_status, last_seen),
        addressee:profiles!friendships_addressee_id_fkey(id, username, display_name, avatar_url, online_status, last_seen)
      `)
      .eq("status", "accepted")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    const friendList =
      friendships?.map((f) => {
        const other = f.requester_id === user.id ? f.addressee : f.requester;
        return { ...other, friendship_id: f.id };
      }) || [];

    setFriends(friendList);

    const { data: received } = await supabase
      .from("friendships")
      .select(`
        *,
        requester:profiles!friendships_requester_id_fkey(id, username, display_name, avatar_url)
      `)
      .eq("addressee_id", user.id)
      .eq("status", "pending");

    setReceivedRequests(received || []);

    const { data: sent } = await supabase
      .from("friendships")
      .select(`
        *,
        addressee:profiles!friendships_addressee_id_fkey(id, username, display_name, avatar_url)
      `)
      .eq("requester_id", user.id)
      .eq("status", "pending");

    setSentRequests(sent || []);
    setLoading(false);
  }, [user?.id]);

  const sendRequest = useCallback(
    async (userId: string) => {
      const { error } = await supabase.from("friendships").insert({
        requester_id: user?.id,
        addressee_id: userId,
        status: "pending",
      });

      if (error) throw error;
      await fetchAll();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    },
    [user, fetchAll]
  );

  const acceptRequest = useCallback(
    async (friendshipId: string) => {
      const { error } = await supabase
        .from("friendships")
        .update({ status: "accepted" })
        .eq("id", friendshipId);

      if (error) throw error;
      await fetchAll();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    },
    [fetchAll]
  );

  const rejectRequest = useCallback(
    async (friendshipId: string) => {
      const { error } = await supabase.from("friendships").delete().eq("id", friendshipId);
      if (error) throw error;
      await fetchAll();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    },
    [fetchAll]
  );

  const cancelRequest = useCallback(
    async (friendshipId: string) => {
      const { error } = await supabase.from("friendships").delete().eq("id", friendshipId);
      if (error) throw error;
      await fetchAll();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    },
    [fetchAll]
  );

  const removeFriend = useCallback(
    async (friendshipId: string) => {
      const { error } = await supabase.from("friendships").delete().eq("id", friendshipId);
      if (error) throw error;
      await fetchAll();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    },
    [fetchAll]
  );

  const blockUser = useCallback(
    async (userId: string) => {
      await supabase
        .from("friendships")
        .delete()
        .or(`requester_id.eq.${user?.id},addressee_id.eq.${user?.id}`)
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

      const { error } = await supabase.from("blocked_users").insert({
        blocker_id: user?.id,
        blocked_id: userId,
      });

      if (error) throw error;
      await fetchAll();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    },
    [user, fetchAll]
  );

  useEffect(() => {
    if (!user) return;

    fetchAll();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`friendships-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friendships",
          filter: `or(requester_id.eq.${user.id},addressee_id.eq.${user.id})`,
        },
        fetchAll
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [user?.id]);

  return {
    friends,
    receivedRequests,
    sentRequests,
    loading,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    removeFriend,
    blockUser,
    refetch: fetchAll,
  };
}