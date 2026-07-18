"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OnlineIndicator } from "@/components/shared/online-indicator";
import { MessageCircle, MoreVertical, UserX, Ban } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function FriendList({
  friends,
  onRemove,
  onBlock,
}: {
  friends: any[];
  onRemove: (id: string) => void;
  onBlock: (id: string) => void;
}) {
  const router = useRouter();

  return (
    <div className="space-y-1">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
        >
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage src={friend.avatar_url} />
              <AvatarFallback>{friend.display_name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <OnlineIndicator online={friend.online_status} className="absolute bottom-0 right-0" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium">{friend.display_name}</h3>
            <p className="text-sm text-muted-foreground">
              {friend.online_status
                ? "Online"
                : friend.last_seen
                ? `Last seen ${formatDistanceToNow(new Date(friend.last_seen))} ago`
                : "Offline"}
            </p>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="h-8 w-8 rounded-md hover:bg-accent flex items-center justify-center transition-colors"
              onClick={() => router.push(`/chats/${friend.id}`)}
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 rounded-md hover:bg-accent flex items-center justify-center transition-colors">
                <MoreVertical className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onRemove(friend.friendship_id)}
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Remove Friend
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onBlock(friend.id)}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Block User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}