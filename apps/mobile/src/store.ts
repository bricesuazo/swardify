import { create } from 'zustand';

interface StoreState {
  topbarStyle: 'light' | 'dark';
  setTopbarStyle: (theme: StoreState['topbarStyle']) => void;
}

export const useStore = create<StoreState>()((set) => ({
  topbarStyle: 'light',
  setTopbarStyle: (theme) => set(() => ({ topbarStyle: theme })),
}));
