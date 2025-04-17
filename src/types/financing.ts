import { z } from 'zod';

export const FinancingSchema = z.object({
  institution: z.enum(['CARFW', 'SABS']),
  approval: z.enum(['approved', 'denied', '']),
  loanTerm: z.number().min(5).max(25),
  apr: z.number().min(0).max(20).multipleOf(0.125),
  creditScore: z.string().regex(/^\d{3}-\d{3}$/),
  ssnLast4: z.string().regex(/^\d{4}$/),
  principal: z.number().positive(),
  monthly: z.number().nonnegative(),
  totalInterest: z.number().nonnegative(),
  total: z.number().positive()
});

export type FinancingData = z.infer<typeof FinancingSchema>;

export interface PaymentCalculation {
  monthly: number;
  totalInterest: number;
  total: number;
}