"use client";

import { cn } from "@/lib/utils/cn";

export function TypingIndicator({ users }: { users: any[] }) {
  const names = users.map((u) => u.user?.display_name || "Someone").join(", ");

  return (
    <div className="flex items-center gap-2 mb-4 ml-12">
      <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-muted">
        <div className="flex gap-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-typing [animation-delay:0.4s]" />
        </div>
        <span className="text-xs text-muted-foreground ml-1">{names} typing...</span>
      </div>
    </div>
  );
}