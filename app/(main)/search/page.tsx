"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";
import { UserSearchResult } from "@/components/friends/user-search-result";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, MessageCircle, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);
  const supabase = getBrowserClient();

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
        setUsers([]);
        setMessages([]);
        return;
      }

      setLoading(true);

      // Search users
      const { data: userResults } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, bio")
        .or(`username.ilike.%${debouncedQuery}%,display_name.ilike.%${debouncedQuery}%`)
        .neq("id", user?.id || "")
        .limit(20);

      setUsers(userResults || []);

      // Search messages (in user's conversations)
      const { data: messageResults } = await supabase
        .from("private_messages")
        .select(`
          id, content, created_at,
          conversation:private_conversations(id),
          sender:profiles(id, username, display_name, avatar_url)
        `)
        .ilike("content", `%${debouncedQuery}%`)
        .limit(20);

      setMessages(messageResults || []);
      setLoading(false);
    };

    search();
  }, [debouncedQuery, supabase, user]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold mb-4">Search</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users, messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>
      </div>

      <Tabs defaultValue="users" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageCircle className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-2">
              {users.map((u) => (
                <UserSearchResult key={u.id} user={u} />
              ))}
            </div>
          ) : debouncedQuery.length >= 2 ? (
            <EmptyState
              icon={Search}
              title="No users found"
              description="Try a different search term"
            />
          ) : (
            <EmptyState
              icon={Search}
              title="Start searching"
              description="Type at least 2 characters to search"
            />
          )}
        </TabsContent>

        <TabsContent value="messages" className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{msg.sender?.display_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{msg.content}</p>
                </div>
              ))}
            </div>
          ) : debouncedQuery.length >= 2 ? (
            <EmptyState
              icon={Search}
              title="No messages found"
              description="Try a different search term"
            />
          ) : (
            <EmptyState
              icon={Search}
              title="Start searching"
              description="Type at least 2 characters to search"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}