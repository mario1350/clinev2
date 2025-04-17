import React, { useState } from 'react';
import { useLeadStore } from '../stores/leadStore';
import LeadSelector from '../components/leads/LeadSelector';
import EngineeringWorkspace from '../components/engineering/EngineeringWorkspace';

const Engineering = () => {
  const [showLeadSelector, setShowLeadSelector] = useState(true);
  const { selectedLead } = useLeadStore();

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Engineering & Installation</h1>
      
      {showLeadSelector ? (
        <LeadSelector onSelect={() => setShowLeadSelector(false)} />
      ) : (
        <>
          {selectedLead && (
            <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Project Details</h2>
                  <p className="text-lg font-semibold text-gray-900">{selectedLead.name}</p>
                  <p className="text-sm text-gray-500">{selectedLead.streetAddress}</p>
                </div>
                <button
                  onClick={() => setShowLeadSelector(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Change Project
                </button>
              </div>
            </div>
          )}
          <EngineeringWorkspace />
        </>
      )}
    </div>
  );
};

export default Engineering;