"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OnlineIndicator } from "@/components/shared/online-indicator";
import { cn } from "@/lib/utils/cn";
import { formatDistanceToNow } from "date-fns";

export function ConversationItem({
  conversation,
  onClick,
  isActive = false,
}: {
  conversation: any;
  onClick: () => void;
  isActive?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
        "hover:bg-accent/50 active:scale-[0.98]",
        isActive && "bg-primary/10"
      )}
    >
      <div className="relative">
        <Avatar className="w-12 h-12 ring-2 ring-transparent transition-all">
          <AvatarImage src={conversation.avatar} />
          <AvatarFallback>{conversation.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        {conversation.type === "private" && (
          <OnlineIndicator online={conversation.online} className="absolute bottom-0 right-0" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={cn("font-medium truncate", isActive && "text-primary")}>{conversation.name}</h3>
          <span className="text-xs text-muted-foreground shrink-0">
            {conversation.updatedAt && formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: false })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {conversation.type === "group" ? "Group" : `@${conversation.username}`}
        </p>
      </div>
    </div>
  );
}