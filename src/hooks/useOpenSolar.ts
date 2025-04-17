import { useState, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import * as opensolarApi from '../services/opensolar';
import type { SystemCalculation, ApiError, SystemCreationData, SystemResponse } from '../types/api';

export const useOpenSolar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { isAuthenticated } = useAuthStore();

  const createSolarSystem = useCallback(async (calculation: {
    monthlyConsumption: number;
    annualConsumption: number;
    numberOfPanels: number;
    panelCapacity: number;
    totalAdjustedProduction: number;
  }): Promise<SystemResponse | null> => {
    if (!isAuthenticated) {
      setError({
        message: 'Authentication required',
        code: 'AUTH_REQUIRED',
        status: 401,
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Clean calculation data
      const cleanCalculation = JSON.parse(JSON.stringify({
        monthlyConsumption: calculation.monthlyConsumption,
        numberOfPanels: calculation.numberOfPanels,
        panelCapacity: calculation.panelCapacity,
        dailyProduction: calculation.totalAdjustedProduction * 24
      }));

      const result = await opensolarApi.createSolarSystem(cleanCalculation);
      return result ? JSON.parse(JSON.stringify(result)) : null;
    } catch (error) {
      const apiError = error as Error;
      setError({
        message: apiError.message || 'Failed to create system',
        code: 'CREATION_ERROR',
        status: 500,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return {
    createSolarSystem,
    loading,
    error,
  };
};