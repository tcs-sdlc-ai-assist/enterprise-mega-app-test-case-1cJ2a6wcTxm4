import React, { useState, useMemo } from 'react';
import { useDemoData } from '../contexts/demoDataContext';
import { useAuth } from '../contexts/authContext';
import type { User, Role } from '../types/types';
import roleService from '../services/roleService';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  initial?: Partial<User>;
  isEdit?: boolean;
}

const roleOptions: Role[] = ['admin', 'manager', 'user', 'guest'];

const UserForm: React.FC<UserFormProps> = ({ open, onClose, onSave, initial, isEdit }) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [role, setRole] = useState<Role>(initial?.role ?? 'user');
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setEmail(initial?.email ?? '');
      setRole(initial?.role ?? 'user');
      setIsActive(initial?.isActive ?? true);
      setError(null);
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(email.trim())) {
      setError('Valid email is required');
      return;
    }
    onSave({
      name: name.trim(),
      email: email.trim(),
      role,
      isActive
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-700"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-slate-700 font-medium mb-1" htmlFor="user-name">
              Name
            </label>
            <input
              id="user-name"
              type="text"
              className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="block text-slate-700 font-medium mb-1" htmlFor="user-email">
              Email
            </label>
            <input
              id="user-email"
              type="email"
              className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isEdit}
            />
          </div>
          <div className="mb-3">
            <label className="block text-slate-700 font-medium mb-1" htmlFor="user-role">
              Role
            </label>
            <select
              id="user-role"
              className="w-full border border-slate-300 rounded px-3 py-2"
              value={role}
              onChange={e => setRole(e.target.value as Role)}
            >
              {roleOptions.map(r => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3 flex items-center">
            <input
              id="user-active"
              type="checkbox"
              className="mr-2"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
            />
            <label htmlFor="user-active" className="text-slate-700">
              Active
            </label>
          </div>
          {error && (
            <div className="mb-3 text-red-600 text-sm" role="alert">
              {error}
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {isEdit ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UsersPage: React.FC = () => {
  const { users, loading, error, addUser, updateUser, deleteUser, refresh } = useDemoData();
  const { user: currentUser } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);

  const sortedUsers = useMemo(
    () =>
      [...users].sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  );

  const handleAdd = () => {
    setEditUser(null);
    setShowForm(true);
    setActionError(null);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setShowForm(true);
    setActionError(null);
  };

  const handleDelete = (user: User) => {
    setDeleteConfirm(user);
    setActionError(null);
  };

  const handleDeleteConfirmed = () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.id === currentUser?.id) {
        setActionError('You cannot delete your own account.');
        setDeleteConfirm(null);
        return;
      }
      const ok = deleteUser(deleteConfirm.id);
      if (!ok) {
        setActionError('Failed to delete user.');
      }
      setDeleteConfirm(null);
    } catch {
      setActionError('Failed to delete user.');
      setDeleteConfirm(null);
    }
  };

  const handleFormSave = (data: Partial<User>) => {
    try {
      if (editUser) {
        updateUser(editUser.id, data);
      } else {
        addUser(data);
      }
      setShowForm(false);
      setEditUser(null);
      setActionError(null);
    } catch {
      setActionError('Failed to save user.');
    }
  };

  const handleRoleChange = (user: User, newRole: Role) => {
    try {
      roleService.assignRole(user.id, newRole);
      refresh();
    } catch {
      setActionError('Failed to change role.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg text-slate-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg font-semibold">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition-colors"
          onClick={handleAdd}
        >
          + Add User
        </button>
      </div>
      {actionError && (
        <div className="mb-4 text-red-600 font-medium" role="alert">
          {actionError}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-slate-100">
              <th className="py-3 px-4 text-left font-semibold">Name</th>
              <th className="py-3 px-4 text-left font-semibold">Email</th>
              <th className="py-3 px-4 text-left font-semibold">Role</th>
              <th className="py-3 px-4 text-left font-semibold">Status</th>
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(u => (
              <tr key={u.id} className="border-t last:border-b-0">
                <td className="py-2 px-4 flex items-center space-x-2">
                  {u.avatarUrl && (
                    <img
                      src={u.avatarUrl}
                      alt={u.name}
                      className="w-7 h-7 rounded-full border border-slate-200"
                    />
                  )}
                  <span>{u.name}</span>
                  {u.id === currentUser?.id && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5">
                      You
                    </span>
                  )}
                </td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4">
                  <select
                    className="border border-slate-300 rounded px-2 py-1 text-sm"
                    value={u.role}
                    onChange={e => handleRoleChange(u, e.target.value as Role)}
                    disabled={u.id === currentUser?.id}
                  >
                    {roleOptions.map(r => (
                      <option key={r} value={r}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4">
                  {u.isActive ? (
                    <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium">
                      Active
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-xs font-medium">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:underline text-sm"
                      onClick={() => handleEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline text-sm"
                      onClick={() => handleDelete(u)}
                      disabled={u.id === currentUser?.id}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {sortedUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <UserForm
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditUser(null);
        }}
        onSave={handleFormSave}
        initial={editUser ?? undefined}
        isEdit={!!editUser}
      />
      {deleteConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-3">Delete User</h2>
            <p className="mb-4">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{deleteConfirm.name}</span>?
              <br />
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                onClick={handleDeleteConfirmed}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;