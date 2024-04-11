import { create } from "zustand";

interface StoreState {
  topbarStyle: "light" | "dark";
  setTopbarStyle: (theme: StoreState["topbarStyle"]) => void;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
}

export const useStore = create<StoreState>()((set) => ({
  topbarStyle: "light",
  setTopbarStyle: (theme) => set(() => ({ topbarStyle: theme })),
  isConnected: true,
  setIsConnected: (isConnected) => set(() => ({ isConnected })),
}));
