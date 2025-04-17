export interface Referral {
  id: string;
  name: string;
  email: string;
  phone: string;
  stage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferralStage {
  id: number;
  name: string;
  description: string;
}

export interface ReferralIncentive {
  year1MonthlyReduction: number;
  year2MonthlyReduction: number;
  totalSavings: number;
}