import { create } from "zustand";

interface ChatState {
  activeConversation: string | null;
  activeConversationType: "private" | "group" | null;
  replyTo: string | null;
  showInfoPanel: boolean;
  pinnedMessages: string[];
  setActiveConversation: (id: string | null, type: "private" | "group" | null) => void;
  setReplyTo: (messageId: string | null) => void;
  setShowInfoPanel: (show: boolean) => void;
  toggleInfoPanel: () => void;
  pinMessage: (messageId: string) => void;
  unpinMessage: (messageId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversation: null,
  activeConversationType: null,
  replyTo: null,
  showInfoPanel: false,
  pinnedMessages: [],
  setActiveConversation: (id, type) => set({ activeConversation: id, activeConversationType: type }),
  setReplyTo: (messageId) => set({ replyTo: messageId }),
  setShowInfoPanel: (show) => set({ showInfoPanel: show }),
  toggleInfoPanel: () => set((state) => ({ showInfoPanel: !state.showInfoPanel })),
  pinMessage: (messageId) =>
    set((state) => ({
      pinnedMessages: [...state.pinnedMessages, messageId],
    })),
  unpinMessage: (messageId) =>
    set((state) => ({
      pinnedMessages: state.pinnedMessages.filter((id) => id !== messageId),
    })),
}));