"use client";

import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils/cn";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "👏"];

export function MessageReactions({
  messageId,
  reactions,
}: {
  messageId: string;
  reactions: any[];
}) {
  const user = useAuthStore((s) => s.user);
  const supabase = getBrowserClient();
  const [showPicker, setShowPicker] = useState(false);

  const grouped = reactions.reduce((acc: any, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = { count: 0, users: [], hasSelf: false };
    acc[r.emoji].count++;
    acc[r.emoji].users.push(r.user_id);
    if (r.user_id === user?.id) acc[r.emoji].hasSelf = true;
    return acc;
  }, {});

  const toggleReaction = async (emoji: string) => {
    const existing = reactions.find((r) => r.emoji === emoji && r.user_id === user?.id);

    if (existing) {
      await supabase.from("message_reactions").delete().eq("id", existing.id);
    } else {
      await supabase.from("message_reactions").insert({
        message_id: messageId,
        message_type: "private", // or detect from context
        user_id: user?.id,
        emoji,
      });
    }
  };

  return (
    <div className="flex items-center gap-1 mt-1">
      {Object.entries(grouped).map(([emoji, data]: [string, any]) => (
        <button
          key={emoji}
          onClick={() => toggleReaction(emoji)}
          className={cn(
            "flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-colors",
            data.hasSelf
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-accent hover:bg-accent/80"
          )}
        >
          <span>{emoji}</span>
          <span>{data.count}</span>
        </button>
      ))}

      <button
        className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-accent transition-all"
        onClick={() => setShowPicker(!showPicker)}
      >
        <span className="text-xs">+</span>
      </button>

      <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-1">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                className="p-1.5 rounded hover:bg-accent transition-colors text-lg"
                onClick={() => {
                  toggleReaction(emoji);
                  setShowPicker(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}