"use client";
import { useEffect } from "react";
import { create } from "zustand";
import { Bar } from "~/db/schema";

type BarState = {
  barName: string;
  setBarName: (name: string) => void;
};

export const useBarStore = create<BarState>((set) => ({
  barName: "",
  setBarName: (name: string) => set({ barName: name }),
}));

export function BarName({ name }: { name: string }) {
  const setBarName = useBarStore((state) => state.setBarName);
  useEffect(() => {
    setBarName(name);
  }, [name, setBarName]);

  return null;
}
