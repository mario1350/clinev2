import React, { useState } from 'react';
import { useLeadStore } from '../stores/leadStore';
import LeadSelector from '../components/leads/LeadSelector';
import SolarDesignWizard from '../components/solar/SolarDesignWizard';
import { ArrowLeft } from 'lucide-react';

const SolarDesign = () => {
  const [showLeadSelector, setShowLeadSelector] = useState(true);
  const { selectedLead } = useLeadStore();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Solar System Design</h1>
      
      {showLeadSelector ? (
        <LeadSelector onSelect={() => setShowLeadSelector(false)} />
      ) : (
        <>
          {selectedLead && (
            <>
              <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Selected Lead</h2>
                    <p className="text-lg font-semibold text-gray-900">{selectedLead.name}</p>
                    <p className="text-sm text-gray-500">{selectedLead.email}</p>
                    <p className="text-sm text-gray-500">{selectedLead.phone}</p>
                    <p className="text-sm text-gray-500">{selectedLead.street_address}</p>
                  </div>
                  <button
                    onClick={() => setShowLeadSelector(true)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Change Lead
                  </button>
                </div>
              </div>
              <SolarDesignWizard />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SolarDesign;