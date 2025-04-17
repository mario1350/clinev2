import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SystemConfiguration, SystemRequirement, MaterialComponent } from '../types/vendor';
import { materials } from '../data/materials';

interface VendorStore {
  configuration: SystemConfiguration | null;
  selectedComponents: SystemRequirement[];
  setConfiguration: (config: SystemConfiguration) => void;
  addComponent: (componentId: string, quantity: number) => void;
  updateComponent: (componentId: string, quantity: number) => void;
  removeComponent: (componentId: string) => void;
  calculateTotalCost: () => number;
  checkInventory: (componentId: string, quantity: number) => boolean;
  getComponent: (componentId: string) => MaterialComponent | undefined;
}

export const useVendorStore = create<VendorStore>()(
  persist(
    (set, get) => ({
      configuration: null,
      selectedComponents: [],

      setConfiguration: (config) => set({ configuration: config }),

      addComponent: (componentId, quantity) => {
        const component = materials.find(m => m.id === componentId);
        if (!component) return;

        set((state) => ({
          selectedComponents: [
            ...state.selectedComponents,
            { componentId, quantity }
          ]
        }));
      },

      updateComponent: (componentId, quantity) => {
        set((state) => ({
          selectedComponents: state.selectedComponents.map(comp =>
            comp.componentId === componentId ? { ...comp, quantity } : comp
          )
        }));
      },

      removeComponent: (componentId) => {
        set((state) => ({
          selectedComponents: state.selectedComponents.filter(
            comp => comp.componentId !== componentId
          )
        }));
      },

      calculateTotalCost: () => {
        const { selectedComponents } = get();
        return selectedComponents.reduce((total, { componentId, quantity }) => {
          const component = materials.find(m => m.id === componentId);
          return total + (component?.price || 0) * quantity;
        }, 0);
      },

      checkInventory: (componentId, quantity) => {
        const component = materials.find(m => m.id === componentId);
        if (!component) return false;
        return component.inStock >= quantity;
      },

      getComponent: (componentId) => {
        return materials.find(m => m.id === componentId);
      }
    }),
    {
      name: 'vendor-storage'
    }
  )
);