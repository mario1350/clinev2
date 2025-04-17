import React, { useState, useCallback } from 'react';
import { useLeadStore } from '../../stores/leadStore';
import { useSolarDesignStore } from '../../stores/solarDesignStore';
import ConsumptionStep from './steps/ConsumptionStep';
import PanelSelectionStep from './steps/PanelSelectionStep';
import AdjustmentStep from './steps/AdjustmentStep';
import ResultsStep from './steps/ResultsStep';
import RoofAnalysisStep from './steps/RoofAnalysisStep';
import BatterySelectionStep from './steps/BatterySelectionStep';
import ProposalStep from './ProposalStep';
import FinancingStep from './steps/FinancingStep';
import WizardProgress from './WizardProgress';
import type { SolarCalculation } from '../../types/solar';

const steps = [
  { id: 1, title: 'Consumption', description: 'Enter monthly consumption' },
  { id: 2, title: 'System Setup', description: 'Select panels and scenario' },
  { id: 3, title: 'Adjustment', description: 'Fine-tune system size' },
  { id: 4, title: 'Results', description: 'View detailed calculations' },
  { id: 5, title: 'Roof Analysis', description: 'Analyze roof dimensions' },
  { id: 6, title: 'Battery Storage', description: 'Configure battery system' },
  { id: 7, title: 'Financing', description: 'Configure financing options' },
  { id: 8, title: 'Proposal', description: 'Review complete proposal' },
];

const SolarDesignWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [calculation, setCalculation] = useState<Partial<SolarCalculation>>({});
  const { selectedLead } = useLeadStore();
  const { getDesign, addDesign, updateDesign } = useSolarDesignStore();

  const updateCalculation = useCallback((data: Partial<SolarCalculation>) => {
    setCalculation(prev => ({ ...prev, ...data }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          <ConsumptionStep
            calculation={calculation}
            onUpdate={updateCalculation}
          />
        );
      case 2:
        return (
          <PanelSelectionStep
            calculation={calculation}
            onUpdate={updateCalculation}
          />
        );
      case 3:
        return (
          <AdjustmentStep
            calculation={calculation}
            onUpdate={updateCalculation}
          />
        );
      case 4:
        return <ResultsStep calculation={calculation} />;
      case 5:
        return (
          <RoofAnalysisStep
            calculation={calculation}
            onUpdate={updateCalculation}
          />
        );
      case 6:
        return (
          <BatterySelectionStep
            calculation={calculation}
            onUpdate={updateCalculation}
          />
        );
      case 7:
        return (
          <FinancingStep
            calculation={calculation}
            onUpdate={updateCalculation}
          />
        );
      case 8:
        return <ProposalStep calculation={calculation} />;
      default:
        return null;
    }
  }, [currentStep, calculation, updateCalculation]);

  if (!selectedLead) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Please select a lead to begin the solar design process.</p>
      </div>
    );
  }

  const canProceed = currentStep === 1 ? !!calculation.monthly_consumption : true;

  return (
    <div className="max-w-4xl mx-auto">
      <WizardProgress steps={steps} currentStep={currentStep} />
      
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          {renderStep()}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            disabled={currentStep === 1}
          >
            Back
          </button>
          {currentStep < steps.length && (
            <button
              onClick={handleNext}
              className={`btn ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canProceed}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolarDesignWizard;