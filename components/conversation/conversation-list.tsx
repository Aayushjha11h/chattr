"use client";

import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/ui-store";
import { ConversationItem } from "./conversation-item";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ConversationList({ conversations }: { conversations: any[] }) {
  const router = useRouter();
  const { setActiveConversation } = useUIStore();

  const handleClick = (conv: any) => {
    setActiveConversation(conv.id, conv.type);
    router.push(`/${conv.type === "group" ? "groups" : "chats"}/${conv.id}`);
  };

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-2 space-y-1">
        {conversations.map((conv) => (
          <ConversationItem
            key={`${conv.type}-${conv.id}`}
            conversation={conv}
            onClick={() => handleClick(conv)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}