"use client";

import { getBrowserClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export function ReplyPreview({
  messageId,
  isOwn,
}: {
  messageId: string;
  isOwn: boolean;
}) {
  const [message, setMessage] = useState<any>(null);
  const supabase = getBrowserClient();

  useEffect(() => {
    supabase
      .from("private_messages")
      .select("content, sender:profiles(display_name)")
      .eq("id", messageId)
      .single()
      .then(({ data }) => setMessage(data));
  }, [messageId, supabase]);

  if (!message) return null;

  return (
    <div
      className={cn(
        "mb-1 px-2 py-1 rounded text-xs border-l-2",
        isOwn
          ? "border-primary-foreground/30 bg-primary-foreground/10"
          : "border-primary/30 bg-accent/50"
      )}
    >
      <p className="font-medium opacity-70">{message.sender?.display_name}</p>
      <p className="truncate opacity-60">{message.content}</p>
    </div>
  );
}