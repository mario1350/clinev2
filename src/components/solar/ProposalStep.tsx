import React from 'react';
import { FileText, Sun, Battery, MapPin, DollarSign } from 'lucide-react';
import type { SolarCalculation } from '../../types/solar';
import { useLeadStore } from '../../stores/leadStore';
import { format } from 'date-fns';

interface ProposalStepProps {
  calculation: Partial<SolarCalculation>;
}

const ProposalStep: React.FC<ProposalStepProps> = ({ calculation }) => {
  const { selectedLead } = useLeadStore();

  if (!calculation.monthlyConsumption || !selectedLead) {
    return <div>Insufficient data for proposal generation</div>;
  }

  const formatDate = (date: Date) => format(date, 'MMMM d, yyyy');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Solar System Proposal</h2>
            <p className="text-gray-500 mt-1">Generated on {formatDate(new Date())}</p>
          </div>
          <button className="btn">
            Export PDF
          </button>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="mt-1 text-sm text-gray-900">{selectedLead.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Contact</p>
            <p className="mt-1 text-sm text-gray-900">{selectedLead.email}</p>
            <p className="text-sm text-gray-900">{selectedLead.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Installation Address</p>
            <p className="mt-1 text-sm text-gray-900">{selectedLead.streetAddress}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Postal Address</p>
            <p className="mt-1 text-sm text-gray-900">{selectedLead.postalAddress}</p>
          </div>
        </div>
      </div>

      {/* System Specifications */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Sun className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Solar System Details</h3>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">System Size</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {calculation.numberOfPanels} panels × {calculation.panelCapacity}W = 
                {' '}{((calculation.numberOfPanels || 0) * (calculation.panelCapacity || 0) / 1000).toFixed(2)} kW
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Monthly Production</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {(calculation.totalAdjustedProduction! * calculation.sunHoursPerDay! * 30).toFixed(2)} kWh
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Panel Efficiency</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {(calculation.panelEfficiency! * 100).toFixed(1)}%
              </dd>
            </div>
          </dl>
        </div>

        {calculation.batteryConfig && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <Battery className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Storage System</h3>
            </div>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Battery Type</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {calculation.batteryConfig.batteryType}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Capacity</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {calculation.batteryConfig.totalCapacity / 1000} kWh
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Backup Time</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {calculation.batteryConfig.estimatedBackupTime.toFixed(1)} hours
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* Installation Location */}
      {calculation.roofAnalysis && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Installation Details</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Roof Area</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {Math.round(calculation.roofAnalysis.totalArea)} m²
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Usable Area</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {Math.round(calculation.roofAnalysis.usableArea)} m²
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Orientation</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {calculation.roofAnalysis.orientation}
                </dd>
              </div>
            </dl>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Roof Tilt</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {calculation.roofAnalysis.tilt}°
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Shading</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {calculation.roofAnalysis.shadingPercentage}% affected
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* Energy Analysis */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <DollarSign className="w-5 h-5 text-green-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Energy Analysis</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Current Monthly Consumption</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {calculation.monthlyConsumption.toFixed(2)} kWh
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Annual Consumption</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {calculation.annualConsumption?.toFixed(2)} kWh
              </dd>
            </div>
          </dl>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Expected Solar Production</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {(calculation.totalAdjustedProduction! * calculation.sunHoursPerDay! * 30).toFixed(2)} kWh/month
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Production Ratio</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {((calculation.totalAdjustedProduction! * calculation.sunHoursPerDay! * 30 / calculation.monthlyConsumption) * 100).toFixed(1)}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Notes and Recommendations */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Notes & Recommendations</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• System designed to offset {((calculation.totalAdjustedProduction! * calculation.sunHoursPerDay! * 30 / calculation.monthlyConsumption) * 100).toFixed(1)}% of current energy consumption</li>
          {calculation.batteryConfig && (
            <li>• Battery system provides approximately {calculation.batteryConfig.estimatedBackupTime.toFixed(1)} hours of backup power</li>
          )}
          <li>• Annual maintenance recommended for optimal performance</li>
          <li>• System includes monitoring capabilities for real-time performance tracking</li>
        </ul>
      </div>
    </div>
  );
};

export default ProposalStep;