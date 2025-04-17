import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Appliance, ApplianceUsage } from '../types/analysis';

interface AnalysisState {
  clientAppliances: Record<string, Appliance[]>; // Key is leadId
  gridRate: number;
  solarRate: number;
  addClientAppliance: (leadId: string, appliance: Appliance) => void;
  updateClientAppliance: (leadId: string, applianceId: string, updates: Partial<Appliance>) => void;
  removeClientAppliance: (leadId: string, applianceId: string) => void;
  getClientAppliances: (leadId: string) => Appliance[];
  updateGridRate: (rate: number) => void;
  updateSolarRate: (rate: number) => void;
  calculateUsage: (leadId: string) => ApplianceUsage[];
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      clientAppliances: {},
      gridRate: 0.25, // Default rate: $0.25/kWh
      solarRate: 0.05, // Default solar rate: $0.05/kWh

      addClientAppliance: (leadId, appliance) => set(state => ({
        clientAppliances: {
          ...state.clientAppliances,
          [leadId]: [...(state.clientAppliances[leadId] || []), appliance]
        }
      })),

      updateClientAppliance: (leadId, applianceId, updates) => set(state => ({
        clientAppliances: {
          ...state.clientAppliances,
          [leadId]: (state.clientAppliances[leadId] || []).map(appliance =>
            appliance.id === applianceId ? { ...appliance, ...updates } : appliance
          )
        }
      })),

      removeClientAppliance: (leadId, applianceId) => set(state => ({
        clientAppliances: {
          ...state.clientAppliances,
          [leadId]: (state.clientAppliances[leadId] || []).filter(
            appliance => appliance.id !== applianceId
          )
        }
      })),

      getClientAppliances: (leadId) => {
        const state = get();
        return state.clientAppliances[leadId] || [];
      },

      updateGridRate: (rate) => set({ gridRate: rate }),
      
      updateSolarRate: (rate) => set({ solarRate: rate }),

      calculateUsage: (leadId) => {
        const state = get();
        const appliances = state.clientAppliances[leadId] || [];
        const gridRate = state.gridRate;
        const solarRate = state.solarRate;

        return appliances.map(appliance => {
          // Calculate daily usage in kWh
          const dailyActiveUsage = (appliance.powerRating * appliance.hoursPerDay * appliance.quantity) / 1000;
          const dailyStandbyUsage = ((appliance.standbyPower || 0) * (24 - appliance.hoursPerDay) * appliance.quantity) / 1000;
          const totalDailyUsage = dailyActiveUsage + dailyStandbyUsage;
          
          // Calculate monthly values
          const monthlyConsumption = totalDailyUsage * 30;
          const monthlyCost = monthlyConsumption * gridRate;
          const solarCost = monthlyConsumption * solarRate;
          const solarSavings = monthlyCost - solarCost;

          return {
            applianceId: appliance.id,
            dailyUsageHours: appliance.hoursPerDay,
            monthlyConsumption,
            monthlyCost,
            solarOffset: monthlyConsumption * 0.85, // Assuming 85% solar efficiency
            solarSavings
          };
        });
      }
    }),
    {
      name: 'analysis-storage'
    }
  )
);