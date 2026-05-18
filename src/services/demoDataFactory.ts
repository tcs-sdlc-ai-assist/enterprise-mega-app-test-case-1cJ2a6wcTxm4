import type {
  User,
  Subscription,
  AnalyticsRecord,
  Payment,
  Role,
  SubscriptionStatus,
  PaymentStatus
} from '../types/types';

function randomId(prefix: string = ''): string {
  return (
    prefix +
    Math.random().toString(36).substring(2, 10) +
    Date.now().toString(36)
  );
}

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateWithinLastYear(): string {
  const now = Date.now();
  const past = now - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000);
  return new Date(past).toISOString();
}

function randomBool(trueRatio = 0.7): boolean {
  return Math.random() < trueRatio;
}

function randomAmount(min = 10, max = 500): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

const roles: Role[] = ['admin', 'manager', 'user', 'guest'];
const subscriptionStatuses: SubscriptionStatus[] = [
  'active',
  'inactive',
  'canceled',
  'trialing',
  'past_due'
];
const paymentStatuses: PaymentStatus[] = [
  'pending',
  'completed',
  'failed',
  'refunded'
];
const plans = ['basic', 'pro', 'enterprise'];
const currencies = ['USD', 'EUR', 'GBP', 'JPY'];
const paymentMethods = ['card', 'paypal', 'bank_transfer'];

const avatarBase = 'https://api.dicebear.com/7.x/identicon/svg?seed=';

function generateUser(overrides?: Partial<User>): User {
  const id = randomId('user_');
  const name = `Demo User ${id.slice(-4)}`;
  const email = `${id}@demo.com`;
  const role = randomFromArray(roles);
  const createdAt = randomDateWithinLastYear();
  const updatedAt = new Date().toISOString();
  const isActive = randomBool();
  const avatarUrl = `${avatarBase}${id}`;
  return {
    id,
    name,
    email,
    role,
    avatarUrl,
    createdAt,
    updatedAt,
    isActive,
    ...overrides
  };
}

function generateSubscription(userId: string, overrides?: Partial<Subscription>): Subscription {
  const id = randomId('sub_');
  const plan = randomFromArray(plans);
  const status = randomFromArray(subscriptionStatuses);
  const startedAt = randomDateWithinLastYear();
  let endsAt: string | undefined;
  let canceledAt: string | undefined;
  let renewalAt: string | undefined;
  if (status === 'canceled') {
    canceledAt = new Date().toISOString();
    endsAt = canceledAt;
  } else if (status === 'active' || status === 'trialing' || status === 'past_due') {
    renewalAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  }
  return {
    id,
    userId,
    plan,
    status,
    startedAt,
    endsAt,
    canceledAt,
    renewalAt,
    ...overrides
  };
}

function generateAnalyticsRecord(userId?: string, overrides?: Partial<AnalyticsRecord>): AnalyticsRecord {
  const id = randomId('anl_');
  const events = ['login', 'logout', 'payment', 'subscription_update', 'page_view', 'error'];
  const event = randomFromArray(events);
  const timestamp = randomDateWithinLastYear();
  const metadata = { detail: `Demo event for ${event}` };
  return {
    id,
    userId,
    event,
    timestamp,
    metadata,
    ...overrides
  };
}

function generatePayment(userId: string, overrides?: Partial<Payment>): Payment {
  const id = randomId('pay_');
  const amount = randomAmount();
  const currency = randomFromArray(currencies);
  const status = randomFromArray(paymentStatuses);
  const createdAt = randomDateWithinLastYear();
  const updatedAt = new Date().toISOString();
  const method = randomFromArray(paymentMethods);
  const reference = `REF-${randomId().slice(-8).toUpperCase()}`;
  return {
    id,
    userId,
    amount,
    currency,
    status,
    createdAt,
    updatedAt,
    method,
    reference,
    ...overrides
  };
}

export function generateDemoUsers(count = 10): User[] {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push(generateUser());
  }
  return users;
}

export function generateDemoSubscriptions(users: User[]): Subscription[] {
  return users.map((user) =>
    generateSubscription(user.id, {
      status: user.isActive ? 'active' : 'inactive'
    })
  );
}

export function generateDemoAnalytics(users: User[], countPerUser = 5): AnalyticsRecord[] {
  const records: AnalyticsRecord[] = [];
  users.forEach((user) => {
    for (let i = 0; i < countPerUser; i++) {
      records.push(generateAnalyticsRecord(user.id));
    }
  });
  return records;
}

export function generateDemoPayments(users: User[], countPerUser = 2): Payment[] {
  const payments: Payment[] = [];
  users.forEach((user) => {
    for (let i = 0; i < countPerUser; i++) {
      payments.push(generatePayment(user.id));
    }
  });
  return payments;
}

export function generateDemoData(userCount = 10): {
  users: User[];
  subscriptions: Subscription[];
  analytics: AnalyticsRecord[];
  payments: Payment[];
} {
  const users = generateDemoUsers(userCount);
  const subscriptions = generateDemoSubscriptions(users);
  const analytics = generateDemoAnalytics(users);
  const payments = generateDemoPayments(users);
  // Attach subscriptions to users
  users.forEach((user, idx) => {
    user.subscription = subscriptions[idx];
  });
  return {
    users,
    subscriptions,
    analytics,
    payments
  };
}