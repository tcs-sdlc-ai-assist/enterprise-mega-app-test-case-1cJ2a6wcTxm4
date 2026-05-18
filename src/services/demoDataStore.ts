import type { User, Subscription, AnalyticsRecord, Payment } from '../types/types';
import {
  generateDemoData,
  generateUser,
  generateSubscription,
  generateAnalyticsRecord,
  generatePayment
} from './demoDataFactory';

const STORAGE_KEY = 'enterprise-mega-app-demo-data';

interface DemoDataStoreShape {
  users: User[];
  subscriptions: Subscription[];
  analytics: AnalyticsRecord[];
  payments: Payment[];
}

class DemoDataStore {
  private data: DemoDataStoreShape;

  constructor() {
    this.data = this.load() || generateDemoData();
    this.save();
  }

  private save(): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // Ignore storage errors (quota, etc.)
    }
  }

  private load(): DemoDataStoreShape | null {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        Array.isArray(parsed.users) &&
        Array.isArray(parsed.subscriptions) &&
        Array.isArray(parsed.analytics) &&
        Array.isArray(parsed.payments)
      ) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  // USERS
  getUsers(): User[] {
    return [...this.data.users];
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  addUser(user: Partial<User>): User {
    const newUser = generateUser(user);
    this.data.users.push(newUser);
    // Add default subscription for new user
    const sub = generateSubscription(newUser.id, { status: newUser.isActive ? 'active' : 'inactive' });
    this.data.subscriptions.push(sub);
    newUser.subscription = sub;
    this.save();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    const updated = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.data.users[idx] = updated;
    this.save();
    return updated;
  }

  deleteUser(id: string): boolean {
    const userIdx = this.data.users.findIndex((u) => u.id === id);
    if (userIdx === -1) return false;
    this.data.users.splice(userIdx, 1);
    // Remove related subscriptions, analytics, payments
    this.data.subscriptions = this.data.subscriptions.filter((s) => s.userId !== id);
    this.data.analytics = this.data.analytics.filter((a) => a.userId !== id);
    this.data.payments = this.data.payments.filter((p) => p.userId !== id);
    this.save();
    return true;
  }

  // SUBSCRIPTIONS
  getSubscriptions(): Subscription[] {
    return [...this.data.subscriptions];
  }

  getSubscriptionById(id: string): Subscription | undefined {
    return this.data.subscriptions.find((s) => s.id === id);
  }

  addSubscription(userId: string, sub: Partial<Subscription>): Subscription | undefined {
    if (!this.getUserById(userId)) return undefined;
    const newSub = generateSubscription(userId, sub);
    this.data.subscriptions.push(newSub);
    this.save();
    return newSub;
  }

  updateSubscription(id: string, updates: Partial<Subscription>): Subscription | undefined {
    const idx = this.data.subscriptions.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    const updated = { ...this.data.subscriptions[idx], ...updates };
    this.data.subscriptions[idx] = updated;
    this.save();
    return updated;
  }

  deleteSubscription(id: string): boolean {
    const idx = this.data.subscriptions.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.data.subscriptions.splice(idx, 1);
    this.save();
    return true;
  }

  // ANALYTICS
  getAnalytics(): AnalyticsRecord[] {
    return [...this.data.analytics];
  }

  getAnalyticsById(id: string): AnalyticsRecord | undefined {
    return this.data.analytics.find((a) => a.id === id);
  }

  addAnalytics(record: Partial<AnalyticsRecord>): AnalyticsRecord {
    const newRecord = generateAnalyticsRecord(record.userId, record);
    this.data.analytics.push(newRecord);
    this.save();
    return newRecord;
  }

  updateAnalytics(id: string, updates: Partial<AnalyticsRecord>): AnalyticsRecord | undefined {
    const idx = this.data.analytics.findIndex((a) => a.id === id);
    if (idx === -1) return undefined;
    const updated = { ...this.data.analytics[idx], ...updates };
    this.data.analytics[idx] = updated;
    this.save();
    return updated;
  }

  deleteAnalytics(id: string): boolean {
    const idx = this.data.analytics.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.data.analytics.splice(idx, 1);
    this.save();
    return true;
  }

  // PAYMENTS
  getPayments(): Payment[] {
    return [...this.data.payments];
  }

  getPaymentById(id: string): Payment | undefined {
    return this.data.payments.find((p) => p.id === id);
  }

  addPayment(userId: string, payment: Partial<Payment>): Payment | undefined {
    if (!this.getUserById(userId)) return undefined;
    const newPayment = generatePayment(userId, payment);
    this.data.payments.push(newPayment);
    this.save();
    return newPayment;
  }

  updatePayment(id: string, updates: Partial<Payment>): Payment | undefined {
    const idx = this.data.payments.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    const updated = { ...this.data.payments[idx], ...updates, updatedAt: new Date().toISOString() };
    this.data.payments[idx] = updated;
    this.save();
    return updated;
  }

  deletePayment(id: string): boolean {
    const idx = this.data.payments.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.data.payments.splice(idx, 1);
    this.save();
    return true;
  }

  // RESET
  resetDemoData(userCount = 10): void {
    this.data = generateDemoData(userCount);
    this.save();
  }
}

const demoDataStore = new DemoDataStore();

export default demoDataStore;