import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  theme: "dark" | "light" | "system";
  activeConversation: string | null;
  activeConversationType: "private" | "group" | null;
  mobileDrawerOpen: boolean;
  searchOpen: boolean;
  showInfoPanel: boolean;
  replyTo: string | null;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "dark" | "light" | "system") => void;
  setActiveConversation: (id: string | null, type: "private" | "group" | null) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setShowInfoPanel: (show: boolean) => void;
  toggleInfoPanel: () => void;
  setReplyTo: (messageId: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: "system",
  activeConversation: null,
  activeConversationType: null,
  mobileDrawerOpen: false,
  searchOpen: false,
  showInfoPanel: false,
  replyTo: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
  setActiveConversation: (id, type) => set({ activeConversation: id, activeConversationType: type }),
  setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setShowInfoPanel: (show) => set({ showInfoPanel: show }),
  toggleInfoPanel: () => set((state) => ({ showInfoPanel: !state.showInfoPanel })),
  setReplyTo: (messageId) => set({ replyTo: messageId }),
}));