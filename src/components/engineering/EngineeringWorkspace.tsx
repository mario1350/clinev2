import React, { useState } from 'react';
import { Wrench, Package, FileText, CheckSquare } from 'lucide-react';
import MaterialsPanel from './MaterialsPanel';
import InstallationGuide from './InstallationGuide';
import ProjectSummary from './ProjectSummary';
import SiteAssessment from './SiteAssessment';
import { clsx } from 'clsx';

type WorkspaceTab = 'assessment' | 'materials' | 'installation' | 'summary';

const EngineeringWorkspace = () => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('assessment');

  const tabs = [
    { id: 'assessment', name: 'Site Assessment', icon: Wrench },
    { id: 'materials', name: 'Materials', icon: Package },
    { id: 'installation', name: 'Installation Guide', icon: FileText },
    { id: 'summary', name: 'Project Summary', icon: CheckSquare },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon
                  className={clsx(
                    'mr-2 h-5 w-5',
                    activeTab === tab.id
                      ? 'text-blue-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'assessment' && <SiteAssessment />}
        {activeTab === 'materials' && <MaterialsPanel />}
        {activeTab === 'installation' && <InstallationGuide />}
        {activeTab === 'summary' && <ProjectSummary />}
      </div>
    </div>
  );
};

export default EngineeringWorkspace;