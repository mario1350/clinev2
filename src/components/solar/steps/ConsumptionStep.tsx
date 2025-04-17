import React from 'react';
import { FileText } from 'lucide-react';
import type { SolarCalculation } from '../../../types/solar';

interface ConsumptionStepProps {
  calculation: Partial<SolarCalculation>;
  onUpdate: (data: Partial<SolarCalculation>) => void;
}

const ConsumptionStep: React.FC<ConsumptionStepProps> = ({ calculation, onUpdate }) => {
  const handleConsumptionChange = (monthlyConsumption: number) => {
    if (monthlyConsumption > 0) {
      const dailyConsumption = monthlyConsumption / 30;
      const annualConsumption = monthlyConsumption * 13;

      onUpdate({
        monthly_consumption: monthlyConsumption,
        daily_consumption: dailyConsumption,
        annual_consumption: annualConsumption,
      });
    } else {
      onUpdate({
        monthly_consumption: undefined,
        daily_consumption: undefined,
        annual_consumption: undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Monthly Consumption</h2>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Enter your highest monthly electricity consumption to calculate your optimal solar system size.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Highest Monthly Consumption (kWh)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={calculation.monthly_consumption || ''}
          onChange={(e) => handleConsumptionChange(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter consumption in kWh"
        />
      </div>

      {calculation.monthly_consumption && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Daily Consumption</div>
            <div className="text-lg font-semibold text-gray-900">
              {calculation.daily_consumption?.toFixed(2)} kWh
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Monthly Consumption</div>
            <div className="text-lg font-semibold text-gray-900">
              {calculation.monthly_consumption.toFixed(2)} kWh
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Annual Consumption</div>
            <div className="text-lg font-semibold text-gray-900">
              {calculation.annual_consumption?.toFixed(2)} kWh
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsumptionStep;