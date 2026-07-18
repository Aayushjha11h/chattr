export type NotificationType =
  | "message"
  | "friend_request"
  | "friend_accepted"
  | "group_invite"
  | "mention"
  | "group_announcement";

export type NotificationData = {
  conversation_id?: string;
  group_id?: string;
  message_id?: string;
  sender_name?: string;
};