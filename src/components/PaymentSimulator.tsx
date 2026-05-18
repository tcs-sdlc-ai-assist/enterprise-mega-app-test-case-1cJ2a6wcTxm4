import React, { useState, useEffect } from 'react';
import type { User } from '../types/types';
import { usePayment } from '../contexts/paymentContext';

interface PaymentSimulatorProps {
  users: User[];
  initialUserId?: string;
  onPaymentComplete?: (paymentId: string) => void;
  className?: string;
  open: boolean;
  onClose: () => void;
}

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

const PaymentSimulator: React.FC<PaymentSimulatorProps> = ({
  users,
  initialUserId,
  onPaymentComplete,
  className = '',
  open,
  onClose
}) => {
  const { simulate, loading, error, payment, reset } = usePayment();

  const [userId, setUserId] = useState(initialUserId ?? (users[0]?.id ?? ''));
  const [amount, setAmount] = useState<number>(50);
  const [currency, setCurrency] = useState('USD');
  const [method, setMethod] = useState('card');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setUserId(initialUserId ?? (users[0]?.id ?? ''));
      setAmount(50);
      setCurrency('USD');
      setMethod('card');
      setFormError(null);
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialUserId, users]);

  const handleSubmit = async (e: React.FormEvent) => {
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
    await simulate({ userId, amount, currency, method });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (payment && onPaymentComplete) {
      onPaymentComplete(payment.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
      <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative ${className}`}>
        <button
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-700"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>
        {!payment ? (
          <>
            <h2 className="text-xl font-bold mb-4">Simulate Payment</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-slate-700 font-medium mb-1" htmlFor="sim-user">
                  User
                </label>
                <select
                  id="sim-user"
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
                <label className="block text-slate-700 font-medium mb-1" htmlFor="sim-amount">
                  Amount
                </label>
                <input
                  id="sim-amount"
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
                <label className="block text-slate-700 font-medium mb-1" htmlFor="sim-currency">
                  Currency
                </label>
                <select
                  id="sim-currency"
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
                <label className="block text-slate-700 font-medium mb-1" htmlFor="sim-method">
                  Payment Method
                </label>
                <select
                  id="sim-method"
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
                  onClick={handleClose}
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
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-3">Payment Simulated</h2>
            <div className="mb-2">
              <span className="font-semibold">Amount:</span> ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Currency:</span> {payment.currency}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Method:</span> {payment.method}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span>{' '}
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[payment.status] ?? 'bg-slate-200 text-slate-600'}`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Reference:</span> {payment.reference ?? '-'}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={handleClose}
              >
                OK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSimulator;