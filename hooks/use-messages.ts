"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";

const supabase = getBrowserClient();
const MESSAGES_PER_PAGE = 30;

export function useMessages(conversationId: string, type: "private" | "group") {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);
  const user = useAuthStore((s) => s.user);
  const channelRef = useRef<any>(null);

  const table = type === "private" ? "private_messages" : "group_messages";
  const idColumn = type === "private" ? "conversation_id" : "group_id";

  const fetchMessages = useCallback(
    async (page: number) => {
      const from = page * MESSAGES_PER_PAGE;
      const to = from + MESSAGES_PER_PAGE - 1;

      const { data } = await supabase
        .from(table)
        .select(`
          *,
          sender:profiles(id, username, display_name, avatar_url)
        `)
        .eq(idColumn, conversationId)
        .order("created_at", { ascending: false })
        .range(from, to);

      // Fetch attachments separately for each message
      if (data && data.length > 0) {
        const messageIds = data.map((m: any) => m.id);
        const { data: attachments } = await supabase
          .from('attachments')
          .select('*')
          .in('message_id', messageIds);

        // Attach attachments to their messages
        if (attachments) {
          const attachmentsByMessage = attachments.reduce((acc: any, att: any) => {
            if (!acc[att.message_id]) acc[att.message_id] = [];
            acc[att.message_id].push(att);
            return acc;
          }, {});

          data.forEach((message: any) => {
            message.attachments = attachmentsByMessage[message.id] || [];
          });
        }
      }

      return data || [];
    },
    [conversationId, table, idColumn]
  );

  const loadMore = useCallback(async () => {
    const nextPage = pageRef.current + 1;
    const olderMessages = await fetchMessages(nextPage);

    if (olderMessages.length < MESSAGES_PER_PAGE) {
      setHasMore(false);
    }

    setMessages((prev) => [...prev, ...olderMessages]);
    pageRef.current = nextPage;
  }, [fetchMessages]);

  const sendMessage = useCallback(
    async (content: string, msgType: string = "text", replyTo?: string, attachments?: any[]) => {
      if (!user) return;

      // Upload attachments to storage first
      const uploadedAttachments = [];
      if (attachments && attachments.length > 0) {
        for (const attachment of attachments) {
          const file = attachment.file;
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${user.id}/${conversationId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('attachments')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('attachments')
            .getPublicUrl(filePath);

          uploadedAttachments.push({
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            storage_path: filePath,
            url: publicUrl,
          });
        }
      }

      const payload: any = {
        [idColumn]: conversationId,
        sender_id: user.id,
        content,
        type: msgType,
      };

      if (replyTo) payload.reply_to = replyTo;

      // Optimistic update - add message to UI immediately
      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        id: tempId,
        [idColumn]: conversationId,
        sender_id: user.id,
        content,
        type: msgType,
        created_at: new Date().toISOString(),
        sender: user,
        reactions: [],
        read_receipts: [],
        currentUserId: user.id,
        attachments: uploadedAttachments,
        reply_to: replyTo,
      };

      setMessages((prev) => [tempMessage, ...prev]);

      const { data, error } = await supabase.from(table).insert(payload).select().single();

      if (error) {
        // Remove temp message on error
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        throw error;
      }

      // Insert attachment records
      if (uploadedAttachments.length > 0) {
        for (const attachment of uploadedAttachments) {
          await supabase.from("attachments").insert({
            message_id: data.id,
            message_type: type === "private" ? "private" : "group",
            ...attachment,
          });
        }
      }

      // Replace temp message with real message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...data,
                sender: user,
                reactions: [],
                read_receipts: [],
                currentUserId: user.id,
                attachments: uploadedAttachments,
              }
            : m
        )
      );

      return data;
    },
    [user, conversationId, table, idColumn, type]
  );

  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      const { error } = await supabase
        .from(table)
        .update({ content: newContent, edited_at: new Date().toISOString() })
        .eq("id", messageId);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, content: newContent, edited_at: new Date().toISOString() } : m))
      );
    },
    [table]
  );

  const deleteMessage = useCallback(
    async (messageId: string, forEveryone: boolean = false) => {
      if (forEveryone) {
        await supabase.from(table).update({ deleted_for_all: true }).eq("id", messageId);
      } else {
        // For delete for me, we'll use a simpler approach - get current deleted_for_me array and append user ID
        const { data: currentMessage } = await supabase.from(table).select("deleted_for_me").eq("id", messageId).single();
        const currentDeleted = currentMessage?.deleted_for_me || [];
        await supabase.from(table).update({ deleted_for_me: [...currentDeleted, user?.id] }).eq("id", messageId);
      }

      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    },
    [table, user]
  );

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    pageRef.current = 0;
    setHasMore(true);

    fetchMessages(0).then((data) => {
      setMessages(data);
      setLoading(false);
      if (data.length < MESSAGES_PER_PAGE) setHasMore(false);
    });

    if (type === "private" && user) {
      supabase
        .from("private_messages")
        .update({ read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id)
        .eq("read", false);
    }
  }, [conversationId, type, user, fetchMessages]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    // Remove existing channel before creating new one
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channelName = `messages-${conversationId}-${user.id}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table,
          filter: `${idColumn}=eq.${conversationId}`,
        },
        async (payload) => {
          console.log('Realtime INSERT received:', payload);
          const { data } = await supabase
            .from(table)
            .select("*, sender:profiles(id, username, display_name, avatar_url)")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            // Fetch attachments for this message
            const { data: attachments } = await supabase
              .from('attachments')
              .select('*')
              .eq('message_id', data.id);

            data.attachments = attachments || [];

            setMessages((prev) => {
              // Check if message already exists (from optimistic update)
              const existingIndex = prev.findIndex((m) => m.id === data.id);
              if (existingIndex !== -1) {
                // Replace the temp message with real data
                const updated = [...prev];
                updated[existingIndex] = { ...data, currentUserId: user?.id };
                return updated;
              }
              // Add new message if it doesn't exist
              return [{ ...data, currentUserId: user?.id }, ...prev];
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table,
          filter: `${idColumn}=eq.${conversationId}`,
        },
        (payload) => {
          console.log('Realtime UPDATE received:', payload);
          setMessages((prev) =>
            prev.map((m) => (m.id === payload.new.id ? { ...m, ...payload.new } : m))
          );
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to channel:', channelName);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Channel error:', channelName);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId, user?.id, table, idColumn]);

  return { messages, loading, hasMore, loadMore, sendMessage, editMessage, deleteMessage };
}
