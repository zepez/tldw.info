import { create } from "zustand";

export interface StoreState {
  timestamp: number | null;
  setTimestamp: (timestamp: number) => void;
  reset: (key?: keyof typeof initial) => void;
}

const initial = {
  timestamp: null,
};

const useStore = create<StoreState>()((set) => ({
  ...initial,
  setTimestamp: (timestamp) => set({ timestamp }),
  reset: (key?: keyof typeof initial) => {
    if (key) {
      set({ [key]: initial[key] });
    } else {
      set(initial);
    }
  },
}));

export default useStore;
