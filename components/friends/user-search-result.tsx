"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFriends } from "@/hooks/use-friends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Clock, UserX } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function UserSearchResult({ user }: { user: any }) {
  const router = useRouter();
  const { sendRequest, friends, receivedRequests, sentRequests } = useFriends();
  const [loading, setLoading] = useState(false);

  // Check relationship status
  const isFriend = friends.some((f) => f.id === user.id);
  const hasReceived = receivedRequests.some((r) => r.requester_id === user.id);
  const hasSent = sentRequests.some((r) => r.addressee_id === user.id);

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      await sendRequest(user.id);
    } finally {
      setLoading(false);
    }
  };

  const renderAction = () => {
    if (isFriend) {
      return (
        <Button variant="ghost" size="sm" disabled className="gap-1 text-green-500">
          <UserCheck className="w-4 h-4" />
          Friends
        </Button>
      );
    }

    if (hasReceived) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/friends/requests")}
          className="gap-1 text-yellow-500"
        >
          <Clock className="w-4 h-4" />
          Respond
        </Button>
      );
    }

    if (hasSent) {
      return (
        <Button variant="ghost" size="sm" disabled className="gap-1 text-muted-foreground">
          <Clock className="w-4 h-4" />
          Pending
        </Button>
      );
    }

    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleSendRequest}
        disabled={loading}
        className="gap-1"
      >
        <UserPlus className="w-4 h-4" />
        Add Friend
      </Button>
    );
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
      <Avatar className="w-12 h-12">
        <AvatarImage src={user.avatar_url} />
        <AvatarFallback>{user.display_name?.[0] || "U"}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium">{user.display_name}</h3>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
        {user.bio && <p className="text-xs text-muted-foreground truncate mt-0.5">{user.bio}</p>}
      </div>

      {renderAction()}
    </div>
  );
}