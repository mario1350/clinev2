import React, { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { installationSteps } from '../../data/installationSteps';
import { clsx } from 'clsx';

const InstallationGuide = () => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const categories = Array.from(new Set(installationSteps.map(step => step.category)));

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const isStepAvailable = (step: typeof installationSteps[0]) => {
    if (!step.dependsOn) return true;
    return step.dependsOn.every(dependencyId => completedSteps.includes(dependencyId));
  };

  return (
    <div className="p-6 space-y-8">
      {categories.map(category => (
        <div key={category} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 capitalize">
              {category} Steps
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {installationSteps
              .filter(step => step.category === category)
              .map(step => {
                const isCompleted = completedSteps.includes(step.id);
                const isAvailable = isStepAvailable(step);

                return (
                  <div
                    key={step.id}
                    className={clsx(
                      'p-4 flex items-start space-x-3',
                      !isAvailable && 'opacity-50'
                    )}
                  >
                    <button
                      onClick={() => isAvailable && toggleStep(step.id)}
                      disabled={!isAvailable}
                      className={clsx(
                        'flex-shrink-0 w-5 h-5 mt-0.5 rounded border',
                        isCompleted
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300',
                        isAvailable
                          ? 'cursor-pointer hover:border-blue-500'
                          : 'cursor-not-allowed'
                      )}
                    >
                      {isCompleted && <Check className="w-4 h-4" />}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {step.title}
                          {step.required && (
                            <span className="ml-2 text-xs text-red-600">*</span>
                          )}
                        </h4>
                        {step.dependsOn && (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {step.description}
                      </p>
                      {step.dependsOn && (
                        <p className="mt-1 text-xs text-gray-400">
                          Requires previous steps to be completed
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InstallationGuide;