"use client";

import { useState } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, UserPlus, MessageCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDistanceToNow } from "date-fns";

const iconMap = {
  message: MessageCircle,
  friend_request: UserPlus,
  friend_accepted: UserPlus,
  group_invite: Users,
  mention: MessageCircle,
  group_announcement: Users,
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Don't use asChild - let PopoverTrigger render its own button, style it with className */}
      <PopoverTrigger className="relative inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent transition-colors">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <button
              className="text-sm text-primary hover:underline"
              onClick={markAllAsRead}
            >
              Mark all read
            </button>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notif) => {
                const Icon = iconMap[notif.type as keyof typeof iconMap] || Bell;
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-3 hover:bg-accent/50 cursor-pointer transition-colors",
                      !notif.read && "bg-primary/5"
                    )}
                    onClick={() => {
                      markAsRead(notif.id);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notif.body}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}