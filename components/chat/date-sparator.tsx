"use client";

import { format, isToday, isYesterday } from "date-fns";

export function DateSeparator({ date }: { date: string }) {
  const d = new Date(date);
  let label = format(d, "MMMM d, yyyy");

  if (isToday(d)) label = "Today";
  else if (isYesterday(d)) label = "Yesterday";

  return (
    <div className="flex items-center justify-center my-4">
      <div className="px-3 py-1 rounded-full bg-accent/50 text-xs text-muted-foreground font-medium">
        {label}
      </div>
    </div>
  );
}