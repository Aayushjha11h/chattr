"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageReactions } from "./message-reactions";
import { ReplyPreview } from "./reply-preview";
import { cn } from "@/lib/utils/cn";
import { format, isToday, isYesterday } from "date-fns";
import { Check, CheckCheck, MoreVertical, FileText, Image, Video, Music, File } from "lucide-react";

export function MessageBubble({ message, onContextMenu }: { message: any; onContextMenu?: (position: { x: number; y: number }) => void }) {
  const user = useAuthStore((s) => s.user);
  const { setReplyTo } = useUIStore();
  const isOwn = message.sender_id === user?.id;
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (menuButtonRef.current && onContextMenu) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      onContextMenu({ x: rect.left, y: rect.bottom + 5 });
    }
  };

  const handleReply = () => {
    setReplyTo(message.id);
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return format(d, "h:mm a");
    if (isYesterday(d)) return `Yesterday ${format(d, "h:mm a")}`;
    return format(d, "MMM d, h:mm a");
  };

  const renderContent = () => {
    if (message.deleted_for_all) {
      return <span className="italic text-muted-foreground">This message was deleted</span>;
    }

    switch (message.type) {
      case "image":
        const imageUrl = message.attachments?.[0]?.url || message.content;
        if (!imageUrl) return <p className="text-muted-foreground">Image not available</p>;
        return (
          <div className="space-y-2">
            <img
              src={imageUrl}
              alt="Image"
              className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {message.content && <p>{message.content}</p>}
          </div>
        );
      case "video":
        return (
          <video
            src={message.attachments?.[0]?.url || message.content}
            controls
            className="max-w-xs rounded-lg"
          />
        );
      case "audio":
      case "voice":
        return (
          <audio
            src={message.attachments?.[0]?.url || message.content}
            controls
            className="max-w-[200px]"
          />
        );
      case "file":
      case "pdf":
      case "doc":
      case "excel":
      case "zip":
        return (
          <a
            href={message.attachments?.[0]?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background transition-colors"
          >
            <FileText className="w-8 h-8 text-primary" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{message.attachments?.[0]?.file_name || "File"}</p>
              <p className="text-xs text-muted-foreground">
                {message.attachments?.[0]?.file_size
                  ? `${(message.attachments?.[0]?.file_size / 1024 / 1024).toFixed(1)} MB`
                  : ""}
              </p>
            </div>
          </a>
        );
      default:
        return <p className="whitespace-pre-wrap break-words">{message.content}</p>;
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 group",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      {!isOwn && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={message.sender?.avatar_url} />
          <AvatarFallback>{message.sender?.display_name?.[0] || "U"}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("max-w-[85%] flex flex-col", isOwn ? "items-end" : "items-start")}>
        {message.reply_to && (
          <ReplyPreview messageId={message.reply_to} isOwn={isOwn} />
        )}

        <div
          className={cn(
            "relative px-4 py-2.5 rounded-2xl",
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted text-foreground rounded-bl-sm"
          )}
        >
          {renderContent()}
          {message.edited_at && <span className="text-[10px] opacity-60 ml-1">(edited)</span>}
          <div className={cn("flex items-center gap-1 mt-1", isOwn ? "justify-end" : "justify-start")}>
            <span className="text-[10px] opacity-60">{formatTime(message.created_at)}</span>
            {isOwn && (
              <span className="opacity-60">
                {message.read_receipts?.length > 0 ? (
                  <CheckCheck className="w-3 h-3" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
              </span>
            )}
          </div>

          {/* 3-dot menu button */}
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 z-10 h-6 w-6"
            onClick={handleMenuToggle}
          >
            <MoreVertical className="w-3 h-3" />
          </Button>
        </div>

        <MessageReactions messageId={message.id} reactions={message.reactions || []} />

        {/* Reply button - visible on hover */}
        <button
          onClick={handleReply}
          className="opacity-0 group-hover:opacity-100 text-xs text-muted-foreground hover:text-foreground transition-all mt-1"
        >
          Reply
        </button>
      </div>
    </div>
  );
}