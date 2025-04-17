/**
 * Calculates monthly payment using the PMT formula
 * @param principal - The loan amount
 * @param apr - Annual Percentage Rate (as a percentage)
 * @param termYears - Loan term in years
 * @returns Payment calculation including monthly payment, total interest, and total amount
 */
export const calculatePayments = (
  principal: number,
  apr: number,
  termYears: number
): { monthly: number; totalInterest: number; total: number } => {
  const monthlyRate = apr / 1200;
  const payments = termYears * 12;
  const monthly = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -payments));
  const total = monthly * payments;
  const totalInterest = total - principal;

  return {
    monthly,
    totalInterest,
    total
  };
};

/**
 * Validates a credit score range string
 * @param score - Credit score range in format "###-###"
 * @returns boolean indicating if the score is valid
 */
export const isValidCreditScore = (score: string): boolean => {
  if (!/^\d{3}-\d{3}$/.test(score)) return false;
  
  const [min, max] = score.split('-').map(Number);
  return min >= 300 && max <= 850 && min <= max;
};

/**
 * Gets the closest panel price from the price table
 * @param numberOfPanels - Number of panels in the system
 * @param priceTable - Record of panel counts to prices
 * @returns The price for the closest panel count
 */
export const getClosestPanelPrice = (
  numberOfPanels: number,
  priceTable: Record<number, number>
): number => {
  const sizes = Object.keys(priceTable).map(Number);
  const closestSize = sizes.reduce((prev, curr) => 
    Math.abs(curr - numberOfPanels) < Math.abs(prev - numberOfPanels)
      ? curr
      : prev
  );
  return priceTable[closestSize];
};

/**
 * Calculates PPA (Power Purchase Agreement) costs over 25 years
 * @param monthlyConsumption - Monthly energy consumption in kWh
 * @param utilityRate - Current utility rate per kWh
 * @param discountPercentage - Initial discount percentage from utility rate (default: 20%)
 * @param annualEscalator - Annual rate increase percentage (default: 3%)
 * @param annualDegradation - Annual panel degradation percentage (default: 0.5%)
 * @returns Year-by-year and total costs for PPA over 25 years
 */
export const calculatePPACosts = (
  monthlyConsumption: number,
  utilityRate: number,
  discountPercentage: number = 20,
  annualEscalator: number = 3,
  annualDegradation: number = 0.5
): { 
  yearlyData: Array<{
    year: number;
    monthlyPayment: number;
    annualPayment: number;
    kwhProduction: number;
    ratePerKwh: number;
  }>;
  totalCost: number;
} => {
  const annualConsumption = monthlyConsumption * 12;
  const initialPpaRate = utilityRate * (1 - discountPercentage / 100);
  
  let totalCost = 0;
  const yearlyData = Array.from({ length: 25 }, (_, i) => {
    const year = i + 1;
    // Calculate PPA rate with annual escalator
    const ratePerKwh = initialPpaRate * Math.pow(1 + annualEscalator / 100, i);
    
    // Calculate production with annual degradation
    const kwhProduction = annualConsumption * Math.pow(1 - annualDegradation / 100, i);
    
    // Calculate annual and monthly payments
    const annualPayment = kwhProduction * ratePerKwh;
    const monthlyPayment = annualPayment / 12;
    
    totalCost += annualPayment;
    
    return {
      year,
      monthlyPayment,
      annualPayment,
      kwhProduction,
      ratePerKwh
    };
  });
  
  return {
    yearlyData,
    totalCost
  };
};

/**
 * Calculates Solar Lease costs over 25 years
 * @param systemPrice - The price of the solar system
 * @param initialMonthlyPayment - Initial monthly lease payment
 * @param annualEscalator - Annual payment increase percentage (default: 3%)
 * @returns Year-by-year and total costs for lease over 25 years
 */
export const calculateLeaseCosts = (
  systemPrice: number,
  initialMonthlyPayment?: number,
  annualEscalator: number = 3
): { 
  yearlyData: Array<{
    year: number;
    monthlyPayment: number;
    annualPayment: number;
  }>;
  totalCost: number;
} => {
  // If initial monthly payment is not provided, estimate it based on system price
  // Typical lease payments are around 0.7-0.8% of system price per month
  const monthlyPayment = initialMonthlyPayment || systemPrice * 0.0075;
  
  let totalCost = 0;
  const yearlyData = Array.from({ length: 25 }, (_, i) => {
    const year = i + 1;
    // Calculate payment with annual escalator
    const escalatedMonthlyPayment = monthlyPayment * Math.pow(1 + annualEscalator / 100, i);
    const annualPayment = escalatedMonthlyPayment * 12;
    
    totalCost += annualPayment;
    
    return {
      year,
      monthlyPayment: escalatedMonthlyPayment,
      annualPayment
    };
  });
  
  return {
    yearlyData,
    totalCost
  };
};

/**
 * Generates comprehensive comparison data between loan, PPA, and lease financing options
 * @param systemPrice - The price of the solar system
 * @param loanMonthlyPayment - Monthly payment for the loan
 * @param loanTerm - Loan term in years
 * @param monthlyConsumption - Monthly energy consumption in kWh
 * @param utilityRate - Current utility rate per kWh
 * @returns Comparison data for all financing options over 25 years
 */
export const generateFinancingComparison = (
  systemPrice: number,
  loanMonthlyPayment: number,
  loanTerm: number,
  monthlyConsumption: number,
  utilityRate: number
): {
  yearlyComparison: Array<{
    year: number;
    loan: number;
    ppa: number;
    lease: number;
  }>;
  totalComparison: {
    loan: number;
    ppa: number;
    lease: number;
    loanSavingsVsPpa: number;
    loanSavingsVsLease: number;
  };
} => {
  // Calculate PPA costs
  const ppaCosts = calculatePPACosts(monthlyConsumption, utilityRate);
  
  // Calculate Lease costs
  const leaseCosts = calculateLeaseCosts(systemPrice);
  
  // Calculate loan total (monthly payment * term in months)
  const loanTotal = loanMonthlyPayment * loanTerm * 12;
  
  // Generate yearly comparison data
  const yearlyComparison = Array.from({ length: 25 }, (_, i) => {
    const year = i + 1;
    
    // For loan, payment is fixed during loan term, then 0 after
    const loanAnnual = year <= loanTerm ? loanMonthlyPayment * 12 : 0;
    
    // Get PPA and lease data for this year
    const ppaAnnual = ppaCosts.yearlyData[i].annualPayment;
    const leaseAnnual = leaseCosts.yearlyData[i].annualPayment;
    
    return {
      year,
      loan: loanAnnual,
      ppa: ppaAnnual,
      lease: leaseAnnual
    };
  });
  
  // Calculate cumulative costs and savings
  const totalComparison = {
    loan: loanTotal,
    ppa: ppaCosts.totalCost,
    lease: leaseCosts.totalCost,
    loanSavingsVsPpa: ppaCosts.totalCost - loanTotal,
    loanSavingsVsLease: leaseCosts.totalCost - loanTotal
  };
  
  return {
    yearlyComparison,
    totalComparison
  };
};
