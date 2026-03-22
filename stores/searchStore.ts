'use client';

import { create } from 'zustand';

interface SearchState {
  isOpen: boolean;
  query: string;
  setIsOpen: (isOpen: boolean) => void;
  setQuery: (query: string) => void;
  openWithQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  query: '',
  setIsOpen: (isOpen) => set({ isOpen }),
  setQuery: (query) => set({ query }),
  openWithQuery: (query) => set({ isOpen: true, query }),
}));
