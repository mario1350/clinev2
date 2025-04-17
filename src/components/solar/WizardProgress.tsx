import React from 'react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface WizardProgressProps {
  steps: Step[];
  currentStep: number;
}

const WizardProgress: React.FC<WizardProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="relative">
      <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200">
        <div
          className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      <div className="relative flex justify-between">
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isCompleted ? 'bg-blue-600 border-blue-600' :
                  isCurrent ? 'border-blue-600 bg-white scale-110' :
                  'border-gray-200 bg-white'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span
                    className={
                      isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }
                  >
                    {step.id}
                  </span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={clsx(
                    'text-sm font-medium',
                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">{step.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgress;