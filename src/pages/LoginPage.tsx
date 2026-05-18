import React, { useState } from 'react';
import { useAuth } from '../contexts/authContext';

const LoginPage: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }
    try {
      await login(email.trim());
    } catch {
      setFormError('Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <form
        className="bg-white p-8 rounded-lg shadow max-w-sm w-full"
        onSubmit={handleSubmit}
        aria-label="Login form"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign in</h2>
        <p className="text-slate-600 text-center mb-6">
          Enter your email to log in as a demo user.
        </p>
        <div className="mb-4">
          <label htmlFor="email" className="block text-slate-700 font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={loading}
            aria-invalid={!!formError || !!error}
            aria-describedby={formError || error ? 'login-error' : undefined}
          />
        </div>
        {(formError || error) && (
          <div
            id="login-error"
            className="mb-4 text-red-600 text-sm"
            role="alert"
          >
            {formError || error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <div className="mt-4 text-slate-500 text-xs text-center">
          (Any valid demo user email will work)
        </div>
      </form>
    </div>
  );
};

export default LoginPage;