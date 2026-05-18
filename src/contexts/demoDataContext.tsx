import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, Subscription, AnalyticsRecord, Payment } from '../types/types';
import demoDataStore from '../services/demoDataStore';

interface DemoDataContextValue {
  users: User[];
  subscriptions: Subscription[];
  analytics: AnalyticsRecord[];
  payments: Payment[];
  loading: boolean;
  error: string | null;
  resetDemoData: (userCount?: number) => void;
  updateUser: (id: string, updates: Partial<User>) => User | undefined;
  deleteUser: (id: string) => boolean;
  addUser: (user: Partial<User>) => User;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Subscription | undefined;
  deleteSubscription: (id: string) => boolean;
  addSubscription: (userId: string, sub: Partial<Subscription>) => Subscription | undefined;
  addAnalytics: (record: Partial<AnalyticsRecord>) => AnalyticsRecord;
  updateAnalytics: (id: string, updates: Partial<AnalyticsRecord>) => AnalyticsRecord | undefined;
  deleteAnalytics: (id: string) => boolean;
  addPayment: (userId: string, payment: Partial<Payment>) => Payment | undefined;
  updatePayment: (id: string, updates: Partial<Payment>) => Payment | undefined;
  deletePayment: (id: string) => boolean;
  refresh: () => void;
}

const DemoDataContext = createContext<DemoDataContextValue | null>(null);

export const DemoDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      setUsers(demoDataStore.getUsers());
      setSubscriptions(demoDataStore.getSubscriptions());
      setAnalytics(demoDataStore.getAnalytics());
      setPayments(demoDataStore.getPayments());
    } catch (e) {
      setError('Failed to load demo data');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const refresh = useCallback(() => {
    loadAll();
  }, [loadAll]);

  const resetDemoData = useCallback((userCount?: number) => {
    setLoading(true);
    setError(null);
    try {
      demoDataStore.resetDemoData(userCount ?? 10);
      loadAll();
    } catch {
      setError('Failed to reset demo data');
    }
    setLoading(false);
  }, [loadAll]);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    try {
      const updated = demoDataStore.updateUser(id, updates);
      loadAll();
      return updated;
    } catch {
      setError('Failed to update user');
      return undefined;
    }
  }, [loadAll]);

  const deleteUser = useCallback((id: string) => {
    try {
      const result = demoDataStore.deleteUser(id);
      loadAll();
      return result;
    } catch {
      setError('Failed to delete user');
      return false;
    }
  }, [loadAll]);

  const addUser = useCallback((user: Partial<User>) => {
    try {
      const newUser = demoDataStore.addUser(user);
      loadAll();
      return newUser;
    } catch {
      setError('Failed to add user');
      throw new Error('Failed to add user');
    }
  }, [loadAll]);

  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    try {
      const updated = demoDataStore.updateSubscription(id, updates);
      loadAll();
      return updated;
    } catch {
      setError('Failed to update subscription');
      return undefined;
    }
  }, [loadAll]);

  const deleteSubscription = useCallback((id: string) => {
    try {
      const result = demoDataStore.deleteSubscription(id);
      loadAll();
      return result;
    } catch {
      setError('Failed to delete subscription');
      return false;
    }
  }, [loadAll]);

  const addSubscription = useCallback((userId: string, sub: Partial<Subscription>) => {
    try {
      const newSub = demoDataStore.addSubscription(userId, sub);
      loadAll();
      return newSub;
    } catch {
      setError('Failed to add subscription');
      return undefined;
    }
  }, [loadAll]);

  const addAnalytics = useCallback((record: Partial<AnalyticsRecord>) => {
    try {
      const newRecord = demoDataStore.addAnalytics(record);
      loadAll();
      return newRecord;
    } catch {
      setError('Failed to add analytics record');
      throw new Error('Failed to add analytics record');
    }
  }, [loadAll]);

  const updateAnalytics = useCallback((id: string, updates: Partial<AnalyticsRecord>) => {
    try {
      const updated = demoDataStore.updateAnalytics(id, updates);
      loadAll();
      return updated;
    } catch {
      setError('Failed to update analytics record');
      return undefined;
    }
  }, [loadAll]);

  const deleteAnalytics = useCallback((id: string) => {
    try {
      const result = demoDataStore.deleteAnalytics(id);
      loadAll();
      return result;
    } catch {
      setError('Failed to delete analytics record');
      return false;
    }
  }, [loadAll]);

  const addPayment = useCallback((userId: string, payment: Partial<Payment>) => {
    try {
      const newPayment = demoDataStore.addPayment(userId, payment);
      loadAll();
      return newPayment;
    } catch {
      setError('Failed to add payment');
      return undefined;
    }
  }, [loadAll]);

  const updatePayment = useCallback((id: string, updates: Partial<Payment>) => {
    try {
      const updated = demoDataStore.updatePayment(id, updates);
      loadAll();
      return updated;
    } catch {
      setError('Failed to update payment');
      return undefined;
    }
  }, [loadAll]);

  const deletePayment = useCallback((id: string) => {
    try {
      const result = demoDataStore.deletePayment(id);
      loadAll();
      return result;
    } catch {
      setError('Failed to delete payment');
      return false;
    }
  }, [loadAll]);

  const value: DemoDataContextValue = {
    users,
    subscriptions,
    analytics,
    payments,
    loading,
    error,
    resetDemoData,
    updateUser,
    deleteUser,
    addUser,
    updateSubscription,
    deleteSubscription,
    addSubscription,
    addAnalytics,
    updateAnalytics,
    deleteAnalytics,
    addPayment,
    updatePayment,
    deletePayment,
    refresh
  };

  return (
    <DemoDataContext.Provider value={value}>
      {children}
    </DemoDataContext.Provider>
  );
};

export function useDemoData(): DemoDataContextValue {
  const ctx = useContext(DemoDataContext);
  if (!ctx) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return ctx;
}