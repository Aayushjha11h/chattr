"use client";

import { cn } from "@/lib/utils/cn";

export function OnlineIndicator({
  online,
  className,
}: {
  online?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "w-3 h-3 rounded-full border-2 border-background",
        online ? "bg-green-500" : "bg-gray-400",
        className
      )}
    />
  );
}