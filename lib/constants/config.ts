export const APP_NAME = "Chatr";
export const APP_DESCRIPTION = "Premium real-time messaging";

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VOICE_DURATION = 300; // 5 minutes

export const ACCEPTED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/zip",
  ],
};

export const MESSAGE_TYPES = {
  text: "text",
  image: "image",
  video: "video",
  audio: "audio",
  voice: "voice",
  file: "file",
  pdf: "pdf",
  doc: "doc",
  excel: "excel",
  zip: "zip",
} as const;

export const FRIEND_STATUS = {
  pending: "pending",
  accepted: "accepted",
  blocked: "blocked",
} as const;

export const GROUP_VISIBILITY = {
  public: "public",
  private: "private",
} as const;

export const GROUP_ROLE = {
  owner: "owner",
  admin: "admin",
  member: "member",
} as const;

export const PRIVACY_OPTIONS = {
  everyone: "everyone",
  friends: "friends",
  nobody: "nobody",
} as const;