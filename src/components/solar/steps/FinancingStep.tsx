import React, { useMemo, useState } from 'react';
import { AlertTriangle, Package, Battery, DollarSign, CheckCircle, Calendar, CreditCard, Wallet, Info, TrendingUp, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import type { SolarCalculation } from '../../../types/solar';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../common/ConfirmationModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, AreaChart, Area } from 'recharts';
import { calculatePayments, generateFinancingComparison } from '../../../utils/financing';
import { useLeadStore } from '../../../stores/leadStore';
import { generateProposal } from '../utils/ProposalGenerator';
import { slugify } from '../../../utils/slugify';

interface FinancingStepProps {
  calculation: Partial<SolarCalculation>;
  onUpdate: (data: Partial<SolarCalculation>) => void;
}

interface FinancialComparison {
  originalPayment: number;
  reducedPrincipalPayment: number;
  percentDifference: number;
  projectedLumaCosts: number[];
  totalSolarPayments: number;
  totalLumaPayments: number;
}

type CreditScoreRange = 'low' | 'mid' | 'high';
type LoanTerm = 10 | 15 | 20 | 25;
type IncentiveType = 'cashback' | 'principal' | 'other' | undefined;

const LUMA_RATES = {
  2024: 0.26038,
  2025: 0.29,
  2026: 0.3048,
  2027: 0.3173,
  2028: 0.3261,
  2029: 0.3567,
  2030: 0.3603,
  2031: 0.3650,
};

// Interest rates based on loan term and credit score range
const INTEREST_RATES: Record<LoanTerm, Record<CreditScoreRange, number>> = {
  10: { low: 6.49, mid: 5.49, high: 4.99 },
  15: { low: 6.99, mid: 5.69, high: 5.49 },
  20: { low: 7.99, mid: 6.49, high: 6.49 },
  25: { low: 8.49, mid: 6.99, high: 6.99 }
};

// Credit score range definitions
const CREDIT_SCORE_RANGES = {
  low: { min: 640, max: 670, label: '640-670 (Low FICO)' },
  mid: { min: 671, max: 699, label: '671-699 (Mid FICO)' },
  high: { min: 700, max: 850, label: '700+ (High FICO)' }
};

import type { FinancingData } from '../utils/ProposalGenerator';

// Incentive amount constant
const INCENTIVE_AMOUNT = 6000;

const calculatePercentDifference = (original: number, adjusted: number) => 
  ((original - adjusted) / original) * 100;

const calculateLumaProjection = (consumptionKWh: number) => {
  const baseRate = LUMA_RATES[2024];
  return Array.from({ length: 15 }, (_, i) => {
    let rate = baseRate;
    if (i >= 1) rate *= 1.05; // 2025
    if (i >= 2) rate *= 1.045; // 2026
    if (i >= 3) rate *= 1.04; // 2027
    if (i >= 4) rate *= Math.pow(1.039, i - 3); // 2028+
    return consumptionKWh * rate * 12;
  });
};

// Price table for solar panel configurations
const panelPriceTable: Record<number, number> = {
  6: 21599,
  8: 23999,
  10: 25999,
  12: 27999,
  14: 30499,
  16: 32499,
  18: 35499,
  20: 37999
};

const getBatteryConfig = (panelCount: number) => {
  return {
    agate: panelCount > 20 ? 1 : 1,
    apower: panelCount > 20 ? 2 : 1
  };
};

