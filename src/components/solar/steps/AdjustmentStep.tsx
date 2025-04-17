import React, { useState, useEffect, useCallback } from 'react';
import { Settings, AlertTriangle, Calculator } from 'lucide-react';
import { clsx } from 'clsx';
import type { SolarCalculation } from '../../../types/solar';
import { calculateSystemEfficiency } from '../utils/solarCalculations';

interface AdjustmentStepProps {
  calculation: Partial<SolarCalculation>;
  onUpdate: (data: Partial<SolarCalculation>) => void;
}

interface EfficiencyAcknowledgmentProps {
  onClose: () => void;
  onConfirm: () => void;
}

const EfficiencyAcknowledgment: React.FC<EfficiencyAcknowledgmentProps> = ({ onClose, onConfirm }) => {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Preliminary Design Notice
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          The efficiency calculations provided are part of a preliminary design and may be adjusted
          during the detailed engineering phase. These values account for:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 mb-6">
          <li>Panel efficiency degradation (96%)</li>
          <li>AC/DC conversion efficiency (98%)</li>
          <li>Environmental factors</li>
          <li>System wiring losses</li>
        </ul>
        <label className="flex items-start space-x-3 mb-6">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">
            I understand that these calculations are preliminary and may be adjusted during the
            detailed engineering phase.
          </span>
        </label>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!acknowledged}
            className={clsx(
              'btn',
              !acknowledged && 'opacity-50 cursor-not-allowed'
            )}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const AdjustmentStep: React.FC<AdjustmentStepProps> = ({ calculation, onUpdate }) => {
  const [additionalPanels, setAdditionalPanels] = useState(calculation.adjusted_panels || 0);
  const [showAcknowledgment, setShowAcknowledgment] = useState(false);
  const [efficiencyCalculated, setEfficiencyCalculated] = useState(false);

  const updateCalculations = useCallback(() => {
    if (!calculation.panel_capacity || !calculation.number_of_panels || !calculation.sun_hours_per_day) return;

    const totalPanels = calculation.number_of_panels + additionalPanels;
    const baseSystemSize = (totalPanels * calculation.panel_capacity) / 1000; // Convert to kW

    // Only update if values have changed
    const shouldUpdate = 
      calculation.base_system_size !== baseSystemSize ||
      calculation.adjusted_panels !== additionalPanels;

    if (!efficiencyCalculated && shouldUpdate) {
      onUpdate({
        ...calculation,
        adjusted_panels: additionalPanels,
        base_system_size: baseSystemSize,
      });
      return;
    }

    if (efficiencyCalculated) {
      const { 
        efficiencyLoss,
        finalSystemSize,
        dailyProductionBefore,
        dailyProductionAfter
      } = calculateSystemEfficiency({
        baseSystemSize,
        sunHoursPerDay: calculation.sun_hours_per_day,
        panelCapacity: calculation.panel_capacity,
        numberOfPanels: totalPanels
      });

      const hasChanges = 
        calculation.efficiency_loss !== efficiencyLoss ||
        calculation.adjusted_system_size !== finalSystemSize ||
        calculation.daily_production_before !== dailyProductionBefore ||
        calculation.daily_production_after !== dailyProductionAfter ||
        calculation.adjusted_panels !== additionalPanels ||
        calculation.base_system_size !== baseSystemSize;

      if (hasChanges) {
        onUpdate({
          ...calculation,
          adjusted_panels: additionalPanels,
          efficiency_loss: efficiencyLoss,
          adjusted_system_size: finalSystemSize,
          base_system_size: baseSystemSize,
          daily_production_before: dailyProductionBefore,
          daily_production_after: dailyProductionAfter
        });
      }
    }
  }, [calculation, additionalPanels, efficiencyCalculated, onUpdate]);

  useEffect(() => {
    updateCalculations();
  }, [updateCalculations]);

  const handleCalculateEfficiency = () => {
    setShowAcknowledgment(true);
  };

  const handleEfficiencyConfirmed = () => {
    setShowAcknowledgment(false);
    setEfficiencyCalculated(true);
  };

  if (!calculation.panel_capacity || !calculation.number_of_panels) {
    return (
      <div className="text-center py-12">
        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">System Configuration Required</h3>
        <p className="mt-2 text-sm text-gray-500">
          Please complete the system setup step first.
        </p>
      </div>
    );
  }

  const baseSystemSize = (calculation.number_of_panels * calculation.panel_capacity) / 1000;
  const totalPanels = calculation.number_of_panels + additionalPanels;
  const adjustedSystemSize = (totalPanels * calculation.panel_capacity) / 1000;
  const finalSystemSize = calculation.adjusted_system_size || adjustedSystemSize;

  return (
    <div className="space-y-8">
      {/* Base Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Base Configuration</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Base Panels</p>
            <p className="text-xl font-semibold text-gray-900">{calculation.number_of_panels}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Panel Capacity</p>
            <p className="text-xl font-semibold text-gray-900">{calculation.panel_capacity}W</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Base System Size</p>
            <p className="text-xl font-semibold text-gray-900">{baseSystemSize.toFixed(2)} kW</p>
          </div>
        </div>
      </div>

      {/* System Adjustments */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-900">System Adjustments</h3>
          </div>
        </div>

        <div className="space-y-6">
          {/* Additional Panels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Panels
            </label>
            <div className="flex items-center space-x-4">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setAdditionalPanels(num)}
                  className={clsx(
                    'px-4 py-2 rounded-lg border transition-all',
                    additionalPanels === num
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300'
                  )}
                >
                  {num === 0 ? 'None' : `+${num}`}
                </button>
              ))}
            </div>
          </div>

          {/* Efficiency Calculation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900">System Efficiency</h4>
              {!efficiencyCalculated && (
                <button
                  onClick={handleCalculateEfficiency}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Calculate Recommended Efficiency</span>
                </button>
              )}
            </div>
            {efficiencyCalculated && calculation.efficiency_loss && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Recommended efficiency loss: <span className="font-medium text-blue-700">{calculation.efficiency_loss.toFixed(2)}%</span>
                </p>
                {calculation.daily_production_before && calculation.daily_production_after && (
                  <div className="mt-2 text-xs space-y-1">
                    <p className="text-gray-600">
                      Daily Production (Before Adjustments): {calculation.daily_production_before.toFixed(2)} kWh
                    </p>
                    <p className="text-gray-600">
                      Daily Production (After Adjustments): {calculation.daily_production_after.toFixed(2)} kWh
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Adjusted Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Adjusted Configuration</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Total Panels</p>
            <p className="text-xl font-semibold text-gray-900">{totalPanels}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Efficiency Loss</p>
            <p className="text-xl font-semibold text-gray-900">
              {calculation.efficiency_loss ? `${calculation.efficiency_loss.toFixed(2)}%` : 'Not calculated'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Final System Size</p>
            <p className="text-xl font-semibold text-blue-700 bg-blue-50 p-2 rounded-lg">
              {finalSystemSize.toFixed(2)} kW
            </p>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-yellow-50 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-yellow-800">System Adjustment Notice</h4>
          <p className="mt-1 text-sm text-yellow-700">
            The system efficiency calculation takes into account multiple factors including panel efficiency (96%),
            conversion efficiency (98%), and other system losses. These values are based on
            industry standards and local conditions.
          </p>
        </div>
      </div>

      {showAcknowledgment && (
        <EfficiencyAcknowledgment
          onClose={() => setShowAcknowledgment(false)}
          onConfirm={handleEfficiencyConfirmed}
        />
      )}
    </div>
  );
};

export default AdjustmentStep;