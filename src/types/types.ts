export type Role = 'admin' | 'manager' | 'user' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  subscription?: Subscription;
}

export type SubscriptionStatus = 'active' | 'inactive' | 'canceled' | 'trialing' | 'past_due';

export interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: SubscriptionStatus;
  startedAt: string;
  endsAt?: string;
  canceledAt?: string;
  renewalAt?: string;
}

export interface AnalyticsRecord {
  id: string;
  userId?: string;
  event: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  method: string;
  reference?: string;
}