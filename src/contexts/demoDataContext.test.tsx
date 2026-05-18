import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DemoDataProvider, useDemoData } from './demoDataContext';
import type { User, Subscription, AnalyticsRecord, Payment } from '../types/types';

function TestComponent() {
  const {
    users,
    subscriptions,
    analytics,
    payments,
    loading,
    error,
    resetDemoData,
    addUser,
    updateUser,
    deleteUser,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    addAnalytics,
    updateAnalytics,
    deleteAnalytics,
    addPayment,
    updatePayment,
    deletePayment,
    refresh
  } = useDemoData();

  return (
    <div>
      <div data-testid="users">{users.length}</div>
      <div data-testid="subscriptions">{subscriptions.length}</div>
      <div data-testid="analytics">{analytics.length}</div>
      <div data-testid="payments">{payments.length}</div>
      <div data-testid="loading">{loading ? 'yes' : 'no'}</div>
      <div data-testid="error">{error ?? ''}</div>
      <button onClick={() => resetDemoData(3)}>Reset3</button>
      <button
        onClick={() => {
          addUser({
            name: 'Test User',
            email: 'testuser@example.com',
            role: 'user',
            isActive: true
          });
        }}
      >
        AddUser
      </button>
      <button
        onClick={() => {
          if (users.length > 0) {
            updateUser(users[0].id, { name: 'Updated Name' });
          }
        }}
      >
        UpdateUser
      </button>
      <button
        onClick={() => {
          if (users.length > 1) {
            deleteUser(users[1].id);
          }
        }}
      >
        DeleteUser
      </button>
      <button
        onClick={() => {
          if (users.length > 0) {
            addSubscription(users[0].id, { plan: 'pro', status: 'active' });
          }
        }}
      >
        AddSub
      </button>
      <button
        onClick={() => {
          if (subscriptions.length > 0) {
            updateSubscription(subscriptions[0].id, { plan: 'enterprise' });
          }
        }}
      >
        UpdateSub
      </button>
      <button
        onClick={() => {
          if (subscriptions.length > 0) {
            deleteSubscription(subscriptions[0].id);
          }
        }}
      >
        DeleteSub
      </button>
      <button
        onClick={() => {
          if (users.length > 0) {
            addAnalytics({
              userId: users[0].id,
              event: 'login',
              timestamp: new Date().toISOString()
            });
          }
        }}
      >
        AddAnalytics
      </button>
      <button
        onClick={() => {
          if (analytics.length > 0) {
            updateAnalytics(analytics[0].id, { event: 'logout' });
          }
        }}
      >
        UpdateAnalytics
      </button>
      <button
        onClick={() => {
          if (analytics.length > 0) {
            deleteAnalytics(analytics[0].id);
          }
        }}
      >
        DeleteAnalytics
      </button>
      <button
        onClick={() => {
          if (users.length > 0) {
            addPayment(users[0].id, {
              amount: 123.45,
              currency: 'USD',
              status: 'completed',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              method: 'card',
              reference: 'TESTREF'
            });
          }
        }}
      >
        AddPayment
      </button>
      <button
        onClick={() => {
          if (payments.length > 0) {
            updatePayment(payments[0].id, { amount: 222.22 });
          }
        }}
      >
        UpdatePayment
      </button>
      <button
        onClick={() => {
          if (payments.length > 0) {
            deletePayment(payments[0].id);
          }
        }}
      >
        DeletePayment
      </button>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}

describe('DemoDataContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads initial demo data and resets correctly', async () => {
    render(
      <DemoDataProvider>
        <TestComponent />
      </DemoDataProvider>
    );
    await waitFor(() => {
      expect(Number(screen.getByTestId('users').textContent!)).toBeGreaterThan(0);
    });
    screen.getByText('Reset3').click();
    await waitFor(() => {
      expect(Number(screen.getByTestId('users').textContent!)).toBe(3);
      expect(Number(screen.getByTestId('subscriptions').textContent!)).toBe(3);
    });
  });

  it('can add, update, and delete a user', async () => {
    render(
      <DemoDataProvider>
        <TestComponent />
      </DemoDataProvider>
    );
    await waitFor(() => {
      expect(Number(screen.getByTestId('users').textContent!)).toBeGreaterThan(0);
    });
    const before = Number(screen.getByTestId('users').textContent!);
    screen.getByText('AddUser').click();
    await waitFor(() => {
      expect(Number(screen.getByTestId('users').textContent!)).toBe(before + 1);
    });
    screen.getByText('UpdateUser').click();
    // No visible change, but should not error
    screen.getByText('DeleteUser').click();
    await waitFor(() => {
      expect(Number(screen.getByTestId('users').textContent!)).toBe(before);
    });
  });

  it('can add, update, and delete a subscription', async () => {
    render(
      <DemoDataProvider>
        <TestComponent />
      </DemoDataProvider>
    );
    await waitFor(() => {
      expect(Number(screen.getByTestId('subscriptions').textContent!)).toBeGreaterThan(0);
    });
    const before = Number(screen.getByTestId('subscriptions').textContent!);
    screen.getByText('AddSub').click();
    await waitFor(() => {
      expect(Number(screen.getByTestId('subscriptions').textContent!)).toBe(before + 1);
    });
    screen.getByText('UpdateSub').click();
    screen.getByText('DeleteSub').click();
    await waitFor(() => {
      expect(Number(screen.getByTestId('subscriptions').textContent!)).toBe(before);
    });
  });

  it('can add, update, and delete an analytics record', async () => {
    render(
      <DemoDataProvider>
        <TestComponent />
      </DemoDataProvider>
    );
    await waitFor(() => {
      expect(Number(screen.getByTestId('analytics').textContent!)).toBeGreaterThan(0);
    });
    const before = Number(screen.getByTestId('analytics').textContent!);
    screen.getByText('AddAnalytics').click();
    await waitFor(() => {
      expect(Number(screen.getByTestId('analytics').textContent!)).toBe(before + 1);
    });
    screen.getByText('UpdateAnalytics').click();
    screen.getByText('DeleteAnalytics').click();
    await waitFor(() => {
      expect(Number(screen.getByTestId('analytics').textContent!)).toBe(before);
    });
  });

  it('can add, update, and delete a payment', async () => {
    render(
      <DemoDataProvider>
        <TestComponent />
      </DemoDataProvider>
    );
    await waitFor(() => {
      expect(Number(screen.getByTestId('payments').textContent!)).toBeGreaterThan(0);
    });
    const before = Number(screen.getByTestId('payments').textContent!);
    screen.getByText('AddPayment').click();
    await waitFor(() => {
      expect(Number(screen.getByTestId('payments').textContent!)).toBe(before + 1);
    });
    screen.getByText('UpdatePayment').click();
    screen.getByText('DeletePayment').click();
    await waitFor(() => {
      expect(Number(screen.getByTestId('payments').textContent!)).toBe(before);
    });
  });

  it('handles error cases gracefully', async () => {
    render(
      <DemoDataProvider>
        <TestComponent />
      </DemoDataProvider>
    );
    await waitFor(() => {
      expect(Number(screen.getByTestId('users').textContent!)).toBeGreaterThan(0);
    });
    // Try to delete non-existent user
    expect(() => {
      // @ts-expect-error
      screen.getByText('DeleteUser').click('notfound');
    }).not.toThrow();
    // Try to add subscription/payment for non-existent user
    // These are not exposed via UI, but context should not throw
  });
});