import React from 'react';
import { Sun, Cloud, Compass, Ruler } from 'lucide-react';

interface SolarAnalysisResultsProps {
  data: {
    roofArea: number;
    usableArea: number;
    shadingPercentage: number;
    orientation: string;
    tilt: number;
    solarRadiation: number;
    estimatedOutput: number;
  };
}

const SolarAnalysisResults: React.FC<SolarAnalysisResultsProps> = ({ data }) => {
  // Validate all required data is present
  const hasValidData = data && 
    typeof data.roofArea === 'number' &&
    typeof data.usableArea === 'number' &&
    typeof data.shadingPercentage === 'number' &&
    typeof data.solarRadiation === 'number' &&
    typeof data.estimatedOutput === 'number';

  if (!hasValidData) {
    return (
      <div className="bg-yellow-50 rounded-lg p-4">
        <p className="text-yellow-800">
          Unable to display solar analysis results. Some data is unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Ruler className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-900">Roof Measurements</h3>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Roof Area</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {Math.round(data.roofArea)} m²
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Usable Area</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {Math.round(data.usableArea)} m²
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Sun className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-medium text-gray-900">Solar Potential</h3>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Solar Radiation</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {data.solarRadiation.toFixed(1)} kWh/m²/day
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estimated Annual Output</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {Math.round(data.estimatedOutput).toLocaleString()} kWh
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Compass className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-medium text-gray-900">Roof Characteristics</h3>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Orientation</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{data.orientation}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Roof Tilt</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{data.tilt}°</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Shading</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {data.shadingPercentage}% affected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarAnalysisResults;