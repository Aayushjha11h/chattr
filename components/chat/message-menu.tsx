"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useUIStore } from "@/store/ui-store";
import { useMessages } from "@/hooks/use-messages";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  Reply,
  Pencil,
  Copy,
  Trash2,
  Forward,
  Pin,
  Star,
} from "lucide-react";

export function MessageMenu({
  message,
  isOwn,
  onClose,
  conversationId,
  type,
  position,
}: {
  message: any;
  isOwn: boolean;
  onClose: () => void;
  conversationId: string;
  type: "private" | "group";
  position: { x: number; y: number };
}) {
  const { setReplyTo } = useUIStore();
  const { editMessage, deleteMessage } = useMessages(conversationId, type);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: position.y, left: position.x });

  useEffect(() => {
    if (menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let adjustedTop = position.y;
      let adjustedLeft = position.x;
      
      // Prevent menu from going off right edge
      if (position.x + rect.width > viewportWidth) {
        adjustedLeft = viewportWidth - rect.width - 10;
      }
      
      // Prevent menu from going off bottom edge
      if (position.y + rect.height > viewportHeight) {
        adjustedTop = viewportHeight - rect.height - 10;
      }
      
      setMenuPosition({ top: adjustedTop, left: adjustedLeft });
    }
  }, [position]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onClose();
  };

  const handleDelete = async (forEveryone: boolean) => {
    await deleteMessage(message.id, forEveryone);
    onClose();
  };

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== message.content) {
      await editMessage(message.id, editContent);
    }
    setEditMode(false);
    onClose();
  };

  const menuItems = [
    { icon: Reply, label: "Reply", action: () => { setReplyTo(message.id); onClose(); } },
    { icon: Copy, label: "Copy", action: handleCopy },
    ...(isOwn
      ? [
          { icon: Pencil, label: "Edit", action: () => setEditMode(true) },
          { icon: Forward, label: "Forward", action: () => {} },
          { icon: Pin, label: "Pin", action: () => {} },
          { icon: Star, label: "Star", action: () => {} },
          { icon: Trash2, label: "Delete for me", action: () => handleDelete(false) },
          { icon: Trash2, label: "Delete for everyone", action: () => handleDelete(true), destructive: true },
        ]
      : [
          { icon: Forward, label: "Forward", action: () => {} },
          { icon: Star, label: "Star", action: () => {} },
          { icon: Trash2, label: "Delete for me", action: () => handleDelete(false) },
        ]),
  ];

  if (editMode) {
    return createPortal(
      <div 
        ref={menuRef}
        className="fixed z-[9999] bg-card border border-border rounded-lg shadow-lg p-2"
        style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
      >
        <input
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full px-2 py-1 text-sm bg-accent rounded"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleEdit()}
        />
        <div className="flex justify-end gap-1 mt-2">
          <Button size="sm" variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
          <Button size="sm" onClick={handleEdit}>Save</Button>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div 
      ref={menuRef}
      className="fixed z-[9999] bg-card border border-border rounded-lg shadow-lg py-1 min-w-[160px] max-h-[60vh] overflow-y-auto"
      style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
    >
      {menuItems.map((item, i) => (
        <button
          key={i}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent transition-colors whitespace-nowrap",
            item.destructive && "text-destructive hover:bg-destructive/10"
          )}
          onClick={() => {
            item.action();
            if (!editMode) onClose();
          }}
        >
          <item.icon className="w-4 h-4 flex-shrink-0" />
          {item.label}
        </button>
      ))}
    </div>,
    document.body
  );
}