"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Lock, Globe } from "lucide-react";

export function GroupCard({ group }: { group: any }) {
  return (
    <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-14 h-14">
            <AvatarImage src={group.icon_url} />
            <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
              {group.name?.[0] || "G"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{group.name}</h3>
              {group.visibility === "private" ? (
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {group.description || "No description"}
            </p>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {group.memberCount || 0} members
              </Badge>
              {group.only_admins_send && (
                <Badge variant="outline" className="text-xs">
                  Admin only
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}