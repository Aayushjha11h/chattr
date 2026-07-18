"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";
import { CapacitorNotifications } from "@/lib/capacitor/notifications";

const supabase = getBrowserClient();

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useAuthStore((s) => s.user);
  const channelRef = useRef<any>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("recipient_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    
    const notifs = data || [];
    setNotifications(notifs);
    setUnreadCount(notifs.filter((n) => !n.read).length);
  }, [user]);

  const markAsRead = useCallback(
    async (id: string) => {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("recipient_id", user.id)
      .eq("read", false);
    
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    // Request notification permissions
    CapacitorNotifications.requestPermission();
    CapacitorNotifications.registerActionTypes();
    CapacitorNotifications.addListeners();

    fetchNotifications();

    // Remove previous channel if exists (prevents duplicate name error)
    if (channelRef.current) {
      console.log("Removing previous channel");
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Use UNIQUE channel name with timestamp
    const channelName = `notifications-${user.id}-${Date.now()}`;
    console.log("Creating unique channel:", channelName);

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const notification = payload.new as any;
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          // Show local notification
          CapacitorNotifications.schedule({
            title: notification.title || 'New Notification',
            body: notification.body || notification.message || 'You have a new notification',
            id: notification.id,
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      console.log("Cleanup: removing channel", channelName);
      void supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [user?.id]);

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}