import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";

export function formatMessageTime(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return `Yesterday ${format(d, "h:mm a")}`;
  return format(d, "MMM d, h:mm a");
}

export function formatLastSeen(date: string | Date): string {
  const d = new Date(date);
  const minutes = differenceInMinutes(new Date(), d);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (isToday(d)) return format(d, "'Today at' h:mm a");
  if (isYesterday(d)) return format(d, "'Yesterday at' h:mm a");
  return format(d, "MMM d, yyyy");
}

export function formatConversationTime(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d");
}