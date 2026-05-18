import React, { useState, useMemo } from 'react';
import { useDemoData } from '../contexts/demoDataContext';
import { usePayment } from '../contexts/paymentContext';
import { useAuth } from '../contexts/authContext';
import type { User, Payment } from '../types/types';

const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY'];
const methodOptions = [
  { value: 'card', label: 'Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' }
];

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-indigo-100 text-indigo-700'
};

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (params: {
    userId: string;
    amount: number;
    currency: string;
    method: string;
  }) => void;
  loading: boolean;
  error: string | null;
  users: User[];
  initialUserId?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  users,
  initialUserId
}) => {
  const [userId, setUserId] = useState(initialUserId ?? (users[0]?.id ?? ''));
  const [amount, setAmount] = useState<number>(50);
  const [currency, setCurrency] = useState('USD');
  const [method, setMethod] = useState('card');
  const [formError, setFormError] = useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setUserId(initialUserId ?? (users[0]?.id ?? ''));
      setAmount(50);
      setCurrency('USD');
      setMethod('card');
      setFormError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialUserId, users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!userId) {
      setFormError('User is required');
      return;
    }
    if (!amount || amount <= 0) {
      setFormError('Amount must be greater than 0');
      return;
    }
    if (!currency) {
      setFormError('Currency is required');
      return;
    }
    if (!method) {
      setFormError('Payment method is required');
      return;
    }
    onSubmit({ userId, amount, currency, method });
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
        <h2 className="text-xl font-bold mb-4">Simulate Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-slate-700 font-medium mb-1" htmlFor="pay-user">
              User
            </label>
            <select
              id="pay-user"
              className="w-full border border-slate-300 rounded px-3 py-2"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              disabled={loading}
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-slate-700 font-medium mb-1" htmlFor="pay-amount">
              Amount
            </label>
            <input
              id="pay-amount"
              type="number"
              min={1}
              step={0.01}
              className="w-full border border-slate-300 rounded px-3 py-2"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              disabled={loading}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-slate-700 font-medium mb-1" htmlFor="pay-currency">
              Currency
            </label>
            <select
              id="pay-currency"
              className="w-full border border-slate-300 rounded px-3 py-2"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              disabled={loading}
            >
              {currencyOptions.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-slate-700 font-medium mb-1" htmlFor="pay-method">
              Payment Method
            </label>
            <select
              id="pay-method"
              className="w-full border border-slate-300 rounded px-3 py-2"
              value={method}
              onChange={e => setMethod(e.target.value)}
              disabled={loading}
            >
              {methodOptions.map(m => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          {(formError || error) && (
            <div className="mb-3 text-red-600 text-sm" role="alert">
              {formError || error}
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Simulating...' : 'Simulate Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PaymentsPage: React.FC = () => {
  const { payments, users, loading: demoLoading, error: demoError, addPayment } = useDemoData();
  const { user: currentUser, isAdmin } = useAuth();
  const { simulate, loading: simLoading, error: simError, payment: simPayment, reset } = usePayment();

  const [showForm, setShowForm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const visiblePayments = useMemo(() => {
    if (isAdmin()) return payments;
    return payments.filter(p => p.userId === currentUser?.id);
  }, [payments, isAdmin, currentUser]);

  const userMap = useMemo(() => {
    const map: Record<string, User> = {};
    users.forEach(u => {
      map[u.id] = u;
    });
    return map;
  }, [users]);

  const handleSimulate = async (params: { userId: string; amount: number; currency: string; method: string }) => {
    setActionError(null);
    try {
      const result = await simulate(params);
      if (result) {
        addPayment(params.userId, result);
      }
    } catch {
      setActionError('Failed to simulate payment.');
    }
  };

  const handleOpenForm = () => {
    setShowForm(true);
    setActionError(null);
    reset();
  };

  if (demoLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg text-slate-600">Loading payments...</div>
      </div>
    );
  }

  if (demoError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 text-lg font-semibold">Error: {demoError}</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Payments</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition-colors"
          onClick={handleOpenForm}
        >
          + Simulate Payment
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
              <th className="py-3 px-4 text-left font-semibold">Amount</th>
              <th className="py-3 px-4 text-left font-semibold">Currency</th>
              <th className="py-3 px-4 text-left font-semibold">Method</th>
              <th className="py-3 px-4 text-left font-semibold">Status</th>
              <th className="py-3 px-4 text-left font-semibold">Created</th>
              <th className="py-3 px-4 text-left font-semibold">Reference</th>
            </tr>
          </thead>
          <tbody>
            {visiblePayments.map(p => {
              const user = userMap[p.userId];
              return (
                <tr key={p.id} className="border-t last:border-b-0">
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
                  <td className="py-2 px-4 font-mono">${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 px-4">{p.currency}</td>
                  <td className="py-2 px-4 capitalize">{p.method.replace('_', ' ')}</td>
                  <td className="py-2 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[p.status] ?? 'bg-slate-200 text-slate-600'}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-2 px-4 font-mono text-xs">{p.reference ?? '-'}</td>
                </tr>
              );
            })}
            {visiblePayments.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaymentForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSimulate}
        loading={simLoading}
        error={simError}
        users={isAdmin() ? users : users.filter(u => u.id === currentUser?.id)}
        initialUserId={currentUser?.id}
      />
      {simPayment && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-3">Payment Simulated</h2>
            <div className="mb-2">
              <span className="font-semibold">Amount:</span> ${simPayment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Currency:</span> {simPayment.currency}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Method:</span> {simPayment.method}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span>{' '}
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[simPayment.status] ?? 'bg-slate-200 text-slate-600'}`}>
                {simPayment.status.charAt(0).toUpperCase() + simPayment.status.slice(1)}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Reference:</span> {simPayment.reference ?? '-'}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={reset}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;