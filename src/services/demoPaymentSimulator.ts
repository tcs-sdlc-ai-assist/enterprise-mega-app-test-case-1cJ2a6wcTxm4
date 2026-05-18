import type { Payment, PaymentStatus } from '../types/types';

type SimulatePaymentParams = {
  userId: string;
  amount: number;
  currency: string;
  method: string;
};

type SimulatePaymentResult =
  | { success: true; payment: Payment }
  | { success: false; error: string };

const PAYMENT_DELAY_MS = 800;

function randomStatus(): PaymentStatus {
  const roll = Math.random();
  if (roll < 0.8) return 'completed';
  if (roll < 0.9) return 'pending';
  if (roll < 0.97) return 'failed';
  return 'refunded';
}

function randomReference(): string {
  return `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

function validateParams(params: SimulatePaymentParams): string | null {
  if (!params.userId) return 'Missing userId';
  if (!params.amount || params.amount <= 0) return 'Invalid amount';
  if (!params.currency) return 'Missing currency';
  if (!params.method) return 'Missing payment method';
  return null;
}

export async function simulatePayment(
  params: SimulatePaymentParams
): Promise<SimulatePaymentResult> {
  const error = validateParams(params);
  if (error) {
    return { success: false, error };
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const status = randomStatus();
      if (status === 'failed') {
        resolve({
          success: false,
          error: 'Payment failed due to insufficient funds or network error.'
        });
        return;
      }
      const now = new Date();
      const payment: Payment = {
        id: `pay_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`,
        userId: params.userId,
        amount: Math.round(params.amount * 100) / 100,
        currency: params.currency,
        status,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        method: params.method,
        reference: randomReference()
      };
      resolve({ success: true, payment });
    }, PAYMENT_DELAY_MS);
  });
}