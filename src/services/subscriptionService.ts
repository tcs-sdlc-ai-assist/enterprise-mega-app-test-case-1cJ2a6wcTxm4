import type { Subscription } from '../types/types';
import demoDataStore from './demoDataStore';

class SubscriptionService {
  getSubscriptions(): Subscription[] {
    return demoDataStore.getSubscriptions();
  }

  getSubscriptionById(id: string): Subscription | undefined {
    return demoDataStore.getSubscriptionById(id);
  }

  addSubscription(userId: string, sub: Partial<Subscription>): Subscription | undefined {
    return demoDataStore.addSubscription(userId, sub);
  }

  updateSubscription(id: string, updates: Partial<Subscription>): Subscription | undefined {
    return demoDataStore.updateSubscription(id, updates);
  }

  deleteSubscription(id: string): boolean {
    return demoDataStore.deleteSubscription(id);
  }
}

const subscriptionService = new SubscriptionService();

export default subscriptionService;