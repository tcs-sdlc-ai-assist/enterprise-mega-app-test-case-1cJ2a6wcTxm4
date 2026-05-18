import React, { useState } from 'react';
import { useDemoData } from '../contexts/demoDataContext';

interface ResetDemoDataButtonProps {
  className?: string;
  label?: string;
}

const ResetDemoDataButton: React.FC<ResetDemoDataButtonProps> = ({
  className = '',
  label = 'Reset Demo Data'
}) => {
  const { resetDemoData, loading } = useDemoData();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userCount, setUserCount] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setError(null);
    try {
      resetDemoData(userCount);
      setConfirmOpen(false);
    } catch {
      setError('Failed to reset demo data.');
    }
  };

  return (
    <>
      <button
        type="button"
        className={`px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors ${className}`}
        onClick={() => setConfirmOpen(true)}
        disabled={loading}
      >
        {loading ? 'Resetting...' : label}
      </button>
      {confirmOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-3">Reset Demo Data</h2>
            <p className="mb-4">
              This will erase all current demo data and restore the initial state.
              <br />
              <span className="font-semibold text-red-600">This cannot be undone.</span>
            </p>
            <div className="mb-4">
              <label htmlFor="reset-user-count" className="block text-slate-700 font-medium mb-1">
                Number of demo users
              </label>
              <input
                id="reset-user-count"
                type="number"
                min={1}
                max={100}
                className="w-full border border-slate-300 rounded px-3 py-2"
                value={userCount}
                onChange={e => setUserCount(Number(e.target.value))}
                disabled={loading}
              />
            </div>
            {error && (
              <div className="mb-3 text-red-600 text-sm" role="alert">
                {error}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium"
                onClick={() => setConfirmOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                onClick={handleReset}
                disabled={loading || userCount < 1}
              >
                {loading ? 'Resetting...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetDemoDataButton;