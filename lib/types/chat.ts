export type MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "voice"
  | "file"
  | "pdf"
  | "doc"
  | "excel"
  | "zip";

export type Reaction = {
  id: string;
  message_id: string;
  message_type: "private" | "group";
  user_id: string;
  emoji: string;
  created_at: string;
};

export type ReadReceipt = {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
};

export type TypingStatus = {
  id: string;
  conversation_id: string;
  conversation_type: "private" | "group";
  user_id: string;
  started_at: string;
};