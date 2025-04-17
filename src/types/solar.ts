// Battery system type definition
export interface BatterySystem {
  type: string;
  capacity: number;
  voltage: number;
  maxPower: number;
  efficiency: number;
  price: number;
  description: string;
  specs: {
    dimensions: string;
    weight: string;
    warranty: string;
    rating: string;
    maxUnits: number;
    cycleLife?: string;
    throughput?: string;
    warrantyPeriod?: string;
    peakPower?: string;
    tempRange?: {
      discharge: string;
      charge: string;
    };
    features?: string[];
  };
}

// Update the SolarCalculation interface to include new adjustment fields
export interface SolarCalculation {
  id?: string;
  lead_id?: string;
  monthly_consumption: number;
  daily_consumption: number;
  annual_consumption: number;
  sun_hours_per_year: number;
  sun_hours_per_day: number;
  required_energy_per_hour: number;
  required_energy_per_day: number;
  panel_capacity: number;
  panel_efficiency: number;
  inverter_efficiency: number;
  number_of_panels: number;
  total_adjusted_production: number;
  scenario_id: string;
  panel_id: string;
  inverter_id: string;
  // New adjustment fields
  adjusted_panels?: number;
  adjusted_system_size?: number;
  efficiency_loss?: number;
  base_system_size?: number;
  created_at?: Date;
  updated_at?: Date;
  roofAnalysis?: {
    totalArea: number;
    usableArea: number;
    shadingPercentage: number;
    orientation: string;
    tilt: number;
    coordinates?: {
      points: Array<{ lat: number; lng: number }>;
      bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
      };
    };
  };
  batteryConfig?: {
    batteryType: string;
    inverterType: string;
    quantity: number;
    totalCapacity: number;
    totalPower: number;
    estimatedBackupTime: number;
    suncomWarranty?: boolean;
  };
}
