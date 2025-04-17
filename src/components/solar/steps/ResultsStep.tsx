import React from 'react';
import { Sun, Zap, LineChart as LineChartIcon, Leaf, Car, TreePine } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SolarCalculation } from '../../../types/solar';

interface ResultsStepProps {
  calculation: Partial<SolarCalculation>;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ calculation }) => {
  if (!calculation.monthly_consumption || !calculation.adjusted_system_size) {
    return (
      <div className="text-center py-12">
        <LineChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">System Configuration Required</h3>
        <p className="mt-2 text-sm text-gray-500">
          Please complete the system configuration steps first.
        </p>
      </div>
    );
  }

  // Calculate monthly production based on adjusted system size and sun hours
  const calculateMonthlyProduction = () => {
    if (!calculation.adjusted_system_size || !calculation.sun_hours_per_day) return 0;
    return calculation.adjusted_system_size * calculation.sun_hours_per_day * 30;
  };

  const monthlyProduction = calculateMonthlyProduction();
  const annualProduction = monthlyProduction * 12;

  // CO2 Calculations
  const GRID_EMISSION_FACTOR = 0.8; // kg CO2/kWh
  const co2SavingsKg = annualProduction * GRID_EMISSION_FACTOR;
  const co2SavingsTons = co2SavingsKg / 1000;

  // Environmental Equivalents
  const treesPlanted = Math.round(co2SavingsKg / 21);
  const carsRemoved = Math.round(co2SavingsTons / 4.6);

  // Data for the energy comparison chart
  const energyComparisonData = [
    {
      name: 'Energy',
      Consumption: calculation.monthly_consumption,
      Production: monthlyProduction,
    }
  ];

  return (
    <div className="space-y-8">
      {/* System Design Summary */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-medium text-gray-900">System Design Summary</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
          <div>
            <p className="text-sm text-gray-500">Total Panels</p>
            <p className="text-xl font-semibold text-gray-900">
              {(calculation.number_of_panels || 0) + (calculation.adjusted_panels || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Panel Capacity</p>
            <p className="text-xl font-semibold text-gray-900">
              {calculation.panel_capacity}W
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Final System Size</p>
            <p className="text-xl font-semibold text-gray-900">
              {calculation.adjusted_system_size.toFixed(2)} kW
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Efficiency Loss</p>
            <p className="text-xl font-semibold text-gray-900">
              {calculation.efficiency_loss}%
            </p>
          </div>
        </div>
      </div>

      {/* Energy Comparison */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-900">Energy Comparison</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={energyComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit=" kWh" />
                <Tooltip />
                <Bar 
                  name="Monthly Consumption" 
                  dataKey="Consumption" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  name="Monthly Production" 
                  dataKey="Production" 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">Monthly Consumption</p>
              <p className="text-2xl font-bold text-red-700">
                {calculation.monthly_consumption.toFixed(2)} kWh
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Monthly Production</p>
              <p className="text-2xl font-bold text-green-700">
                {monthlyProduction.toFixed(2)} kWh
              </p>
            </div>
          </div>

          {/* Coverage Indicator */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">System Coverage</p>
            <p className="text-2xl font-bold text-blue-700">
              {((monthlyProduction / calculation.monthly_consumption) * 100).toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-blue-600">
              {monthlyProduction >= calculation.monthly_consumption
                ? "Your system fully covers your energy needs"
                : "Your system partially covers your energy needs"}
            </p>
          </div>
        </div>
      </div>

      {/* CO2 Savings */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Leaf className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-medium text-gray-900">Environmental Impact</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CO2 Savings Card */}
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-green-800 mb-4">Annual CO2 Savings</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-green-600">Total CO2 Offset</p>
                  <p className="text-3xl font-bold text-green-700">{co2SavingsTons.toFixed(1)} tons</p>
                  <p className="text-sm text-green-600 mt-1">({co2SavingsKg.toFixed(0)} kg/year)</p>
                </div>
                <div className="text-sm text-green-600">
                  Based on a grid emission factor of {GRID_EMISSION_FACTOR} kg CO2/kWh
                </div>
              </div>
            </div>

            {/* Real-World Equivalents */}
            <div className="bg-emerald-50 rounded-lg p-6">
              <h4 className="text-lg font-medium text-emerald-800 mb-4">Environmental Equivalents</h4>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <TreePine className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-700">{treesPlanted}</p>
                    <p className="text-sm text-emerald-600">Trees planted annually</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Car className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-700">{carsRemoved}</p>
                    <p className="text-sm text-emerald-600">Cars removed from the road</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Context */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              These calculations are based on average values and may vary depending on local conditions
              and grid energy mix. The environmental impact grows with each year your solar system operates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsStep;