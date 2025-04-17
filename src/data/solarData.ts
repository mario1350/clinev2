import { PanelType, InverterType, SunHourScenario } from '../types/solar';

export const sunHourScenarios: SunHourScenario[] = [
  { id: '1', hoursPerDay: 4.385, description: 'Conservative', hoursPerYear: 1600.525 },
  { id: '2', hoursPerDay: 4.5, description: 'Moderate', hoursPerYear: 1642.5 },
  { id: '3', hoursPerDay: 4.7, description: 'Optimal', hoursPerYear: 1715.5 },
];

export const panelTypes: PanelType[] = [
  { id: '1', name: 'Premium Mono PERC', capacity: 400, efficiency: 0.95 },
  { id: '2', name: 'Standard Poly', capacity: 350, efficiency: 0.90 },
  { id: '3', name: 'High-Efficiency Mono', capacity: 450, efficiency: 0.97 },
  { id: '4', name: 'Ultra Performance Mono', capacity: 410, efficiency: 0.96 },
  { id: '5', name: 'Elite Performance Mono', capacity: 550, efficiency: 0.96 },
  { id: '6', name: 'Maximum Performance Mono', capacity: 660, efficiency: 0.96 }
];

// We'll keep this for reference but won't use it in the panel selection step
export const inverterTypes: InverterType[] = [
  { id: '1', name: 'String Inverter Plus', efficiency: 0.98 },
  { id: '2', name: 'Micro Inverter Pro', efficiency: 0.97 },
  { id: '3', name: 'Hybrid Inverter Max', efficiency: 0.96 },
];