"use client";

import { useRouter } from "next/navigation";
import { useGroups } from "@/hooks/use-groups";
import { GroupList } from "@/components/groups/group-list";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Search, Loader2 } from "lucide-react";
import { useState } from "react";

export default function GroupsPage() {
  const router = useRouter();
  const { groups, loading, joinGroup } = useGroups();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myGroups = filteredGroups.filter((g) => g.isMember);
  const publicGroups = filteredGroups.filter((g) => g.visibility === "public" && !g.isMember);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Groups</h1>
          <Button onClick={() => router.push("/groups/create")} className="gap-2">
            <Plus className="w-4 h-4" />
            Create
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="my" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="my">
            My Groups
            {myGroups.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {myGroups.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="my" className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : myGroups.length > 0 ? (
            <GroupList groups={myGroups} />
          ) : (
            <EmptyState
              icon={Users}
              title="No groups yet"
              description="Create a group or join one to get started"
            />
          )}
        </TabsContent>

        <TabsContent value="discover" className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : publicGroups.length > 0 ? (
            <GroupList groups={publicGroups} showJoin onJoin={joinGroup} />
          ) : (
            <EmptyState
              icon={Search}
              title="No public groups"
              description="Public groups will appear here"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}