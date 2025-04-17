import React, { useState } from 'react';
import { Calculator, Package, Zap } from 'lucide-react';
import MaterialSelector from '../components/vendor/MaterialSelector';
import InstallationGuide from '../components/vendor/InstallationGuide';
import SystemSummary from '../components/vendor/SystemSummary';
import { useVendorStore } from '../stores/vendorStore';

const VendorSystemBuilder = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'installation' | 'summary'>('materials');
  const { configuration } = useVendorStore();

  const tabs = [
    { id: 'materials', name: 'Materials', icon: Package },
    { id: 'installation', name: 'Installation Guide', icon: Calculator },
    { id: 'summary', name: 'System Summary', icon: Zap }
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="sm:hidden">
          <select
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`
                    ${activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                    }
                    px-3 py-2 font-medium text-sm rounded-md flex items-center space-x-2
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div>
        {activeTab === 'materials' && <MaterialSelector />}
        {activeTab === 'installation' && <InstallationGuide />}
        {activeTab === 'summary' && <SystemSummary />}
      </div>
    </div>
  );
};

export default VendorSystemBuilder;