const FinancingStep: React.FC<FinancingStepProps> = ({ calculation, onUpdate }) => {
  const [financingData, setFinancingData] = useState<FinancingData>({
    loanTerm: 15,
    creditScoreRange: '',
    incentiveType: undefined,
    apr: 0,
    principal: 0,
    reducedPrincipal: 0,
    monthly: 0,
    reducedMonthly: 0,
    totalInterest: 0,
    reducedTotalInterest: 0,
    total: 0,
    reducedTotal: 0
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showIncentiveOptions, setShowIncentiveOptions] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleCaseSubmit = () => {
    setShowConfirmModal(true);
  };

  const { selectedLead } = useLeadStore();

  const handleConfirmSubmit = async () => {
    // Save the final calculations and terms
    setShowConfirmModal(false);

    try {
      // Create a mock lead if selectedLead is not available (for testing)
      const lead = selectedLead || {
        id: 'test-lead',
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '555-123-4567',
        street_address: '123 Solar St, San Juan, PR',
        postal_address: 'San Juan, PR 00901',
        coordinates: { latitude: 18.4655, longitude: -66.1057 },
        date_of_birth: new Date(),
        monthly_income: 5000,
        id_type: 'license' as const,
        id_number: 'DL12345678',
        id_expiration: new Date(),
        ssn: '123-45-6789',
        payment_method: 'financed' as const,
        financing_option: 'sanBlas' as const,
        status: 'proposal' as const,
        created_at: new Date(),
        last_contact: new Date()
      };
      
      // Ensure we have payment data
      if (!payments) {
        throw new Error('Payment data is not available');
      }
      
      // Log data for debugging
      console.log('Generating PDF with data:', {
        calculation,
        lead,
        financingData,
        systemConfig
      });
      
      // Generate the PDF blob
      const pdfBlob = await generateProposal(
        calculation,
        lead,
        {
          ...financingData,
          loanTerm: financingData.loanTerm,
          apr: financingData.apr,
          principal: systemConfig?.price || 0,
          incentiveType: financingData.incentiveType,
          monthly: payments.standard.monthly,
          reducedMonthly: payments.reduced.monthly,
          total: payments.standard.total,
          reducedTotal: payments.reduced.total
        }
      );
      
      // Create a download link for the PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      // Use slugify for safe filenames
      link.download = `Solar_Proposal_${slugify(lead.name)}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('PDF generated successfully!');
      
      // Navigate to the proposal step
      navigate('/proposal');
    } catch (error) {
      console.error('Error generating proposal:', error);
      alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Get adjusted panel count and system configuration
  const systemConfig = useMemo(() => {
    if (!calculation.adjusted_system_size || !calculation.panel_capacity) return null;
    
    const adjustedPanels = Math.ceil((calculation.adjusted_system_size * 1000) / calculation.panel_capacity);
    const closestSize = Object.keys(panelPriceTable)
      .map(Number)
      .reduce((prev, curr) => 
        Math.abs(curr - adjustedPanels) < Math.abs(prev - adjustedPanels)
          ? curr
          : prev
      );
    
    const batteryConfig = getBatteryConfig(adjustedPanels);
    
    return {
      adjustedPanels,
      price: panelPriceTable[closestSize],
      ...batteryConfig
    };
  }, [calculation.adjusted_system_size, calculation.panel_capacity]);

  const payments = useMemo(() => {
    if (!systemConfig?.price || !financingData.apr || !financingData.loanTerm) return null;

    // Calculate standard payments
    const standardPayments = calculatePayments(systemConfig.price, financingData.apr, financingData.loanTerm);
    
    // Calculate payments with reduced principal (incentive applied to principal)
    const reducedPrincipal = Math.max(0, systemConfig.price - INCENTIVE_AMOUNT);
    const reducedPayments = calculatePayments(reducedPrincipal, financingData.apr, financingData.loanTerm);
    
    return {
      standard: standardPayments,
      reduced: reducedPayments,
      reducedPrincipal
    };
  }, [systemConfig?.price, financingData.apr, financingData.loanTerm]);

  const financialMetrics = useMemo(() => {
    if (!calculation.monthly_consumption || !payments) return null;

    const originalPayment = payments.standard.monthly;
    const reducedPrincipalPayment = payments.reduced.monthly;
    const percentDifference = calculatePercentDifference(originalPayment, reducedPrincipalPayment);
    const projectedLumaCosts = calculateLumaProjection(calculation.monthly_consumption);
    
    // Calculate total payments over the full term
    const totalPayments = financingData.loanTerm * 12;
    const totalSolarPayments = originalPayment * totalPayments;
    
    // Calculate total LUMA payments over the loan term
    // We'll use the projected costs for the available years and extrapolate for the rest
    const availableYears = projectedLumaCosts.length;
    let totalLumaPayments = 0;
    
    for (let i = 0; i < financingData.loanTerm; i++) {
      if (i < availableYears) {
        totalLumaPayments += projectedLumaCosts[i];
      } else {
        // Extrapolate using the last available year with a small increase
        totalLumaPayments += projectedLumaCosts[availableYears - 1] * Math.pow(1.05, i - availableYears + 1);
      }
    }

    return {
      originalPayment,
      reducedPrincipalPayment,
      percentDifference,
      projectedLumaCosts,
      totalSolarPayments,
      totalLumaPayments
    };
  }, [calculation.monthly_consumption, payments, financingData.loanTerm]);

  const comparisonData = useMemo(() => {
    if (!financialMetrics) return [];
    
    // Generate data for LUMA vs Solar comparison
    return Array.from({ length: Math.min(15, financingData.loanTerm) }, (_, index) => {
      const year = index + 1;
      
      return {
        year,
        luma_cost: financialMetrics.projectedLumaCosts[index],
        solar_standard: financialMetrics.originalPayment * 12,
        solar_reduced: financialMetrics.reducedPrincipalPayment * 12
      };
    });
  }, [financialMetrics, financingData.loanTerm]);

  // Data for before/after incentive comparison
  const incentiveComparisonData = useMemo(() => {
    if (!payments) return [];
    
    return [
      {
        name: 'Standard',
        principal: systemConfig?.price || 0,
        monthly: payments.standard.monthly,
        interest: payments.standard.totalInterest
      },
      {
        name: 'With Principal Reduction',
        principal: payments.reducedPrincipal,
        monthly: payments.reduced.monthly,
        interest: payments.reduced.totalInterest
      }
    ];
  }, [payments, systemConfig?.price]);

  const handleLoanTermSelect = (term: LoanTerm) => {
    setFinancingData(prev => ({
      ...prev,
      loanTerm: term,
      // Reset credit score range when term changes
      creditScoreRange: '',
      incentiveType: undefined,
      apr: 0
    }));
    setIsSubmitted(false);
    setShowIncentiveOptions(false);
    setPreviewMode(false);
  };

  const handleCreditScoreSelect = (range: CreditScoreRange) => {
    const apr = INTEREST_RATES[financingData.loanTerm as LoanTerm][range];
    
    setFinancingData(prev => ({
      ...prev,
      creditScoreRange: range,
      apr
    }));
    
    setShowIncentiveOptions(true);
    setIsSubmitted(false);
  };

  const handleIncentiveSelect = (type: IncentiveType) => {
    if (!payments) return;
    
    setFinancingData(prev => ({
      ...prev,
      incentiveType: type,
      principal: systemConfig?.price || 0,
      reducedPrincipal: payments.reducedPrincipal,
      monthly: payments.standard.monthly,
      reducedMonthly: payments.reduced.monthly,
      totalInterest: payments.standard.totalInterest,
      reducedTotalInterest: payments.reduced.totalInterest,
      total: payments.standard.total,
      reducedTotal: payments.reduced.total
    }));
    
    setIsSubmitted(true);
    setPreviewMode(false);
  };

  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
  };

  if (!systemConfig) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">System Configuration Required</h3>
        <p className="mt-2 text-sm text-gray-500">
          Please complete the system configuration steps first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* System Summary */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Battery className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">aGate Units</p>
            </div>
            <p className="text-2xl font-bold text-blue-700">{systemConfig.agate}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Battery className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-900">aPower Units</p>
            </div>
            <p className="text-2xl font-bold text-green-700">{systemConfig.apower}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="w-5 h-5 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-900">Solar Panels</p>
            </div>
            <p className="text-2xl font-bold text-yellow-700">{systemConfig.adjustedPanels}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <p className="text-sm font-medium text-purple-900">Retail Price</p>
            </div>
            <p className="text-2xl font-bold text-purple-700">${systemConfig.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Loan Term Selection */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Loan Term</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[10, 15, 20, 25].map((term) => (
            <button
              key={term}
              onClick={() => handleLoanTermSelect(term as LoanTerm)}
              className={clsx(
                'p-4 rounded-lg border-2 transition-all',
                financingData.loanTerm === term
                  ? 'border-[#2563eb] bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              )}
            >
              <Calendar className="w-6 h-6 text-[#2563eb] mb-2" />
              <div className="text-lg font-semibold">{term} Years</div>
              <p className="text-sm text-gray-600 mt-1">
                {term === 10 && 'Shortest term'}
                {term === 15 && 'Standard term'}
                {term === 20 && 'Extended term'}
                {term === 25 && 'Longest term'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Credit Score Range Selection */}
      {financingData.loanTerm > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Credit Score Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(CREDIT_SCORE_RANGES) as CreditScoreRange[]).map((range) => (
              <button
                key={range}
                onClick={() => handleCreditScoreSelect(range)}
                className={clsx(
                  'p-4 rounded-lg border-2 transition-all',
                  financingData.creditScoreRange === range
                    ? 'border-[#22c55e] bg-green-50'
                    : 'border-gray-200 hover:border-green-200'
                )}
              >
                <div className="text-lg font-semibold text-gray-900">
                  {CREDIT_SCORE_RANGES[range].label}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {financingData.loanTerm && (
                    <>Rate: {INTEREST_RATES[financingData.loanTerm as LoanTerm][range]}%</>
                  )}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Incentive Options */}
      {showIncentiveOptions && payments && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Incentive Option</h3>
          
          {/* Financing Details Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <p className="text-base font-medium text-blue-800" style={{ fontSize: '1.4rem' }}>
                {financingData.loanTerm} Year Term at {financingData.apr}% APR | Principal: ${systemConfig?.price.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end mb-4">
            <button
              onClick={handlePreviewToggle}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {previewMode ? "Hide Comparison" : "Preview Comparison"}
            </button>
          </div>
          
          {previewMode && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Incentive Comparison</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <h5 className="text-base font-medium text-gray-900">Incentivo CashBack</h5>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Monthly Payment:</span>
                      <span className="font-medium">${payments.standard.monthly.toFixed(2)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Principal:</span>
                      <span className="font-medium">${systemConfig?.price.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Cash Incentive:</span>
                      <span className="font-medium text-green-600">+$6,000.00</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Total Interest:</span>
                      <span className="font-medium">${payments.standard.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Wallet className="w-5 h-5 text-green-600" />
                    <h5 className="text-base font-medium text-gray-900">Incentivo Principal</h5>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Monthly Payment:</span>
                      <span className="font-medium">${payments.reduced.monthly.toFixed(2)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Reduced Principal:</span>
                      <span className="font-medium">${payments.reducedPrincipal.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Principal Reduction:</span>
                      <span className="font-medium text-green-600">-$6,000.00</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Total Interest:</span>
                      <span className="font-medium">${payments.reduced.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Comparison Chart */}
              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incentiveComparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, '']}
                    />
                    <Legend />
                    <Bar name="Monthly Payment (×100)" dataKey="monthly" fill="#3b82f6" barSize={30} unit="$" />
                    <Bar name="Principal" dataKey="principal" fill="#10b981" barSize={30} unit="$" />
                    <Bar name="Total Interest" dataKey="interest" fill="#f59e0b" barSize={30} unit="$" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleIncentiveSelect('cashback')}
              className={clsx(
                'p-4 rounded-lg border-2 transition-all',
                financingData.incentiveType === 'cashback'
                  ? 'border-[#2563eb] bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              )}
            >
              <CreditCard className="w-6 h-6 text-[#2563eb] mb-2" />
              <div className="text-lg font-semibold">Incentivo CashBack</div>
              <p className="text-sm text-gray-600 mt-1">
                Reciba $6,000 en efectivo
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Pago mensual: ${payments.standard.monthly.toFixed(2)}
              </p>
            </button>
            
            <button
              onClick={() => handleIncentiveSelect('principal')}
              className={clsx(
                'p-4 rounded-lg border-2 transition-all',
                financingData.incentiveType === 'principal'
                  ? 'border-[#22c55e] bg-green-50'
                  : 'border-gray-200 hover:border-green-200'
              )}
            >
              <Wallet className="w-6 h-6 text-[#22c55e] mb-2" />
              <div className="text-lg font-semibold">Incentivo Principal</div>
              <p className="text-sm text-gray-600 mt-1">
                Reduzca el principal por $6,000
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Pago mensual: ${payments.reduced.monthly.toFixed(2)}
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      {isSubmitted && payments && financialMetrics && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h3>

          {/* Financing Details Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <p className="text-base font-medium text-blue-800" style={{ fontSize: '1.4rem' }}>
                {financingData.loanTerm} Year Term at {financingData.apr}% APR | 
                {financingData.incentiveType === 'principal' 
                  ? ` Reduced Principal: $${payments.reducedPrincipal.toLocaleString()}` 
                  : ` Principal: $${systemConfig.price.toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* Monthly Payment Information */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Monthly Payment</h4>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                {financingData.incentiveType === 'principal' ? 'Reduced Monthly Payment' : 'Monthly Payment'}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                ${financingData.incentiveType === 'principal' 
                  ? financialMetrics.reducedPrincipalPayment.toFixed(2) 
                  : financialMetrics.originalPayment.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {financingData.incentiveType === 'principal' 
                  ? 'With $6,000 principal reduction' 
                  : 'Standard payment with $6,000 cashback'}
              </p>
            </div>
          </div>

          {/* LUMA Comparison */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">LUMA vs. Solar Comparison</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-gray-500 mb-2">Year 10 LUMA Monthly Payment</p>
                <p className="text-2xl font-bold text-red-600">
                  ${(financialMetrics.projectedLumaCosts[9] / 12).toFixed(2)}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Based on projected rate increases
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-500 mb-2">Your Fixed Solar Payment</p>
                <p className="text-2xl font-bold text-green-600">
                  ${financingData.incentiveType === 'principal' 
                    ? financialMetrics.reducedPrincipalPayment.toFixed(2) 
                    : financialMetrics.originalPayment.toFixed(2)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Fixed payment for the life of the loan
                </p>
              </div>
            </div>
          </div>

          {/* Total Payments Over Loan Term */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Total Payments Over {financingData.loanTerm} Years</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Total Solar Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${financingData.incentiveType === 'principal'
                    ? (financialMetrics.reducedPrincipalPayment * financingData.loanTerm * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })
                    : financialMetrics.totalSolarPayments.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {financingData.loanTerm * 12} monthly payments
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-gray-500 mb-2">Total LUMA Payments</p>
                <p className="text-2xl font-bold text-red-600">
                  ${financialMetrics.totalLumaPayments.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Based on projected rate increases over {financingData.loanTerm} years
                </p>
              </div>
            </div>
          </div>

          {/* LUMA vs Solar Chart */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              LUMA vs. Solar Cost Comparison
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => [`$${(value / 1000).toFixed(1)}k`, '']}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    name="LUMA Projected Cost" 
                    dataKey="luma_cost" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    name={financingData.incentiveType === 'principal' 
                      ? "Solar Payment (with principal reduction)" 
                      : "Solar Payment (with cashback)"}
                    dataKey={financingData.incentiveType === 'principal' ? "solar_reduced" : "solar_standard"} 
                    stroke="#2563eb" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * LUMA projections based on announced rate increases • Solar payment is fixed for the life of the loan
            </p>
          </div>

          {/* Financing Options Comparison */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-medium text-gray-900">
                Financing Options Comparison
              </h4>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  This comparison shows how our financing option compares to typical PPA and Lease options offered by other companies. 
                  The PPA and Lease calculations use industry-standard terms: 3% annual escalator, 0.5% annual panel degradation, 
                  and a 25-year term. Our financing option provides you with full ownership after the loan term.
                </p>
              </div>
            </div>
            
            {(() => {
              // Calculate financing comparison data
              const currentMonthlyPayment = financingData.incentiveType === 'principal' 
                ? financialMetrics.reducedPrincipalPayment 
                : financialMetrics.originalPayment;
              
              const financingComparison = generateFinancingComparison(
                systemConfig.price,
                currentMonthlyPayment,
                financingData.loanTerm,
                calculation.monthly_consumption || 0,
                LUMA_RATES[2024]
              );
              
              // Format data for the chart
              const cumulativeData = financingComparison.yearlyComparison.reduce((acc, yearData) => {
                const prevYear = acc.length > 0 ? acc[acc.length - 1] : { year: 0, loan_cumulative: 0, ppa_cumulative: 0, lease_cumulative: 0 };
                
                acc.push({
                  year: yearData.year,
                  loan_cumulative: prevYear.loan_cumulative + yearData.loan,
                  ppa_cumulative: prevYear.ppa_cumulative + yearData.ppa,
                  lease_cumulative: prevYear.lease_cumulative + yearData.lease
                });
                
                return acc;
              }, [] as Array<{
                year: number;
                loan_cumulative: number;
                ppa_cumulative: number;
                lease_cumulative: number;
              }>);
              
              return (
                <>
                  {/* Comparison Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h5 className="text-base font-medium text-blue-800 mb-2">Our Financing</h5>
                      <p className="text-3xl font-bold text-blue-900">
                        ${financingComparison.totalComparison.loan.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">Total payments over {financingData.loanTerm} years</p>
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-sm font-medium text-blue-800">Key Benefits:</p>
                        <ul className="mt-1 text-xs text-blue-700 space-y-1">
                          <li className="flex items-start space-x-1">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Fixed monthly payments</span>
                          </li>
                          <li className="flex items-start space-x-1">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Full ownership after loan term</span>
                          </li>
                          <li className="flex items-start space-x-1">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>No payments after loan term</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h5 className="text-base font-medium text-gray-800 mb-2">Typical PPA</h5>
                      <p className="text-3xl font-bold text-gray-900">
                        ${financingComparison.totalComparison.ppa.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Total payments over 25 years</p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700">Key Limitations:</p>
                        <ul className="mt-1 text-xs text-gray-600 space-y-1">
                          <li className="flex items-start space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>3% annual rate escalator</span>
                          </li>
                          <li className="flex items-start space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>No ownership - pay for power only</span>
                          </li>
                          <li className="flex items-start space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>Payments continue for full 25 years</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h5 className="text-base font-medium text-gray-800 mb-2">Typical Lease</h5>
                      <p className="text-3xl font-bold text-gray-900">
                        ${financingComparison.totalComparison.lease.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Total payments over 25 years</p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700">Key Limitations:</p>
                        <ul className="mt-1 text-xs text-gray-600 space-y-1">
                          <li className="flex items-start space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>3% annual payment escalator</span>
                          </li>
                          <li className="flex items-start space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>Limited ownership options</span>
                          </li>
                          <li className="flex items-start space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>Payments continue for full 25 years</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Savings Highlight */}
                  <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h5 className="text-base font-medium text-green-800 mb-1">Total Savings with Our Financing</h5>
                        <p className="text-sm text-green-700">Compared to typical alternatives over 25 years</p>
                      </div>
                      <div className="mt-3 md:mt-0 flex space-x-6">
                        <div>
                          <p className="text-sm text-green-700">vs. PPA:</p>
                          <p className="text-xl font-bold text-green-800">
                            ${financingComparison.totalComparison.loanSavingsVsPpa.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-green-700">vs. Lease:</p>
                          <p className="text-xl font-bold text-green-800">
                            ${financingComparison.totalComparison.loanSavingsVsLease.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cumulative Cost Chart */}
                  <div className="h-80 mt-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Cumulative Cost Comparison (25 Years)</h5>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cumulativeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, '']}
                          labelFormatter={(label) => `Year ${label}`}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          name="Our Financing" 
                          dataKey="loan_cumulative" 
                          stroke="#2563eb" 
                          fill="#dbeafe" 
                          strokeWidth={2}
                        />
                        <Area 
                          type="monotone" 
                          name="Typical PPA" 
                          dataKey="ppa_cumulative" 
                          stroke="#9333ea" 
                          fill="#f3e8ff" 
                          strokeWidth={2}
                        />
                        <Area 
                          type="monotone" 
                          name="Typical Lease" 
                          dataKey="lease_cumulative" 
                          stroke="#ea580c" 
                          fill="#ffedd5" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-gray-500 mt-2">
                      * PPA and Lease calculations use industry-standard terms: 3% annual escalator, 0.5% annual panel degradation
                    </p>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Submit Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={async () => {
                try {
                  // Create a mock lead if selectedLead is not available (for testing)
                  const lead = selectedLead || {
                    id: 'test-lead',
                    name: 'Test Customer',
                    email: 'test@example.com',
                    phone: '555-123-4567',
                    street_address: '123 Solar St, San Juan, PR',
                    postal_address: 'San Juan, PR 00901',
                    coordinates: { latitude: 18.4655, longitude: -66.1057 },
                    date_of_birth: new Date(),
                    monthly_income: 5000,
                    id_type: 'license' as const,
                    id_number: 'DL12345678',
                    id_expiration: new Date(),
                    ssn: '123-45-6789',
                    payment_method: 'financed' as const,
                    financing_option: 'sanBlas' as const,
                    status: 'proposal' as const,
                    created_at: new Date(),
                    last_contact: new Date()
                  };
                  
                  // Show loading state
                  const button = document.activeElement as HTMLButtonElement;
                  const originalText = button.innerHTML;
                  button.disabled = true;
                  button.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating PDF...';
                  
                  // Ensure we have payment data
                  if (!payments) {
                    throw new Error('Payment data is not available');
                  }
                  
                  // Log data for debugging
                  console.log('Generating PDF with data:', {
                    calculation,
                    lead,
                    financingData,
                    systemConfig
                  });
                  
                  // Generate the PDF blob
                  const pdfBlob = await generateProposal(
                    calculation,
                    lead,
                    {
                      ...financingData,
                      loanTerm: financingData.loanTerm,
                      apr: financingData.apr,
                      principal: systemConfig?.price || 0,
                      incentiveType: financingData.incentiveType,
                      monthly: payments.standard.monthly,
                      reducedMonthly: payments.reduced.monthly,
                      total: payments.standard.total,
                      reducedTotal: payments.reduced.total
                    }
                  );
                  
                  // Create a download link for the PDF
                  const url = URL.createObjectURL(pdfBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  // Use slugify for safe filenames
                  link.download = `Solar_Proposal_${slugify(lead.name)}_${new Date().toISOString().split('T')[0]}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  
                  // Reset button state
                  button.disabled = false;
                  button.innerHTML = originalText;
                  
                  // Show success message
                  alert('PDF generated successfully!');
                  
                } catch (error) {
                  console.error('Error generating proposal:', error);
                  alert(`Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  
                  // Reset button if there was an error
                  const button = document.activeElement as HTMLButtonElement;
                  if (button) {
                    button.disabled = false;
                    button.innerHTML = '<svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Generate PDF';
                  }
                }
              }}
              className="flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Generate PDF
            </button>
            <button
              onClick={handleCaseSubmit}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Proceed with Selected Terms
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          title="Confirm Financing Terms"
          message={`Are you sure you want to proceed with the selected financing terms? 
            ${financingData.loanTerm} year term at ${financingData.apr}% APR with 
            ${financingData.incentiveType === 'principal' 
              ? 'principal reduction incentive' 
              : 'cashback incentive'}.`}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default FinancingStep;
