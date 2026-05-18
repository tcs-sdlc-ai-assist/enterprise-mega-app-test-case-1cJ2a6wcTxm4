import type { AnalyticsRecord, User, Payment, Subscription } from '../types/types';
import demoDataStore from './demoDataStore';

interface DashboardAnalytics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  trialingSubscriptions: number;
  pastDueSubscriptions: number;
  totalPayments: number;
  totalRevenue: number;
  paymentsCompleted: number;
  paymentsPending: number;
  paymentsFailed: number;
  paymentsRefunded: number;
  events: Record<string, number>;
  usersByRole: Record<string, number>;
}

class AnalyticsService {
  getAnalyticsRecords(): AnalyticsRecord[] {
    return demoDataStore.getAnalytics();
  }

  getAnalyticsById(id: string): AnalyticsRecord | undefined {
    return demoDataStore.getAnalyticsById(id);
  }

  addAnalytics(record: Partial<AnalyticsRecord>): AnalyticsRecord {
    return demoDataStore.addAnalytics(record);
  }

  updateAnalytics(id: string, updates: Partial<AnalyticsRecord>): AnalyticsRecord | undefined {
    return demoDataStore.updateAnalytics(id, updates);
  }

  deleteAnalytics(id: string): boolean {
    return demoDataStore.deleteAnalytics(id);
  }

  computeDashboardAnalytics(): DashboardAnalytics {
    const users = demoDataStore.getUsers();
    const subscriptions = demoDataStore.getSubscriptions();
    const payments = demoDataStore.getPayments();
    const analytics = demoDataStore.getAnalytics();

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;

    const totalSubscriptions = subscriptions.length;
    const activeSubscriptions = subscriptions.filter((s) => s.status === 'active').length;
    const canceledSubscriptions = subscriptions.filter((s) => s.status === 'canceled').length;
    const trialingSubscriptions = subscriptions.filter((s) => s.status === 'trialing').length;
    const pastDueSubscriptions = subscriptions.filter((s) => s.status === 'past_due').length;

    const totalPayments = payments.length;
    const paymentsCompleted = payments.filter((p) => p.status === 'completed').length;
    const paymentsPending = payments.filter((p) => p.status === 'pending').length;
    const paymentsFailed = payments.filter((p) => p.status === 'failed').length;
    const paymentsRefunded = payments.filter((p) => p.status === 'refunded').length;
    const totalRevenue = payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const events: Record<string, number> = {};
    for (const record of analytics) {
      if (!events[record.event]) {
        events[record.event] = 1;
      } else {
        events[record.event]++;
      }
    }

    const usersByRole: Record<string, number> = {};
    for (const user of users) {
      if (!usersByRole[user.role]) {
        usersByRole[user.role] = 1;
      } else {
        usersByRole[user.role]++;
      }
    }

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalSubscriptions,
      activeSubscriptions,
      canceledSubscriptions,
      trialingSubscriptions,
      pastDueSubscriptions,
      totalPayments,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      paymentsCompleted,
      paymentsPending,
      paymentsFailed,
      paymentsRefunded,
      events,
      usersByRole
    };
  }
}

const analyticsService = new AnalyticsService();

export default analyticsService;