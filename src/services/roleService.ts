import type { Role, User } from '../types/types';
import demoDataStore from './demoDataStore';

const ALL_ROLES: Role[] = ['admin', 'manager', 'user', 'guest'];

class RoleService {
  getAllRoles(): Role[] {
    return [...ALL_ROLES];
  }

  getUserRole(userId: string): Role | undefined {
    const user = demoDataStore.getUserById(userId);
    return user?.role;
  }

  assignRole(userId: string, role: Role): User | undefined {
    if (!ALL_ROLES.includes(role)) return undefined;
    const user = demoDataStore.getUserById(userId);
    if (!user) return undefined;
    if (user.role === role) return user;
    return demoDataStore.updateUser(userId, { role });
  }

  removeRole(userId: string): User | undefined {
    // "Removing" a role sets to 'guest'
    const user = demoDataStore.getUserById(userId);
    if (!user) return undefined;
    if (user.role === 'guest') return user;
    return demoDataStore.updateUser(userId, { role: 'guest' });
  }

  getUsersByRole(role: Role): User[] {
    return demoDataStore.getUsers().filter((u) => u.role === role);
  }
}

const roleService = new RoleService();

export default roleService;