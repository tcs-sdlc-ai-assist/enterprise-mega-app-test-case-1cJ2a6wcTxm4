import React, { useState, useEffect } from 'react';
import type { User, Role } from '../types/types';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  initial?: Partial<User>;
  isEdit?: boolean;
}

const roleOptions: Role[] = ['admin', 'manager', 'user', 'guest'];

const UserForm: React.FC<UserFormProps> = ({
  open,
  onClose,
  onSave,
  initial,
  isEdit
}) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [role, setRole] = useState<Role>(initial?.role ?? 'user');
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

export default UserForm;