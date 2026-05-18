import React, { useState, useEffect } from 'react';
import type { Subscription, SubscriptionStatus } from '../types/types';

interface SubscriptionFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (sub: Partial<Subscription>) => void;
  initial?: Partial<Subscription>;
  userId: string;
  isEdit?: boolean;
}

const planOptions = ['basic', 'pro', 'enterprise'];
const statusOptions: SubscriptionStatus[] = [
  'active',
  'inactive',
  'canceled',
  'trialing',
  'past_due'
];

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

  useEffect(() => {
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

export default SubscriptionForm;