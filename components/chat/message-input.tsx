"use client";

import { useState, useRef, useCallback } from "react";
import { useUIStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  X,
  Reply,
  Image as ImageIcon,
} from "lucide-react";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface MessageInputProps {
  onSend: (content: string, type?: string, replyTo?: string, attachments?: any[]) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

export function MessageInput({
  onSend,
  onTypingStart,
  onTypingStop,
}: MessageInputProps) {
  const { replyTo, setReplyTo } = useUIStore();
  const [content, setContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = useCallback(() => {
    onTypingStart();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(onTypingStop, 3000);
  }, [onTypingStart, onTypingStop]);

  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return;

    const type = attachments.length > 0 ? attachments[0].type : "text";
    onSend(content.trim(), type, replyTo || undefined, attachments);
    setContent("");
    setAttachments([]);
    setShowEmoji(false);
    setReplyTo(null);
    onTypingStop();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setContent((prev) => prev + emoji.emoji);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const type = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("audio/")
        ? "audio"
        : "file";

      setAttachments((prev) => [
        ...prev,
        {
          file,
          type,
          name: file.name,
          size: file.size,
          preview: type === "image" ? URL.createObjectURL(file) : null,
        },
      ]);
    });
  };

  return (
    <div className="border-t border-border p-3 bg-card/50 backdrop-blur-xl">
      {/* Reply Preview */}
      {replyTo && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-accent/50 rounded-lg">
          <Reply className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground flex-1 truncate">Replying to message</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReplyTo(null)}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto">
          {attachments.map((att, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg bg-accent flex items-center justify-center">
              {att.preview ? (
                <img src={att.preview} alt="" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              )}
              <button
                className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center"
                onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => setShowEmoji(!showEmoji)}
          >
            <Smile className="w-5 h-5" />
          </Button>
          {showEmoji && (
            <div className="absolute bottom-12 left-0 z-50">
              <EmojiPicker onEmojiClick={handleEmojiSelect} width={300} height={400} />
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon" className="h-10 w-10" asChild>
          <label>
            <Paperclip className="w-5 h-5" />
            <input type="file" className="hidden" multiple onChange={handleFileSelect} />
          </label>
        </Button>

        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
          onBlur={onTypingStop}
          placeholder="Type a message..."
          className="flex-1 min-h-[40px] max-h-32 resize-none py-2.5"
          rows={1}
        />

        {content.trim() || attachments.length > 0 ? (
          <Button size="icon" className="h-10 w-10 rounded-full" onClick={handleSend}>
            <Send className="w-4 h-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setIsRecording(!isRecording)}>
            <Mic className={cn("w-5 h-5", isRecording && "text-red-500 animate-pulse")} />
          </Button>
        )}
      </div>
    </div>
  );
}