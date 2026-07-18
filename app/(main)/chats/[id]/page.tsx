"use client";

import { useParams } from "next/navigation";
import { useConversations } from "@/hooks/use-conversations";
import { ChatWindow } from "@/components/chat/chat-window";
import { ConversationList } from "@/components/conversation/conversation-list";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  const { id } = useParams();
  const { conversations, loading } = useConversations();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Conversation List - hidden on mobile when chat active */}
      <div className="hidden md:flex w-80 lg:w-96 border-r border-border flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex-shrink-0">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        <ConversationList conversations={conversations} />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {id ? (
          <ChatWindow conversationId={id as string} type="private" />
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="Select a chat"
            description="Choose a conversation to start messaging"
          />
        )}
      </div>
    </div>
  );
}