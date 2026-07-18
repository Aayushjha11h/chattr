"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Lock, Globe, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function GroupList({
  groups,
  showJoin,
  onJoin,
}: {
  groups: any[];
  showJoin?: boolean;
  onJoin?: (groupId: string, password?: string) => void;
}) {
  const router = useRouter();

  return (
    <div className="space-y-1">
      {groups.map((group) => (
        <div
          key={group.id}
          onClick={() => group.isMember && router.push(`/groups/${group.id}`)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-colors",
            group.isMember ? "hover:bg-accent/50 cursor-pointer" : "bg-accent/20"
          )}
        >
          <Avatar className="w-12 h-12">
            <AvatarImage src={group.icon_url} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
              {group.name?.[0] || "G"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{group.name}</h3>
              {group.visibility === "private" && <Lock className="w-3 h-3 text-muted-foreground" />}
              {group.visibility === "public" && <Globe className="w-3 h-3 text-muted-foreground" />}
            </div>
            <p className="text-sm text-muted-foreground truncate">{group.description || "No description"}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {group.memberCount || 0}/{group.max_members}
              </Badge>
              {group.isMember && (
                <Badge variant="outline" className="text-xs">
                  {group.myRole}
                </Badge>
              )}
            </div>
          </div>

          {showJoin && onJoin && !group.isMember && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                const password = group.visibility === "private" ? prompt("Enter group password:") : undefined;
                onJoin(group.id, password || undefined);
              }}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Join
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}