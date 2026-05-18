import demoDataStore from './demoDataStore';
import { generateDemoData } from './demoDataFactory';
import type { User, Subscription, AnalyticsRecord, Payment } from '../types/types';

class DemoDataResetService {
  /**
   * Resets all demo data to the initial state.
   * @param userCount Number of users to generate (default: 10)
   * @returns The new demo data shape
   */
  resetAll(userCount: number = 10): {
    users: User[];
    subscriptions: Subscription[];
    analytics: AnalyticsRecord[];
    payments: Payment[];
  } {
    const newData = generateDemoData(userCount);
    demoDataStore.resetDemoData(userCount);
    return newData;
  }
}

const demoDataResetService = new DemoDataResetService();

export default demoDataResetService;