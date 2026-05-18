import { describe, it, expect, vi } from 'vitest';
import { simulatePayment } from './demoPaymentSimulator';
import type { PaymentStatus } from '../types/types';

describe('simulatePayment', () => {
  it('successfully simulates a completed payment', async () => {
    // Force randomStatus to return 'completed'
    vi.spyOn(Math, 'random').mockImplementationOnce(() => 0.5); // < 0.8 -> 'completed'
    const params = {
      userId: 'user_123',
      amount: 100,
      currency: 'USD',
      method: 'card'
    };
    const result = await simulatePayment(params);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.payment).toBeDefined();
      expect(result.payment.userId).toBe(params.userId);
      expect(result.payment.amount).toBe(params.amount);
      expect(result.payment.currency).toBe(params.currency);
      expect(result.payment.method).toBe(params.method);
      expect(['completed', 'pending', 'refunded', 'failed']).toContain(result.payment.status);
      expect(result.payment.id).toMatch(/^pay_/);
      expect(result.payment.reference).toMatch(/^REF-/);
      expect(result.payment.createdAt).toBeDefined();
      expect(result.payment.updatedAt).toBeDefined();
    }
    vi.restoreAllMocks();
  });

  it('returns error for missing userId', async () => {
    const result = await simulatePayment({
      // @ts-expect-error
      userId: '',
      amount: 100,
      currency: 'USD',
      method: 'card'
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/userId/i);
    }
  });

  it('returns error for invalid amount', async () => {
    const result = await simulatePayment({
      userId: 'user_123',
      amount: 0,
      currency: 'USD',
      method: 'card'
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/amount/i);
    }
  });

  it('returns error for missing currency', async () => {
    const result = await simulatePayment({
      userId: 'user_123',
      amount: 50,
      currency: '',
      method: 'card'
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/currency/i);
    }
  });

  it('returns error for missing method', async () => {
    const result = await simulatePayment({
      userId: 'user_123',
      amount: 50,
      currency: 'USD',
      method: ''
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/payment method/i);
    }
  });

  it('returns error when randomStatus is failed', async () => {
    // Force randomStatus to return 'failed'
    vi.spyOn(Math, 'random').mockImplementationOnce(() => 0.95); // < 0.97 -> 'failed'
    const params = {
      userId: 'user_123',
      amount: 100,
      currency: 'USD',
      method: 'card'
    };
    const result = await simulatePayment(params);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatch(/failed/i);
    }
    vi.restoreAllMocks();
  });

  it('can simulate a refunded payment', async () => {
    // Force randomStatus to return 'refunded'
    vi.spyOn(Math, 'random').mockImplementationOnce(() => 0.99); // >= 0.97 -> 'refunded'
    const params = {
      userId: 'user_123',
      amount: 77.77,
      currency: 'EUR',
      method: 'paypal'
    };
    const result = await simulatePayment(params);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.payment.status).toBe('refunded');
    }
    vi.restoreAllMocks();
  });

  it('rounds amount to two decimals', async () => {
    vi.spyOn(Math, 'random').mockImplementationOnce(() => 0.5); // 'completed'
    const params = {
      userId: 'user_123',
      amount: 12.3456,
      currency: 'USD',
      method: 'card'
    };
    const result = await simulatePayment(params);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.payment.amount).toBeCloseTo(12.35, 2);
    }
    vi.restoreAllMocks();
  });
});