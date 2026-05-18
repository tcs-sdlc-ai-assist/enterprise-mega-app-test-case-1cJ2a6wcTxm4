import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Payment } from '../types/types';
import { simulatePayment } from '../services/demoPaymentSimulator';

interface SimulatePaymentParams {
  userId: string;
  amount: number;
  currency: string;
  method: string;
}

interface PaymentContextValue {
  loading: boolean;
  error: string | null;
  payment: Payment | null;
  simulate: (params: SimulatePaymentParams) => Promise<Payment | null>;
  reset: () => void;
}

const PaymentContext = createContext<PaymentContextValue | null>(null);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);

  const simulate = useCallback(async (params: SimulatePaymentParams): Promise<Payment | null> => {
    setLoading(true);
    setError(null);
    setPayment(null);
    try {
      const result = await simulatePayment(params);
      if (result.success) {
        setPayment(result.payment);
        setLoading(false);
        return result.payment;
      } else {
        setError(result.error);
        setLoading(false);
        return null;
      }
    } catch (e) {
      setError('Unexpected error during payment simulation');
      setLoading(false);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setPayment(null);
  }, []);

  const value: PaymentContextValue = {
    loading,
    error,
    payment,
    simulate,
    reset
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

export function usePayment(): PaymentContextValue {
  const ctx = useContext(PaymentContext);
  if (!ctx) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return ctx;
}