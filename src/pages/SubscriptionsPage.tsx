import React, { useState, useMemo } from 'react';
import { useDemoData } from '../contexts/demoDataContext';
import { useAuth } from '../contexts/authContext';
import type { Subscription, User, SubscriptionStatus } from '../types/types';
import subscriptionService from '../services/subscriptionService';

const statusColors: Record<SubscriptionStatus, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-slate-200 text-slate-600',
  canceled: 'bg-red-100 text-red-700',
  trialing: 'bg-blue-100 text-blue-700',
  past_due: 'bg-yellow-100 text-yellow-700'
};

const planOptions = ['basic', 'pro', 'enterprise'];
const statusOptions: SubscriptionStatus[] = [
  'active',
  'inactive',
  'canceled',
  'trialing',
  'past_due'
];

interface SubscriptionFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (sub: Partial<Subscription>) => void;
  initial?: Partial<Subscription>;
  userId: string;
  isEdit?: boolean;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  open,
  onClose,
  onSave,
  initial,
  userId,
  isEdit
}) => {
  const [plan, setPlan] = useState(initial?.plan ?? 'basic');
  const [status, setStatus] = useState<SubscriptionStatus>(initial?.status ?? 'active');
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setPlan(initial?.plan ?? 'basic');
      setStatus(initial?.status ?? 'active');
      setError(null);
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!plan) {
      setError('Plan is required');
      return;
    }
    if (!status) {
      setError('Status is required');
      return;
    }
    onSave({
      plan,
      status,
      userId
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
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Subscription' : 'Add Subscription'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-slate-700 font-medium mb-1" htmlFor="sub-plan">
              Plan
            </label>
            <select
              id="sub-plan"
              className="w-full border border-slate-300 rounded px-3 py-2"
              value={plan}
              onChange={e => setPlan(e.target.value)}
            >
              {planOptions.map(p => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-slate-700 font-medium mb-1" htmlFor="sub-status">
              Status
            </label>
            <select
              id="sub-status"
              className="w-full border border-slate-300 rounded px-3 py-2"
              value={status}
              onChange={e => setStatus(e.target.value as SubscriptionStatus)}
            >
              {statusOptions.map(s => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
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
              {isEdit ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SubscriptionsPage: React.FC = () => {
  const { subscriptions, users, loading, error, addSubscription, updateSubscription, deleteSubscription } = useDemoData();
  const { user: currentUser, isAdmin } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [editSub, setEditSub] = useState<Subscription | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [addUserId, setAddUserId] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<Subscription | null>(null);

  const visibleSubscriptions = useMemo(() => {
    if (isAdmin()) return subscriptions;
    return subscriptions.filter(s => s.userId === currentUser?.id);
  }, [subscriptions, isAdmin, currentUser]);

  const userMap = useMemo(() => {
    const map: Record<string, User> = {};
    users.forEach(u => {
      map[u.id] = u;
    });
    return map;
  }, [users]);

  const handleAdd = () => {
    setEditSub(null);
    setShowForm(true);
    setActionError(null);
    setAddUserId(currentUser?.id ?? '');
  };

  const handleEdit = (sub: Subscription) => {
    setEditSub(sub);
    setShowForm(true);
    setAddUserId(sub.userId);
    setActionError(null);
  };

  const handleDelete = (sub: Subscription) => {
    setDeleteConfirm(sub);
    setActionError(null);
  };

  const handleDeleteConfirmed = () => {
    if (!deleteConfirm) return;
    try {
      const ok = deleteSubscription(deleteConfirm.id);
      if (!ok) {
        setActionError('Failed to delete subscription.');
      }
      setDeleteConfirm(null);
    } catch {
      setActionError('Failed to delete subscription.');
      setDeleteConfirm(null);
    }
  };

  const handleFormSave = (data: Partial<Subscription>) => {
    try {
      if (editSub) {
        updateSubscription(editSub.id, data);
      } else {
        addSubscription(addUserId, data);
      }
      setShowForm(false);
      setEditSub(null);
      setActionError(null);
    } catch {
      setActionError('Failed to save subscription.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg text-slate-600">Loading subscriptions...</div>
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
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition-colors"
          onClick={handleAdd}
        >
          + Add Subscription
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
              <th className="py-3 px-4 text-left font-semibold">User</th>
              <th className="py-3 px-4 text-left font-semibold">Plan</th>
              <th className="py-3 px-4 text-left font-semibold">Status</th>
              <th className="py-3 px-4 text-left font-semibold">Started</th>
              <th className="py-3 px-4 text-left font-semibold">Renewal/Ends</th>
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleSubscriptions.map(sub => {
              const user = userMap[sub.userId];
              return (
                <tr key={sub.id} className="border-t last:border-b-0">
                  <td className="py-2 px-4 flex items-center space-x-2">
                    {user?.avatarUrl && (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-7 h-7 rounded-full border border-slate-200"
                      />
                    )}
                    <span>
                      {user?.name ?? 'Unknown'}
                      {user?.id === currentUser?.id && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5">
                          You
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-2 px-4 capitalize">{sub.plan}</td>
                  <td className="py-2 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[sub.status]}`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {sub.startedAt ? new Date(sub.startedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-2 px-4">
                    {sub.renewalAt
                      ? `Renews: ${new Date(sub.renewalAt).toLocaleDateString()}`
                      : sub.endsAt
                      ? `Ends: ${new Date(sub.endsAt).toLocaleDateString()}`
                      : '-'}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => handleEdit(sub)}
                        disabled={!isAdmin() && user?.id !== currentUser?.id}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline text-sm"
                        onClick={() => handleDelete(sub)}
                        disabled={!isAdmin() && user?.id !== currentUser?.id}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {visibleSubscriptions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-slate-500">
                  No subscriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <SubscriptionForm
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditSub(null);
        }}
        onSave={handleFormSave}
        initial={editSub ?? undefined}
        userId={addUserId}
        isEdit={!!editSub}
      />
      {deleteConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-3">Delete Subscription</h2>
            <p className="mb-4">
              Are you sure you want to delete this subscription for{' '}
              <span className="font-semibold">{userMap[deleteConfirm.userId]?.name ?? 'Unknown User'}</span>?
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

export default SubscriptionsPage;