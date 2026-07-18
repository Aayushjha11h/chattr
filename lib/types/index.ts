export type Profile = {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  bio: string;
  theme: string;
  online_status: boolean;
  last_seen: string;
  privacy_message: string;
  privacy_add: string;
  privacy_profile: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id?: string;
  group_id?: string;
  sender_id: string;
  content: string;
  type: string;
  reply_to: string | null;
  edited_at: string | null;
  deleted_for_me: string[];
  deleted_for_all: boolean;
  created_at: string;
  sender?: Profile;
  reactions?: any[];
  read_receipts?: any[];
  attachments?: any[];
};

export type Conversation = {
  id: string;
  type: "private" | "group";
  name: string;
  username?: string;
  avatar?: string;
  online?: boolean;
  lastSeen?: string;
  updatedAt: string;
  unreadCount?: number;
  lastMessage?: string;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  icon_url: string | null;
  visibility: "public" | "private";
  max_members: number;
  owner_id: string;
  only_admins_send: boolean;
  only_admins_edit: boolean;
  invite_link: string;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  recipient_id: string;
  sender_id: string | null;
  type: string;
  title: string;
  body: string;
  data: Record<string, any>;
  read: boolean;
  created_at: string;
};