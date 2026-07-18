"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { OnlineIndicator } from "@/components/shared/online-indicator";
import { Crown, Shield, User, MoreVertical, UserX, ArrowUp } from "lucide-react";
import { useGroups } from "@/hooks/use-groups";

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: User,
};

const roleColors = {
  owner: "text-yellow-500",
  admin: "text-blue-500",
  member: "text-muted-foreground",
};

export function GroupMembers({
  groupId,
  members,
  myRole,
}: {
  groupId: string;
  members: any[];
  myRole: string;
}) {
  const { removeMember, changeRole } = useGroups();
  const [loading, setLoading] = useState<string | null>(null);

  const canManage = myRole === "owner" || myRole === "admin";

  const handleRemove = async (userId: string) => {
    setLoading(userId);
    try {
      await removeMember(groupId, userId);
    } finally {
      setLoading(null);
    }
  };

  const handlePromote = async (userId: string) => {
    setLoading(userId);
    try {
      await changeRole(groupId, userId, "admin");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium mb-3">Members ({members.length})</h3>
      {members.map((member) => {
        const RoleIcon = roleIcons[member.role as keyof typeof roleIcons] || User;
        const roleColor = roleColors[member.role as keyof typeof roleColors] || "text-muted-foreground";

        return (
          <div
            key={member.user_id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={member.user?.avatar_url} />
                <AvatarFallback>{member.user?.display_name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <OnlineIndicator
                online={member.user?.online_status}
                className="absolute bottom-0 right-0 w-2.5 h-2.5"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-sm">{member.user?.display_name}</span>
                <RoleIcon className={`w-3.5 h-3.5 ${roleColor}`} />
              </div>
              <p className="text-xs text-muted-foreground">@{member.user?.username}</p>
            </div>

            <Badge variant="outline" className="text-xs capitalize">
              {member.role}
            </Badge>

            {canManage && member.role !== "owner" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {myRole === "owner" && member.role === "member" && (
                    <DropdownMenuItem onClick={() => handlePromote(member.user_id)}>
                      <ArrowUp className="w-4 h-4 mr-2 text-blue-500" />
                      Make Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => handleRemove(member.user_id)}
                    className="text-destructive"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      })}
    </div>
  );
}