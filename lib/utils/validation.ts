import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
  displayName: z.string().min(1, "Display name is required").max(50),
});

export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/)
    .optional(),
  theme: z.enum(["dark", "light", "system"]).optional(),
  privacyMessage: z.enum(["everyone", "friends", "nobody"]).optional(),
  privacyAdd: z.enum(["everyone", "friends", "nobody"]).optional(),
  privacyProfile: z.enum(["everyone", "friends", "nobody"]).optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1).max(4000),
  type: z.enum(["text", "image", "video", "audio", "voice", "file", "pdf", "doc", "excel", "zip"]),
  replyTo: z.string().uuid().optional(),
});

export const groupCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  visibility: z.enum(["public", "private"]),
  password: z.string().min(4).optional(),
  maxMembers: z.number().min(2).max(5000).default(500),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type GroupCreateInput = z.infer<typeof groupCreateSchema>;