import type { SolarCalculation } from '../../../types/solar';

interface EfficiencyCalculationParams {
  baseSystemSize: number;
  sunHoursPerDay: number;
  panelCapacity: number;
  numberOfPanels: number;
}

interface EfficiencyResult {
  efficiencyLoss: number;
  finalSystemSize: number;
  dailyProductionBefore: number;
  dailyProductionAfter: number;
}

export const calculateSystemEfficiency = ({
  baseSystemSize,
  sunHoursPerDay,
  panelCapacity,
  numberOfPanels
}: EfficiencyCalculationParams): EfficiencyResult => {
  // Constants for efficiency calculations
  const PANEL_EFFICIENCY = 0.96; // 96% panel efficiency
  const CONVERSION_EFFICIENCY = 0.98; // 98% AC/DC conversion efficiency

  // Calculate daily production before efficiency adjustments (in kWh)
  const dailyProductionBefore = baseSystemSize * sunHoursPerDay;

  // Calculate panel output after efficiency losses (in kW)
  const panelOutputBeforeEfficiency = panelCapacity / 1000; // Convert W to kW
  const effectivePanelOutput = panelOutputBeforeEfficiency * PANEL_EFFICIENCY * CONVERSION_EFFICIENCY;

  // Calculate total system output after efficiency (in kW)
  const totalSystemOutputAfterEfficiency = effectivePanelOutput * numberOfPanels;
  
  // Calculate daily production after efficiency adjustments (in kWh)
  const dailyProductionAfter = totalSystemOutputAfterEfficiency * sunHoursPerDay;

  // Calculate efficiency loss percentage
  const efficiencyLoss = ((dailyProductionBefore - dailyProductionAfter) / dailyProductionBefore) * 100;

  // Final system size is the effective system output in kW
  const finalSystemSize = totalSystemOutputAfterEfficiency;

  return {
    efficiencyLoss,
    finalSystemSize,
    dailyProductionBefore,
    dailyProductionAfter
  };
};