import React from 'react';
import { BarChart, CheckCircle2, Clock } from 'lucide-react';

const stages = [
  { id: 1, name: 'Site Assessment', count: 5, icon: BarChart },
  { id: 2, name: 'Design Phase', count: 8, icon: CheckCircle2 },
  { id: 3, name: 'Installation', count: 3, icon: Clock },
];

function ClientProgress() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Client Progress</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <div key={stage.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">{stage.name}</h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {stage.count} clients
                </span>
              </div>
              
              <div className="mt-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Client {i + 1}</div>
                      <div className="text-xs text-gray-500">Updated 2h ago</div>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-900">View</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClientProgress;