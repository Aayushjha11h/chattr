"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, UserX, X } from "lucide-react";

export function FriendRequestCard({
  request,
  type,
  onAccept,
  onReject,
  onCancel,
}: {
  request: any;
  type: "received" | "sent";
  onAccept?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
}) {
  const user = type === "received" ? request.requester : request.addressee;

  return (
    <Card className="border-0 shadow-none bg-accent/30">
      <CardContent className="p-4 flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>{user?.display_name?.[0] || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium">{user?.display_name}</h3>
          <p className="text-sm text-muted-foreground">@{user?.username}</p>
        </div>

        {type === "received" ? (
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={onAccept} className="gap-1">
              <UserCheck className="w-4 h-4" />
              Accept
            </Button>
            <Button size="sm" variant="ghost" onClick={onReject} className="gap-1 text-destructive">
              <UserX className="w-4 h-4" />
              Reject
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="ghost" onClick={onCancel} className="gap-1 text-destructive">
            <X className="w-4 h-4" />
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  );
}