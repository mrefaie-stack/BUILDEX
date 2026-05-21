'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LeadPayload, SelectedPath } from './types';

export interface ArsenalState {
  // ----- Visitor / journey -----
  visitorId: string | null;
  setVisitorId: (id: string) => void;

  selectedPath: SelectedPath;
  setSelectedPath: (path: SelectedPath) => void;

  currentLevel: string | null;
  setCurrentLevel: (level: string | null) => void;

  // ----- Arsenal -----
  selectedWeapons: string[];
  addWeapon: (id: string) => void;
  removeWeapon: (id: string) => void;
  clearWeapons: () => void;

  selectedPackage: string | null;
  setSelectedPackage: (id: string | null) => void;

  // ----- Calculator -----
  calculatorResult: number | null;
  setCalculatorResult: (n: number | null) => void;

  // ----- Lead state -----
  leadData: Partial<LeadPayload>;
  updateLeadData: (patch: Partial<LeadPayload>) => void;
  hasSubmittedLead: boolean;
  setHasSubmittedLead: (b: boolean) => void;

  // ----- Modals -----
  arsenalCaptureSeen: boolean;
  markArsenalCaptureSeen: () => void;

  // ----- Consent -----
  cookieConsent: 'pending' | 'granted' | 'denied';
  setCookieConsent: (s: 'pending' | 'granted' | 'denied') => void;

  resetJourney: () => void;
}

export const useArsenalStore = create<ArsenalState>()(
  persist(
    (set, get) => ({
      visitorId: null,
      setVisitorId: (id) => set({ visitorId: id }),

      selectedPath: null,
      setSelectedPath: (path) => set({ selectedPath: path }),

      currentLevel: null,
      setCurrentLevel: (level) => set({ currentLevel: level }),

      selectedWeapons: [],
      addWeapon: (id) => {
        const cur = get().selectedWeapons;
        if (cur.includes(id)) return;
        set({ selectedWeapons: [...cur, id] });
      },
      removeWeapon: (id) =>
        set({ selectedWeapons: get().selectedWeapons.filter((w) => w !== id) }),
      clearWeapons: () => set({ selectedWeapons: [] }),

      selectedPackage: null,
      setSelectedPackage: (id) => set({ selectedPackage: id }),

      calculatorResult: null,
      setCalculatorResult: (n) => set({ calculatorResult: n }),

      leadData: {},
      updateLeadData: (patch) =>
        set({ leadData: { ...get().leadData, ...patch } }),

      hasSubmittedLead: false,
      setHasSubmittedLead: (b) => set({ hasSubmittedLead: b }),

      arsenalCaptureSeen: false,
      markArsenalCaptureSeen: () => set({ arsenalCaptureSeen: true }),

      cookieConsent: 'pending',
      setCookieConsent: (s) => set({ cookieConsent: s }),

      resetJourney: () =>
        set({
          selectedPath: null,
          currentLevel: null,
          selectedWeapons: [],
          selectedPackage: null,
          calculatorResult: null,
          leadData: {},
          hasSubmittedLead: false,
          arsenalCaptureSeen: false
        })
    }),
    {
      name: 'milaknight:state',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        visitorId: s.visitorId,
        selectedPath: s.selectedPath,
        selectedWeapons: s.selectedWeapons,
        selectedPackage: s.selectedPackage,
        calculatorResult: s.calculatorResult,
        leadData: s.leadData,
        hasSubmittedLead: s.hasSubmittedLead,
        arsenalCaptureSeen: s.arsenalCaptureSeen,
        cookieConsent: s.cookieConsent
      })
    }
  )
);
