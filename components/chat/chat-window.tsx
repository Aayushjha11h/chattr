"use client";

import { useParams } from "next/navigation";
import { useMessages } from "@/hooks/use-messages";
import { useTyping } from "@/hooks/use-typing";
import { useUIStore } from "@/store/ui-store";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { ChatInfoPanel } from "@/components/layout/chat-info-panel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OnlineIndicator } from "@/components/shared/online-indicator";
import { ComingSoonDialog } from "@/components/shared/coming-soon-dialog";
import { Button } from "@/components/ui/button";
import { Phone, Video, Info, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface ChatWindowProps {
  conversationId: string;
  type: "private" | "group";
}

export function ChatWindow({ conversationId, type }: ChatWindowProps) {
  const router = useRouter();
  const isMobile = useMobile();
  const { showInfoPanel, toggleInfoPanel } = useUIStore();
  const { messages, loading, hasMore, loadMore, sendMessage, editMessage, deleteMessage } =
    useMessages(conversationId, type);
  const { typingUsers, startTyping, stopTyping } = useTyping(conversationId, type);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [featureName, setFeatureName] = useState("");

  const otherUser = messages.find((m) => m.sender_id !== m.currentUserId)?.sender;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="h-16 border-b border-border flex items-center px-4 gap-3 bg-card/50 flex-shrink-0">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => router.push("/chats")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}

        <Avatar className="w-10 h-10">
          <AvatarImage src={otherUser?.avatar_url} />
          <AvatarFallback>{otherUser?.display_name?.[0] || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{otherUser?.display_name || "Chat"}</h3>
          {type === "private" && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {otherUser?.online_status ? (
                <>
                  <OnlineIndicator online={true} className="w-2 h-2" />
                  Online
                </>
              ) : (
                `Last seen ${otherUser?.last_seen ? new Date(otherUser.last_seen).toLocaleTimeString() : "recently"}`
              )}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden sm:flex"
            onClick={() => {
              setFeatureName("Voice Call");
              setComingSoonOpen(true);
            }}
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden sm:flex"
            onClick={() => {
              setFeatureName("Video Call");
              setComingSoonOpen(true);
            }}
          >
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleInfoPanel}>
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages + Info Panel */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          <MessageList
            messages={messages}
            loading={loading}
            hasMore={hasMore}
            loadMore={loadMore}
            typingUsers={typingUsers}
          />
          <MessageInput
            onSend={sendMessage}
            onTypingStart={startTyping}
            onTypingStop={stopTyping}
          />
        </div>

        {showInfoPanel && (
          <div className="hidden lg:block w-80 border-l border-border overflow-hidden flex-shrink-0">
            <ChatInfoPanel conversationId={conversationId} type={type} />
          </div>
        )}
      </div>

      <ComingSoonDialog 
        open={comingSoonOpen} 
        onOpenChange={setComingSoonOpen} 
        feature={featureName}
      />
    </div>
  );
}