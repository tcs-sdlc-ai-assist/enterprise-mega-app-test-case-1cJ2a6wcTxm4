import demoDataStore from './demoDataStore';
import type { User, Subscription, AnalyticsRecord, Payment } from '../types/types';

describe('demoDataStore', () => {
  beforeEach(() => {
    // Always reset to a known state before each test
    demoDataStore.resetDemoData(5);
  });

  it('loads demo data and returns correct initial counts', () => {
    const users = demoDataStore.getUsers();
    const subs = demoDataStore.getSubscriptions();
    const analytics = demoDataStore.getAnalytics();
    const payments = demoDataStore.getPayments();

    expect(users.length).toBe(5);
    expect(subs.length).toBe(5);
    expect(analytics.length).toBeGreaterThanOrEqual(5);
    expect(payments.length).toBeGreaterThanOrEqual(5);
  });

  it('adds, updates, and deletes a user', () => {
    const newUser = demoDataStore.addUser({
      name: 'Test User',
      email: 'testuser@example.com',
      role: 'user',
      isActive: true
    });
    expect(newUser).toBeDefined();
    expect(newUser.name).toBe('Test User');
    expect(demoDataStore.getUsers().find(u => u.id === newUser.id)).toBeDefined();

    const updated = demoDataStore.updateUser(newUser.id, { name: 'Updated User' });
    expect(updated).toBeDefined();
    expect(updated?.name).toBe('Updated User');

    const deleted = demoDataStore.deleteUser(newUser.id);
    expect(deleted).toBe(true);
    expect(demoDataStore.getUsers().find(u => u.id === newUser.id)).toBeUndefined();
  });

  it('adds, updates, and deletes a subscription', () => {
    const user = demoDataStore.getUsers()[0];
    const sub = demoDataStore.addSubscription(user.id, { plan: 'pro', status: 'active' });
    expect(sub).toBeDefined();
    expect(sub?.plan).toBe('pro');

    const updated = demoDataStore.updateSubscription(sub!.id, { plan: 'enterprise' });
    expect(updated).toBeDefined();
    expect(updated?.plan).toBe('enterprise');

    const deleted = demoDataStore.deleteSubscription(sub!.id);
    expect(deleted).toBe(true);
    expect(demoDataStore.getSubscriptionById(sub!.id)).toBeUndefined();
  });

  it('adds, updates, and deletes an analytics record', () => {
    const user = demoDataStore.getUsers()[0];
    const record = demoDataStore.addAnalytics({
      userId: user.id,
      event: 'login',
      timestamp: new Date().toISOString()
    });
    expect(record).toBeDefined();
    expect(record.event).toBe('login');

    const updated = demoDataStore.updateAnalytics(record.id, { event: 'logout' });
    expect(updated).toBeDefined();
    expect(updated?.event).toBe('logout');

    const deleted = demoDataStore.deleteAnalytics(record.id);
    expect(deleted).toBe(true);
    expect(demoDataStore.getAnalyticsById(record.id)).toBeUndefined();
  });

  it('adds, updates, and deletes a payment', () => {
    const user = demoDataStore.getUsers()[0];
    const payment = demoDataStore.addPayment(user.id, {
      amount: 123.45,
      currency: 'USD',
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      method: 'card',
      reference: 'TESTREF'
    });
    expect(payment).toBeDefined();
    expect(payment?.amount).toBe(123.45);

    const updated = demoDataStore.updatePayment(payment!.id, { amount: 222.22 });
    expect(updated).toBeDefined();
    expect(updated?.amount).toBe(222.22);

    const deleted = demoDataStore.deletePayment(payment!.id);
    expect(deleted).toBe(true);
    expect(demoDataStore.getPaymentById(payment!.id)).toBeUndefined();
  });

  it('resetDemoData restores initial state', () => {
    demoDataStore.addUser({
      name: 'Extra User',
      email: 'extra@example.com',
      role: 'guest',
      isActive: false
    });
    expect(demoDataStore.getUsers().length).toBe(6);

    demoDataStore.resetDemoData(4);
    expect(demoDataStore.getUsers().length).toBe(4);
    expect(demoDataStore.getSubscriptions().length).toBe(4);
  });

  it('returns undefined for non-existent entities', () => {
    expect(demoDataStore.getUserById('notfound')).toBeUndefined();
    expect(demoDataStore.getSubscriptionById('notfound')).toBeUndefined();
    expect(demoDataStore.getAnalyticsById('notfound')).toBeUndefined();
    expect(demoDataStore.getPaymentById('notfound')).toBeUndefined();
    expect(demoDataStore.updateUser('notfound', { name: 'x' })).toBeUndefined();
    expect(demoDataStore.updateSubscription('notfound', { plan: 'x' })).toBeUndefined();
    expect(demoDataStore.updateAnalytics('notfound', { event: 'x' })).toBeUndefined();
    expect(demoDataStore.updatePayment('notfound', { amount: 1 })).toBeUndefined();
    expect(demoDataStore.deleteUser('notfound')).toBe(false);
    expect(demoDataStore.deleteSubscription('notfound')).toBe(false);
    expect(demoDataStore.deleteAnalytics('notfound')).toBe(false);
    expect(demoDataStore.deletePayment('notfound')).toBe(false);
  });

  it('does not add subscription or payment for non-existent user', () => {
    expect(demoDataStore.addSubscription('notfound', { plan: 'basic', status: 'active' })).toBeUndefined();
    expect(demoDataStore.addPayment('notfound', {
      amount: 1,
      currency: 'USD',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      method: 'card'
    })).toBeUndefined();
  });
});