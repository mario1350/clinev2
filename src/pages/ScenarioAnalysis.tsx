import React, { useState } from 'react';
import { useLeadStore } from '../stores/leadStore';
import LeadSelector from '../components/leads/LeadSelector';
import ApplianceAnalysis from '../components/analysis/ApplianceAnalysis';
import SolarComparison from '../components/analysis/SolarComparison';
import { Zap, BarChart } from 'lucide-react';
import { clsx } from 'clsx';

const ScenarioAnalysis = () => {
  const [showLeadSelector, setShowLeadSelector] = useState(true);
  const [activeTab, setActiveTab] = useState<'appliances' | 'comparison'>('appliances');
  const { selectedLead } = useLeadStore();

  const tabs = [
    { id: 'appliances', name: 'Appliance Analysis', icon: Zap },
    { id: 'comparison', name: 'Solar Comparison', icon: BarChart }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Scenario Analysis</h1>
      
      {showLeadSelector ? (
        <LeadSelector onSelect={() => setShowLeadSelector(false)} />
      ) : (
        <>
          {selectedLead && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Selected Client</h2>
                    <p className="text-lg font-semibold text-gray-900">{selectedLead.name}</p>
                    <p className="text-sm text-gray-500">{selectedLead.email}</p>
                  </div>
                  <button
                    onClick={() => setShowLeadSelector(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Change Client
                  </button>
                </div>
              </div>

              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={clsx(
                          'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )}
                      >
                        <Icon className={clsx(
                          'mr-2 h-5 w-5',
                          activeTab === tab.id
                            ? 'text-blue-500'
                            : 'text-gray-400 group-hover:text-gray-500'
                        )} />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="bg-white rounded-lg shadow">
                {activeTab === 'appliances' && <ApplianceAnalysis />}
                {activeTab === 'comparison' && <SolarComparison />}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ScenarioAnalysis;