import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PaymentProvider, usePayment } from './paymentContext';
import * as demoPaymentSimulator from '../services/demoPaymentSimulator';

function TestComponent() {
  const { loading, error, payment, simulate, reset } = usePayment();
  return (
    <div>
      <div data-testid="loading">{loading ? 'yes' : 'no'}</div>
      <div data-testid="error">{error ?? ''}</div>
      <div data-testid="payment">{payment ? payment.id : 'none'}</div>
      <button
        onClick={async () => {
          await simulate({
            userId: 'user_1',
            amount: 42.5,
            currency: 'USD',
            method: 'card'
          });
        }}
      >
        SimulateSuccess
      </button>
      <button
        onClick={async () => {
          await simulate({
            userId: '',
            amount: 0,
            currency: '',
            method: ''
          });
        }}
      >
        SimulateError
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

describe('PaymentContext', () => {
  beforeEach(() => {
    jest.restoreAllMocks?.();
    window.localStorage.clear();
  });

  it('simulates a successful payment and sets payment', async () => {
    const mockSim = jest
      .spyOn(demoPaymentSimulator, 'simulatePayment')
      .mockResolvedValueOnce({
        success: true,
        payment: {
          id: 'pay_test',
          userId: 'user_1',
          amount: 42.5,
          currency: 'USD',
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          method: 'card',
          reference: 'REF-TEST'
        }
      });
    render(
      <PaymentProvider>
        <TestComponent />
      </PaymentProvider>
    );
    expect(screen.getByTestId('loading').textContent).toBe('no');
    screen.getByText('SimulateSuccess').click();
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('no');
      expect(screen.getByTestId('payment').textContent).toBe('pay_test');
      expect(screen.getByTestId('error').textContent).toBe('');
    });
    expect(mockSim).toHaveBeenCalled();
  });

  it('handles payment simulation error and sets error', async () => {
    const mockSim = jest
      .spyOn(demoPaymentSimulator, 'simulatePayment')
      .mockResolvedValueOnce({
        success: false,
        error: 'Invalid amount'
      });
    render(
      <PaymentProvider>
        <TestComponent />
      </PaymentProvider>
    );
    screen.getByText('SimulateError').click();
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('no');
      expect(screen.getByTestId('payment').textContent).toBe('none');
      expect(screen.getByTestId('error').textContent).toMatch(/invalid amount/i);
    });
    expect(mockSim).toHaveBeenCalled();
  });

  it('reset clears payment and error', async () => {
    const mockSim = jest
      .spyOn(demoPaymentSimulator, 'simulatePayment')
      .mockResolvedValueOnce({
        success: true,
        payment: {
          id: 'pay_test2',
          userId: 'user_2',
          amount: 100,
          currency: 'USD',
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          method: 'card',
          reference: 'REF-TEST2'
        }
      });
    render(
      <PaymentProvider>
        <TestComponent />
      </PaymentProvider>
    );
    screen.getByText('SimulateSuccess').click();
    await waitFor(() => {
      expect(screen.getByTestId('payment').textContent).toBe('pay_test2');
    });
    screen.getByText('Reset').click();
    await waitFor(() => {
      expect(screen.getByTestId('payment').textContent).toBe('none');
      expect(screen.getByTestId('error').textContent).toBe('');
    });
    expect(mockSim).toHaveBeenCalled();
  });

  it('handles unexpected error in simulate', async () => {
    const mockSim = jest
      .spyOn(demoPaymentSimulator, 'simulatePayment')
      .mockImplementationOnce(() => {
        throw new Error('Unexpected');
      });
    render(
      <PaymentProvider>
        <TestComponent />
      </PaymentProvider>
    );
    screen.getByText('SimulateSuccess').click();
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('no');
      expect(screen.getByTestId('payment').textContent).toBe('none');
      expect(screen.getByTestId('error').textContent).toMatch(/unexpected/i);
    });
    expect(mockSim).toHaveBeenCalled();
  });
});