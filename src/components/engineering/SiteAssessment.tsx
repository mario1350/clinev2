import React, { useState } from 'react';
import { Camera, Ruler, Sun, CloudRain } from 'lucide-react';
import { clsx } from 'clsx';

interface Assessment {
  roofCondition: string;
  roofType: string;
  shading: string;
  orientation: string;
  notes: string;
  weatherConditions: string[];
}

const SiteAssessment = () => {
  const [assessment, setAssessment] = useState<Assessment>({
    roofCondition: '',
    roofType: '',
    shading: '',
    orientation: '',
    notes: '',
    weatherConditions: [],
  });

  const roofConditions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const roofTypes = ['Shingle', 'Metal', 'Tile', 'Flat'];
  const shadingOptions = ['None', 'Minimal', 'Moderate', 'Significant'];
  const orientations = ['North', 'South', 'East', 'West'];
  const weatherConditionOptions = ['Sunny', 'Cloudy', 'Rainy', 'Windy'];

  const handleWeatherConditionToggle = (condition: string) => {
    setAssessment(prev => ({
      ...prev,
      weatherConditions: prev.weatherConditions.includes(condition)
        ? prev.weatherConditions.filter(c => c !== condition)
        : [...prev.weatherConditions, condition]
    }));
  };

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roof Condition
          </label>
          <div className="space-y-2">
            {roofConditions.map((condition) => (
              <label
                key={condition}
                className={clsx(
                  'flex items-center p-3 border rounded-lg cursor-pointer',
                  assessment.roofCondition === condition
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                )}
              >
                <input
                  type="radio"
                  name="roofCondition"
                  value={condition}
                  checked={assessment.roofCondition === condition}
                  onChange={(e) => setAssessment(prev => ({
                    ...prev,
                    roofCondition: e.target.value
                  }))}
                  className="sr-only"
                />
                <span className="text-sm text-gray-900">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roof Type
          </label>
          <div className="space-y-2">
            {roofTypes.map((type) => (
              <label
                key={type}
                className={clsx(
                  'flex items-center p-3 border rounded-lg cursor-pointer',
                  assessment.roofType === type
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                )}
              >
                <input
                  type="radio"
                  name="roofType"
                  value={type}
                  checked={assessment.roofType === type}
                  onChange={(e) => setAssessment(prev => ({
                    ...prev,
                    roofType: e.target.value
                  }))}
                  className="sr-only"
                />
                <span className="text-sm text-gray-900">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shading Assessment
          </label>
          <div className="space-y-2">
            {shadingOptions.map((option) => (
              <label
                key={option}
                className={clsx(
                  'flex items-center p-3 border rounded-lg cursor-pointer',
                  assessment.shading === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                )}
              >
                <input
                  type="radio"
                  name="shading"
                  value={option}
                  checked={assessment.shading === option}
                  onChange={(e) => setAssessment(prev => ({
                    ...prev,
                    shading: e.target.value
                  }))}
                  className="sr-only"
                />
                <span className="text-sm text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Roof Orientation
          </label>
          <div className="space-y-2">
            {orientations.map((orientation) => (
              <label
                key={orientation}
                className={clsx(
                  'flex items-center p-3 border rounded-lg cursor-pointer',
                  assessment.orientation === orientation
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                )}
              >
                <input
                  type="radio"
                  name="orientation"
                  value={orientation}
                  checked={assessment.orientation === orientation}
                  onChange={(e) => setAssessment(prev => ({
                    ...prev,
                    orientation: e.target.value
                  }))}
                  className="sr-only"
                />
                <span className="text-sm text-gray-900">{orientation}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Weather Conditions
        </label>
        <div className="flex flex-wrap gap-2">
          {weatherConditionOptions.map((condition) => (
            <button
              key={condition}
              onClick={() => handleWeatherConditionToggle(condition)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium',
                assessment.weatherConditions.includes(condition)
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {condition}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          value={assessment.notes}
          onChange={(e) => setAssessment(prev => ({
            ...prev,
            notes: e.target.value
          }))}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter any additional observations or notes..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="btn"
        >
          Save Assessment
        </button>
      </div>
    </div>
  );
};

export default SiteAssessment;