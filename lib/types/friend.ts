export type FriendStatus = "pending" | "accepted" | "blocked";

export type Friendship = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendStatus;
  created_at: string;
  updated_at: string;
};

export type BlockedUser = {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
};