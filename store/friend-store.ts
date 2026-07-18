import { create } from "zustand";

interface FriendStore {
  friendRequestsCount: number;
  setFriendRequestsCount: (count: number) => void;
  incrementRequests: () => void;
  decrementRequests: () => void;
}

export const useFriendStore = create<FriendStore>((set) => ({
  friendRequestsCount: 0,
  setFriendRequestsCount: (count) => set({ friendRequestsCount: count }),
  incrementRequests: () => set((state) => ({ friendRequestsCount: state.friendRequestsCount + 1 })),
  decrementRequests: () => set((state) => ({ friendRequestsCount: Math.max(0, state.friendRequestsCount - 1) })),
}));