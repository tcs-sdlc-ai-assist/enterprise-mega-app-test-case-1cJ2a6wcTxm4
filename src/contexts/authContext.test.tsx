import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './authContext';
import userService from '../services/userService';

function TestComponent() {
  const { user, loading, error, login, logout, isAdmin } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.email : 'none'}</div>
      <div data-testid="loading">{loading ? 'yes' : 'no'}</div>
      <div data-testid="error">{error ?? ''}</div>
      <div data-testid="is-admin">{isAdmin() ? 'yes' : 'no'}</div>
      <button onClick={() => login('notfound@example.com')}>Login Invalid</button>
      <button
        onClick={async () => {
          const demoUser = userService.getUsers().find(u => u.role === 'admin');
          if (demoUser) await login(demoUser.email);
        }}
      >
        Login Admin
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('provides null user and not admin by default', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user').textContent).toBe('none');
    expect(screen.getByTestId('is-admin').textContent).toBe('no');
  });

  it('logs in with valid user and sets admin role', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    const demoUser = userService.getUsers().find(u => u.role === 'admin');
    expect(demoUser).toBeDefined();
    screen.getByText('Login Admin').click();
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe(demoUser!.email);
      expect(screen.getByTestId('is-admin').textContent).toBe('yes');
    });
    // Should persist to localStorage
    expect(window.localStorage.getItem('auth_user_id')).toBe(demoUser!.id);
  });

  it('shows error on invalid login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    screen.getByText('Login Invalid').click();
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toMatch(/not found/i);
      expect(screen.getByTestId('user').textContent).toBe('none');
    });
  });

  it('logs out and clears user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    const demoUser = userService.getUsers()[0];
    await waitFor(() => {
      // Login as any user
      screen.getByText('Login Admin').click();
    });
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).not.toBe('none');
    });
    screen.getByText('Logout').click();
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('none');
    });
    expect(window.localStorage.getItem('auth_user_id')).toBeNull();
  });

  it('getCurrentUser returns user after login', async () => {
    let current: string | null = null;
    function CurrentUserTest() {
      const { login, getCurrentUser } = useAuth();
      React.useEffect(() => {
        const demoUser = userService.getUsers()[0];
        login(demoUser.email).then(() => {
          current = getCurrentUser()?.id ?? null;
        });
      }, [login, getCurrentUser]);
      return <div>ok</div>;
    }
    render(
      <AuthProvider>
        <CurrentUserTest />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(current).not.toBeNull();
    });
  });
});