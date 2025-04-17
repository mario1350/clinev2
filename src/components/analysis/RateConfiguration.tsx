import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useAnalysisStore } from '../../stores/analysisStore';

const RateConfiguration = () => {
  const { gridRate, solarRate, updateGridRate, updateSolarRate } = useAnalysisStore();
  const [showModal, setShowModal] = useState(false);
  const [tempGridRate, setTempGridRate] = useState(gridRate);
  const [tempSolarRate, setTempSolarRate] = useState(solarRate);

  const handleSave = () => {
    updateGridRate(tempGridRate);
    updateSolarRate(tempSolarRate);
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <Settings className="w-4 h-4 mr-1" />
        Configure Rates
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Energy Rate Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grid Power Rate ($/kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tempGridRate}
                  onChange={(e) => setTempGridRate(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Solar Power Rate ($/kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tempSolarRate}
                  onChange={(e) => setTempSolarRate(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RateConfiguration;