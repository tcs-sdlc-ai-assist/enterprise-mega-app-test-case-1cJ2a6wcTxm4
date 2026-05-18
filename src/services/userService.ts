import type { User } from '../types/types';
import demoDataStore from './demoDataStore';

class UserService {
  getUsers(): User[] {
    return demoDataStore.getUsers();
  }

  getUserById(id: string): User | undefined {
    return demoDataStore.getUserById(id);
  }

  addUser(user: Partial<User>): User {
    return demoDataStore.addUser(user);
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    return demoDataStore.updateUser(id, updates);
  }

  deleteUser(id: string): boolean {
    return demoDataStore.deleteUser(id);
  }
}

const userService = new UserService();

export default userService;