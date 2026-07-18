import { create } from "zustand";

interface GroupStore {
  activeGroup: string | null;
  groupMembers: any[];
  setActiveGroup: (id: string | null) => void;
  setGroupMembers: (members: any[]) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  activeGroup: null,
  groupMembers: [],
  setActiveGroup: (id) => set({ activeGroup: id }),
  setGroupMembers: (members) => set({ groupMembers: members }),
}));