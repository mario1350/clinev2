import React, { useState } from 'react';
import { commonAppliances } from '../../data/appliances';
import { Sun, Zap, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Appliance } from '../../types/analysis';

const ELECTRICITY_RATE = 0.25; // $0.25 per kWh
const SOLAR_OFFSET_RATE = 0.05; // $0.05 per kWh with solar
const SOLAR_PRODUCTION_EFFICIENCY = 0.85; // 85% solar production efficiency

const SolarComparison = () => {
  const [selectedCategory, setSelectedCategory] = useState<Appliance['category']>('kitchen');

  const categories = [
    { id: 'kitchen', name: 'Kitchen Appliances' },
    { id: 'climate', name: 'Climate Control' },
    { id: 'laundry', name: 'Laundry' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'other', name: 'Other' }
  ];

  const calculateComparison = (appliance: Appliance) => {
    const dailyUsage = appliance.powerRating * appliance.hoursPerDay * appliance.quantity / 1000;
    const standbyUsage = (appliance.standbyPower || 0) * (24 - appliance.hoursPerDay) * appliance.quantity / 1000;
    const totalDailyUsage = dailyUsage + standbyUsage;
    const monthlyUsage = totalDailyUsage * 30;
    
    const gridCost = monthlyUsage * ELECTRICITY_RATE;
    const solarCost = monthlyUsage * SOLAR_OFFSET_RATE;
    const savings = gridCost - solarCost;
    
    const solarProduction = monthlyUsage * SOLAR_PRODUCTION_EFFICIENCY;

    return {
      name: appliance.name,
      gridCost: parseFloat(gridCost.toFixed(2)),
      solarCost: parseFloat(solarCost.toFixed(2)),
      savings: parseFloat(savings.toFixed(2)),
      consumption: parseFloat(monthlyUsage.toFixed(2)),
      production: parseFloat(solarProduction.toFixed(2))
    };
  };

  const filteredComparisons = commonAppliances
    .filter(appliance => appliance.category === selectedCategory)
    .map(calculateComparison);

  const totalSavings = filteredComparisons
    .reduce((sum, comparison) => sum + comparison.savings, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Category Selection */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as Appliance['category'])}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Cost Comparison Chart */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Cost Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredComparisons}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="$" />
              <Tooltip />
              <Legend />
              <Bar name="Grid Cost" dataKey="gridCost" fill="#ef4444" />
              <Bar name="Solar Cost" dataKey="solarCost" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Savings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Zap className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="font-medium text-gray-900">Grid Power</h3>
          </div>
          <p className="text-sm text-gray-600">
            Standard rate: ${ELECTRICITY_RATE.toFixed(2)}/kWh
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Sun className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-medium text-gray-900">Solar Power</h3>
          </div>
          <p className="text-sm text-gray-600">
            Effective rate: ${SOLAR_OFFSET_RATE.toFixed(2)}/kWh
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-900">Monthly Savings</h3>
          </div>
          <p className="text-lg font-semibold text-blue-600">
            ${totalSavings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Appliance-Level Savings
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredComparisons.map((comparison, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {comparison.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {comparison.consumption} kWh/month
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    Save ${comparison.savings}/month
                  </p>
                  <p className="text-xs text-gray-500">
                    Grid: ${comparison.gridCost} → Solar: ${comparison.solarCost}
                  </p>
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${(comparison.production / comparison.consumption) * 100}%`
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-right">
                {Math.round((comparison.production / comparison.consumption) * 100)}% offset by solar
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolarComparison;