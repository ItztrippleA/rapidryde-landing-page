"use client";

import { create } from "zustand";

type DiagramState = {
  packageId: string;
  selectedId: string | null;
  query: string;
  setPackage: (packageId: string, firstClassId: string | null) => void;
  select: (id: string, packageId?: string) => void;
  setQuery: (query: string) => void;
};

export const useDiagramStore = create<DiagramState>((set) => ({
  packageId: "journey",
  selectedId: "trip",
  query: "",
  setPackage: (packageId, firstClassId) =>
    set({ packageId, selectedId: firstClassId, query: "" }),
  select: (id, packageId) =>
    set((state) => ({ selectedId: id, packageId: packageId ?? state.packageId, query: "" })),
  setQuery: (query) => set({ query }),
}));
