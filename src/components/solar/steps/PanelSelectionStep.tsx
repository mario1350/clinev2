import React, { useState, useEffect } from 'react';
import { Sun, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import type { SolarCalculation } from '../../../types/solar';
import { panelTypes, sunHourScenarios } from '../../../data/solarData';

interface PanelSelectionStepProps {
  calculation: Partial<SolarCalculation>;
  onUpdate: (data: Partial<SolarCalculation>) => void;
}

const PanelSelectionStep: React.FC<PanelSelectionStepProps> = ({ calculation, onUpdate }) => {
  const [selectedScenario, setSelectedScenario] = useState<string>(calculation.scenario_id || '');
  const [selectedPanel, setSelectedPanel] = useState<string>(calculation.panel_id || '');

  useEffect(() => {
    if (selectedScenario && selectedPanel && calculation.monthly_consumption) {
      const scenario = sunHourScenarios.find(s => s.id === selectedScenario)!;
      const panel = panelTypes.find(p => p.id === selectedPanel)!;

      const annualConsumption = calculation.monthly_consumption * 13;
      const sunHoursPerYear = scenario.hoursPerDay * 365;
      const requiredEnergyPerHour = annualConsumption / sunHoursPerYear;
      const requiredEnergyPerDay = requiredEnergyPerHour * scenario.hoursPerDay;
      
      // Convert kW to W for panel calculations
      const requiredWatts = requiredEnergyPerHour * 1000;
      const numberOfPanels = Math.ceil(requiredWatts / panel.capacity);
      const systemSize = (numberOfPanels * panel.capacity) / 1000;

      onUpdate({
        ...calculation,
        sun_hours_per_day: scenario.hoursPerDay,
        sun_hours_per_year: sunHoursPerYear,
        required_energy_per_hour: requiredEnergyPerHour,
        required_energy_per_day: requiredEnergyPerDay,
        panel_capacity: panel.capacity,
        panel_efficiency: panel.efficiency,
        number_of_panels: numberOfPanels,
        system_size: systemSize,
        scenario_id: scenario.id,
        panel_id: panel.id
      });
    }
  }, [selectedScenario, selectedPanel, calculation.monthly_consumption, onUpdate]);

  if (!calculation.monthly_consumption) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Sun className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Monthly Consumption Required</h3>
        <p className="mt-2 text-sm text-gray-500">
          Please enter your monthly consumption in the previous step.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Consumption Summary */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Consumption</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Monthly</p>
            <p className="text-xl font-semibold text-gray-900">
              {calculation.monthly_consumption.toFixed(2)} kWh
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Daily Average</p>
            <p className="text-xl font-semibold text-gray-900">
              {(calculation.monthly_consumption / 30).toFixed(2)} kWh
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Annual Projected</p>
            <p className="text-xl font-semibold text-gray-900">
              {(calculation.monthly_consumption * 13).toFixed(2)} kWh
            </p>
          </div>
        </div>
      </div>

      {/* Sun Hours Scenario Selection */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Sun className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-medium text-gray-900">Sun Hours Scenario</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {sunHourScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={clsx(
                'p-4 rounded-lg border-2 transition-all',
                selectedScenario === scenario.id
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 hover:border-yellow-200'
              )}
            >
              <div className="text-lg font-semibold text-gray-900">
                {scenario.hoursPerDay}
              </div>
              <div className="text-sm text-gray-500">hours/day</div>
            </button>
          ))}
        </div>
      </div>

      {/* Panel Type Selection */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900">Panel Type</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {panelTypes.map((panel) => (
            <button
              key={panel.id}
              onClick={() => setSelectedPanel(panel.id)}
              className={clsx(
                'p-4 rounded-lg border-2 transition-all',
                selectedPanel === panel.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              )}
            >
              <div className="text-lg font-semibold text-gray-900">
                {panel.capacity}W
              </div>
              <div className="text-sm text-gray-500">
                {(panel.efficiency * 100).toFixed(0)}% efficiency
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* System Overview */}
      {selectedScenario && selectedPanel && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Overview</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Required Panels</p>
              <p className="text-xl font-semibold text-gray-900">
                {calculation.number_of_panels}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Panel Capacity</p>
              <p className="text-xl font-semibold text-gray-900">
                {calculation.panel_capacity}W
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">System Size</p>
              <p className="text-xl font-semibold text-gray-900">
                {calculation.system_size?.toFixed(2)} kW
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelSelectionStep;