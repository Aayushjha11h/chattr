"use client";

import { useParams } from "next/navigation";
import { useGroups } from "@/hooks/use-groups";
import { ChatWindow } from "@/components/chat/chat-window";
import { GroupList } from "@/components/groups/group-list";
import { EmptyState } from "@/components/shared/empty-state";
import { MessageCircle, Loader2 } from "lucide-react";

export default function GroupChatPage() {
  const { id } = useParams();
  const { groups, loading } = useGroups();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden">
      <div className="hidden md:flex w-80 lg:w-96 border-r border-border flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex-shrink-0">
          <h1 className="text-xl font-bold">Groups</h1>
        </div>
        <GroupList groups={groups.filter((g) => g.isMember)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {id ? (
          <ChatWindow conversationId={id as string} type="group" />
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="Select a group"
            description="Choose a group to start messaging"
          />
        )}
      </div>
    </div>
  );
}