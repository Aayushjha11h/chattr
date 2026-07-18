"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { MessageBubble } from "./message-bubble";
import { MessageMenu } from "./message-menu";
import { TypingIndicator } from "./typing-indicator";
import { DateSeparator } from "./date-sparator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useAuthStore } from "@/store/auth-store";

interface MessageListProps {
  messages: any[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  typingUsers: any[];
}

export function MessageList({ messages, loading, hasMore, loadMore, typingUsers }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { ref: loadMoreRef, inView } = useInfiniteScroll();
  const user = useAuthStore((s) => s.user);
  const [menuState, setMenuState] = useState<{ show: boolean; message: any; position: { x: number; y: number } }>({
    show: false,
    message: null,
    position: { x: 0, y: 0 }
  });

  const handleContextMenu = (message: any, position: { x: number; y: number }) => {
    setMenuState({ show: true, message, position });
  };

  const closeMenu = () => {
    setMenuState({ show: false, message: null, position: { x: 0, y: 0 } });
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (menuState.show) closeMenu();
    };

    if (menuState.show) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuState.show]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current && messages.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Load more when scrolling up
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups: any, message) => {
    const date = new Date(message.created_at).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
            <Skeleton className="h-12 w-48 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 min-h-0 overflow-y-auto" ref={scrollRef}>
      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Messages */}
      {Object.entries(groupedMessages).reverse().map(([date, msgs]: [string, any]) => (
        <div key={date}>
          <DateSeparator date={date} />
          {(msgs as any[]).reverse().map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              onContextMenu={(position) => handleContextMenu(message, position)}
            />
          ))}
        </div>
      ))}

      {/* Typing indicators */}
      {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}

      <div ref={bottomRef} />

      {/* Context Menu */}
      {menuState.show && menuState.message && (
        <MessageMenu
          message={menuState.message}
          isOwn={menuState.message.sender_id === user?.id}
          onClose={closeMenu}
          conversationId={menuState.message.conversation_id || menuState.message.group_id}
          type={menuState.message.conversation_id ? "private" : "group"}
          position={menuState.position}
        />
      )}
    </div>
  );
}