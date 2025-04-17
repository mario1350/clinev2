import React, { useState } from 'react';
import { Calculator, Sun, Zap } from 'lucide-react';
import type { SolarCalculation, PanelType, InverterType, SunHourScenario } from '../types/solar';
import { panelTypes, inverterTypes, sunHourScenarios } from '../data/solarData';

const SolarCalculator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<SunHourScenario>(sunHourScenarios[0]);
  const [selectedPanel, setSelectedPanel] = useState<PanelType>(panelTypes[0]);
  const [selectedInverter, setSelectedInverter] = useState<InverterType>(inverterTypes[0]);
  const [calculation, setCalculation] = useState<Partial<SolarCalculation>>({});

  const handleConsumptionChange = (consumption: number) => {
    const annualConsumption = consumption * 13;
    const requiredEnergyPerHour = annualConsumption / selectedScenario.hoursPerYear;
    const requiredEnergyPerDay = requiredEnergyPerHour * selectedScenario.hoursPerDay;
    
    // Convert required energy per hour from kWh to Wh for panel calculation
    const numberOfPanels = Math.ceil((requiredEnergyPerHour * 1000) / selectedPanel.capacity);
    
    // Calculate total adjusted production using panel efficiency and inverter efficiency
    const panelOutput = selectedPanel.capacity * selectedPanel.efficiency * numberOfPanels;
    const totalAdjustedProduction = (panelOutput * selectedInverter.efficiency) / 1000; // Convert back to kW

    setCalculation({
      monthlyConsumption: consumption,
      annualConsumption,
      sunHoursPerYear: selectedScenario.hoursPerYear,
      sunHoursPerDay: selectedScenario.hoursPerDay,
      requiredEnergyPerHour,
      requiredEnergyPerDay,
      panelCapacity: selectedPanel.capacity,
      panelEfficiency: selectedPanel.efficiency,
      inverterEfficiency: selectedInverter.efficiency,
      numberOfPanels,
      totalAdjustedProduction,
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">System Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Highest Monthly Consumption (kWh)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleConsumptionChange(Number(e.target.value))}
              placeholder="Enter consumption"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sun Hours Scenario
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                const scenario = sunHourScenarios.find(s => s.id === e.target.value)!;
                setSelectedScenario(scenario);
                if (calculation.monthlyConsumption) {
                  handleConsumptionChange(calculation.monthlyConsumption);
                }
              }}
            >
              {sunHourScenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.description} ({scenario.hoursPerDay} hours/day)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solar Panel Type
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                const panel = panelTypes.find(p => p.id === e.target.value)!;
                setSelectedPanel(panel);
                if (calculation.monthlyConsumption) {
                  handleConsumptionChange(calculation.monthlyConsumption);
                }
              }}
            >
              {panelTypes.map((panel) => (
                <option key={panel.id} value={panel.id}>
                  {panel.name} ({panel.capacity}W - {panel.efficiency * 100}% efficiency)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inverter Type
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                const inverter = inverterTypes.find(i => i.id === e.target.value)!;
                setSelectedInverter(inverter);
                if (calculation.monthlyConsumption) {
                  handleConsumptionChange(calculation.monthlyConsumption);
                }
              }}
            >
              {inverterTypes.map((inverter) => (
                <option key={inverter.id} value={inverter.id}>
                  {inverter.name} ({inverter.efficiency * 100}% efficiency)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {calculation.monthlyConsumption && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">System Calculations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Calculator className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-gray-900">Consumption</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Monthly: {calculation.monthlyConsumption.toFixed(2)} kWh
                </p>
                <p className="text-sm text-gray-600">
                  Annual: {calculation.annualConsumption?.toFixed(2)} kWh
                </p>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Sun className="w-5 h-5 text-yellow-600 mr-2" />
                <h3 className="font-medium text-gray-900">Required Production</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Per Hour: {calculation.requiredEnergyPerHour?.toFixed(2)} kWh
                </p>
                <p className="text-sm text-gray-600">
                  Per Day: {calculation.requiredEnergyPerDay?.toFixed(2)} kWh
                </p>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Zap className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-medium text-gray-900">System Size</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Number of Panels: {calculation.numberOfPanels}
                </p>
                <p className="text-sm text-gray-600">
                  Daily Production: {(calculation.totalAdjustedProduction * calculation.sunHoursPerDay!)?.toFixed(2)} kWh
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolarCalculator;