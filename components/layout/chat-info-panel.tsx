"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupMembers } from "@/components/groups/group-members";
import { GroupSettings } from "@/components/groups/group-settings";
import { ComingSoonDialog } from "@/components/shared/coming-soon-dialog";
import {
  Phone,
  Video,
  Bell,
  BellOff,
  Pin,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  Ban,
  Trash2,
  LogOut,
} from "lucide-react";

export function ChatInfoPanel({
  conversationId,
  type,
}: {
  conversationId: string;
  type: "private" | "group";
}) {
  const [muted, setMuted] = useState(false);
  const [info, setInfo] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [featureName, setFeatureName] = useState("");
  const user = useAuthStore((s) => s.user);
  const supabase = getBrowserClient();

  useEffect(() => {
    const fetchInfo = async () => {
      if (type === "private") {
        const { data } = await supabase
          .from("private_conversations")
          .select(`
            *,
            user1:profiles!private_conversations_user1_id_fkey(*),
            user2:profiles!private_conversations_user2_id_fkey(*)
          `)
          .eq("id", conversationId)
          .single();
        setInfo(data);
      } else {
        const { data } = await supabase
          .from("groups")
          .select("*")
          .eq("id", conversationId)
          .single();
        setInfo(data);

        const { data: membersData } = await supabase
          .from("group_members")
          .select("*, user:profiles(*)")
          .eq("group_id", conversationId);
        setMembers(membersData || []);
      }
    };

    fetchInfo();
  }, [conversationId, type, supabase]);

  const otherUser = type === "private" && info
    ? info.user1_id === user?.id ? info.user2 : info.user1
    : null;

  const myRole = type === "group"
    ? members.find((m) => m.user_id === user?.id)?.role
    : null;

  return (
    <div className="h-full flex flex-col bg-card/30 overflow-hidden">
      <ScrollArea className="flex-1 h-full">
        {/* Profile/Group Section */}
        <div className="p-6 text-center border-b border-border">
          <Avatar className="w-20 h-20 mx-auto mb-3">
            <AvatarImage src={otherUser?.avatar_url || info?.icon_url} />
            <AvatarFallback className="text-2xl">
              {(otherUser?.display_name || info?.name)?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">{otherUser?.display_name || info?.name}</h3>
          <p className="text-sm text-muted-foreground">
            {type === "private" ? `@${otherUser?.username}` : `${members.length} members`}
          </p>

          <div className="flex justify-center gap-2 mt-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => {
                setFeatureName("Voice Call");
                setComingSoonOpen(true);
              }}
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={() => {
                setFeatureName("Video Call");
                setComingSoonOpen(true);
              }}
            >
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => setMuted(!muted)}>
              {muted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {type === "group" ? (
          <>
            <GroupMembers groupId={conversationId} members={members} myRole={myRole} />
            <GroupSettings group={info} myRole={myRole} />
            <div className="p-4 border-t border-border">
              <Button variant="destructive" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Leave Group
              </Button>
            </div>
          </>
        ) : (
          <>
            <Tabs defaultValue="media" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>
              <TabsContent value="media" className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-accent flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="files" className="p-4">
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-accent">
                      <FileText className="w-8 h-8 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Document.pdf</p>
                        <p className="text-xs text-muted-foreground">2.4 MB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="links" className="p-4">
                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-accent">
                      <LinkIcon className="w-5 h-5 text-primary" />
                      <p className="text-sm truncate">https://example.com</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="p-4 border-t border-border space-y-2">
              <Button variant="ghost" className="w-full justify-start text-yellow-500">
                <Pin className="w-4 h-4 mr-2" />
                Pin Chat
              </Button>
              <Button variant="ghost" className="w-full justify-start text-destructive">
                <Ban className="w-4 h-4 mr-2" />
                Block User
              </Button>
              <Button variant="ghost" className="w-full justify-start text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Chat
              </Button>
            </div>
          </>
        )}
      </ScrollArea>

      <ComingSoonDialog 
        open={comingSoonOpen} 
        onOpenChange={setComingSoonOpen} 
        feature={featureName}
      />
    </div>
  );
}