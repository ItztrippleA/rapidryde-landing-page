"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FeatureGroup =
  | "all"
  | "ride"
  | "price"
  | "trip"
  | "safety"
  | "driver"
  | "delivery"
  | "business";

type UiState = {
  mode: "light" | "dark";
  hasHydrated: boolean;
  navOpen: boolean;
  featureGroup: FeatureGroup;
  toggleMode: () => void;
  setNavOpen: (open: boolean) => void;
  setFeatureGroup: (group: FeatureGroup) => void;
};

export function useThemeMode() {
  return useUiStore((state) => (state.hasHydrated ? state.mode : "light"));
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      mode: "light",
      hasHydrated: false,
      navOpen: false,
      featureGroup: "all",
      toggleMode: () =>
        set((state) => ({ mode: state.mode === "light" ? "dark" : "light" })),
      setNavOpen: (navOpen) => set({ navOpen }),
      setFeatureGroup: (featureGroup) => set({ featureGroup }),
    }),
    {
      name: "rapidryde-ui",
      skipHydration: true,
      partialize: (state) => ({ mode: state.mode, featureGroup: state.featureGroup }),
    },
  ),
);
