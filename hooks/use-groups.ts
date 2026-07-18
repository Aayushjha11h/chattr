"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";

const supabase = getBrowserClient();

export function useGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const channelRef = useRef<any>(null);

  const fetchGroups = useCallback(async () => {
    if (!user) return;

    const { data: allGroups } = await supabase
      .from("groups")
      .select(`
        *,
        members:group_members(count),
        my_membership:group_members!inner(user_id, role)
      `)
      .eq("group_members.user_id", user.id);

    const { data: publicGroups } = await supabase
      .from("groups")
      .select(`
        *,
        members:group_members(count)
      `)
      .eq("visibility", "public")
      .not(
        "id",
        "in",
        `(${allGroups?.map((g) => g.id).join(",") || "00000000-0000-0000-0000-000000000000"})`
      );

    const formatted = [
      ...(allGroups?.map((g) => ({
        ...g,
        isMember: true,
        myRole: g.my_membership?.[0]?.role || "member",
        memberCount: g.members?.[0]?.count || 0,
      })) || []),
      ...(publicGroups?.map((g) => ({
        ...g,
        isMember: false,
        myRole: null,
        memberCount: g.members?.[0]?.count || 0,
      })) || []),
    ];

    setGroups(formatted);
    setLoading(false);
  }, [user?.id]);

  const createGroup = useCallback(
    async (data: any) => {
      if (!user) throw new Error("Not authenticated");

      const { data: group, error } = await supabase
        .from("groups")
        .insert({
          name: data.name,
          description: data.description,
          visibility: data.visibility,
          password: data.visibility === "private" ? data.password : null,
          max_members: data.maxMembers,
          owner_id: user.id,
          only_admins_send: data.onlyAdminsSend,
          only_admins_edit: data.onlyAdminsEdit,
          invite_link: crypto.randomUUID(),
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: user.id,
        role: "owner",
      });

      await fetchGroups();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
      return group;
    },
    [user, fetchGroups]
  );

  const joinGroup = useCallback(
    async (groupId: string, password?: string) => {
      if (!user) throw new Error("Not authenticated");

      const group = groups.find((g) => g.id === groupId);
      if (!group) throw new Error("Group not found");

      if (group.visibility === "private" && group.password !== password) {
        throw new Error("Incorrect password");
      }

      const { error } = await supabase.from("group_members").insert({
        group_id: groupId,
        user_id: user.id,
        role: "member",
      });

      if (error) throw error;
      await fetchGroups();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    },
    [user, groups, fetchGroups]
  );

  const leaveGroup = useCallback(
    async (groupId: string) => {
      if (!user) return;

      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);

      if (error) throw error;
      await fetchGroups();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    },
    [user, fetchGroups]
  );

  const updateGroup = useCallback(
    async (groupId: string, updates: any) => {
      const { error } = await supabase.from("groups").update(updates).eq("id", groupId);
      if (error) throw error;
      await fetchGroups();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    },
    [fetchGroups]
  );

  const inviteMember = useCallback(
    async (groupId: string, userId: string) => {
      const { error } = await supabase.from("group_members").insert({
        group_id: groupId,
        user_id: userId,
        role: "member",
      });
      if (error) throw error;
    },
    []
  );

  const removeMember = useCallback(
    async (groupId: string, userId: string) => {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", userId);
      if (error) throw error;
      await fetchGroups();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    },
    [fetchGroups]
  );

  const changeRole = useCallback(
    async (groupId: string, userId: string, role: "admin" | "member") => {
      const { error } = await supabase
        .from("group_members")
        .update({ role })
        .eq("group_id", groupId)
        .eq("user_id", userId);
      if (error) throw error;
      await fetchGroups();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    },
    [fetchGroups]
  );

  useEffect(() => {
    if (!user) return;

    fetchGroups();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`groups-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "groups" },
        fetchGroups
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_members" },
        fetchGroups
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [user?.id]);

  return {
    groups,
    loading,
    createGroup,
    joinGroup,
    leaveGroup,
    updateGroup,
    inviteMember,
    removeMember,
    changeRole,
    refetch: fetchGroups,
  };
}