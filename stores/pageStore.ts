'use client';

import { create } from 'zustand';

interface PageState {
  isAppLoaded: boolean;
  isBlogPost: boolean;
  isAboutPage: boolean;
  isContactPage: boolean;
  setAppLoaded: (value: boolean) => void;
  setIsBlogPost: (value: boolean) => void;
  setIsAboutPage: (value: boolean) => void;
  setIsContactPage: (value: boolean) => void;
  resetPageStates: () => void;
}

export const usePageStore = create<PageState>((set) => ({
  isAppLoaded: false,
  isBlogPost: false,
  isAboutPage: false,
  isContactPage: false,
  setAppLoaded: (value: boolean) => set({ isAppLoaded: value }),
  setIsBlogPost: (value: boolean) => set({ isBlogPost: value, isAboutPage: false, isContactPage: false }),
  setIsAboutPage: (value: boolean) => set({ isAboutPage: value, isBlogPost: false, isContactPage: false }),
  setIsContactPage: (value: boolean) => set({ isContactPage: value, isBlogPost: false, isAboutPage: false }),
  resetPageStates: () => set({ isBlogPost: false, isAboutPage: false, isContactPage: false }),
}));