"use client";

import { useFriends } from "@/hooks/use-friends";
import { FriendRequestCard } from "@/components/friends/friend-request-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";

export default function FriendRequestsPage() {
  const { receivedRequests, sentRequests, loading, acceptRequest, rejectRequest, cancelRequest } =
    useFriends();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold">Friend Requests</h1>
      </div>

      <Tabs defaultValue="received" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="received">
            Received
            {receivedRequests.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {receivedRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : receivedRequests.length > 0 ? (
            <div className="space-y-3">
              {receivedRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  type="received"
                  onAccept={() => acceptRequest(request.id)}
                  onReject={() => rejectRequest(request.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UserPlus}
              title="No pending requests"
              description="Friend requests you receive will appear here"
            />
          )}
        </TabsContent>

        <TabsContent value="sent" className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : sentRequests.length > 0 ? (
            <div className="space-y-3">
              {sentRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  type="sent"
                  onCancel={() => cancelRequest(request.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UserCheck}
              title="No sent requests"
              description="Requests you've sent will appear here"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}