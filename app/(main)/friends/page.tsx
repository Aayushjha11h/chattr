"use client";

import { useState, useEffect } from "react";
import { useFriends } from "@/hooks/use-friends";
import { FriendList } from "@/components/friends/friend-list";
import { UserSearchResult } from "@/components/friends/user-search-result";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";

export default function FriendsPage() {
  const { friends, loading, removeFriend, blockUser } = useFriends();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const user = useAuthStore((s) => s.user);
  const supabase = getBrowserClient();

  const handleSearch = async () => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio")
      .or(`username.ilike.%${debouncedQuery}%,display_name.ilike.%${debouncedQuery}%`)
      .neq("id", user?.id || "")
      .limit(20);

    setSearchResults(data || []);
    setSearching(false);
  };

  // Trigger search when debounced query changes
  useEffect(() => {
    handleSearch();
  }, [debouncedQuery]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold mb-4">Friends</h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by username or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {searchQuery.trim() ? (
        <div className="flex-1 overflow-auto p-4">
          {searching ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <UserSearchResult key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No users found"
              description="Try a different search term"
            />
          )}
        </div>
      ) : (
        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="all">All Friends</TabsTrigger>
            <TabsTrigger value="online">Online</TabsTrigger>
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 overflow-auto p-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : friends.length > 0 ? (
              <FriendList
                friends={friends}
                onRemove={removeFriend}
                onBlock={blockUser}
              />
            ) : (
              <EmptyState
                icon={Users}
                title="No friends yet"
                description="Search for users and send friend requests"
              />
            )}
          </TabsContent>

          <TabsContent value="online" className="flex-1 overflow-auto p-4">
            <FriendList
              friends={friends.filter((f) => f.online_status)}
              onRemove={removeFriend}
              onBlock={blockUser}
            />
          </TabsContent>

          <TabsContent value="blocked" className="flex-1 overflow-auto p-4">
            <EmptyState
              icon={UserPlus}
              title="No blocked users"
              description="Users you block will appear here"
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}