"use client";

import { useConversations } from "@/hooks/use-conversations";
import { ConversationList } from "@/components/conversation/conversation-list";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageCircle, UserPlus, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ChatsPage() {
  const { conversations, loading } = useConversations();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Conversation List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        
        {conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <EmptyState
              icon={MessageCircle}
              title="No conversations yet"
              description="Start chatting by searching for friends or adding new ones"
            />
            <div className="flex gap-3 mt-6">
              <Link href="/search">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search Users
                </Button>
              </Link>
              <Link href="/friends">
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friends
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <ConversationList conversations={conversations} />
        )}
      </div>

      {/* Empty State - Desktop */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <EmptyState
          icon={MessageCircle}
          title="Select a chat"
          description="Choose a conversation from the list to start messaging"
        />
      </div>
    </div>
  );
}