import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SolarCalculation } from '../types/solar';

interface SolarDesignStore {
  designs: Record<string, SolarCalculation>;
  loading: boolean;
  error: string | null;
  addDesign: (leadId: string, design: SolarCalculation) => void;
  updateDesign: (leadId: string, design: Partial<SolarCalculation>) => void;
  getDesign: (leadId: string) => SolarCalculation | null;
  removeDesign: (leadId: string) => void;
}

export const useSolarDesignStore = create<SolarDesignStore>()(
  persist(
    (set, get) => ({
      designs: {},
      loading: false,
      error: null,
      
      addDesign: (leadId, design) => {
        set(state => ({
          designs: {
            ...state.designs,
            [leadId]: design
          }
        }));
      },
      
      updateDesign: (leadId, design) => {
        set(state => ({
          designs: {
            ...state.designs,
            [leadId]: {
              ...state.designs[leadId],
              ...design
            }
          }
        }));
      },
      
      getDesign: (leadId) => {
        const state = get();
        return state.designs[leadId] || null;
      },
      
      removeDesign: (leadId) => {
        set(state => {
          const { [leadId]: _, ...rest } = state.designs;
          return { designs: rest };
        });
      }
    }),
    {
      name: 'solar-design-storage'
    }
  )
);