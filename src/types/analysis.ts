export interface Appliance {
  id: string;
  name: string;
  category: 'kitchen' | 'climate' | 'laundry' | 'entertainment' | 'other';
  powerRating: number; // in watts
  hoursPerDay: number;
  quantity: number;
  efficiency?: number;
  standbyPower?: number;
}

export interface ApplianceUsage {
  applianceId: string;
  dailyUsageHours: number;
  monthlyConsumption: number;
  monthlyCost: number;
  solarOffset: number;
  solarSavings: number;
}

export interface EnergyAnalysis {
  totalConsumption: number;
  totalCost: number;
  solarProduction: number;
  solarSavings: number;
  appliances: ApplianceUsage[];
  peakHours: {
    start: number;
    end: number;
    consumption: number;
  }[];
}

export interface ApplianceCategory {
  name: string;
  icon: string;
  totalConsumption: number;
  totalCost: number;
  solarSavings: number;
  appliances: ApplianceUsage[];
}