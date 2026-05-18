import React from 'react';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  label?: string;
  protected?: boolean;
  adminOnly?: boolean;
  children?: RouteConfig[];
}

const LoginScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="bg-white p-8 rounded shadow max-w-sm w-full">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      <p className="text-slate-600 text-center mb-2">
        (Implement login form here)
      </p>
    </div>
  </div>
);

const DashboardScreen: React.FC = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
    <p className="text-slate-700">Welcome to your dashboard.</p>
  </div>
);

const UsersScreen: React.FC = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4">Users</h2>
    <p className="text-slate-700">Manage users here.</p>
  </div>
);

const SubscriptionsScreen: React.FC = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>
    <p className="text-slate-700">View and manage subscriptions.</p>
  </div>
);

const PaymentsScreen: React.FC = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4">Payments</h2>
    <p className="text-slate-700">View and manage payments.</p>
  </div>
);

const AnalyticsScreen: React.FC = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4">Analytics</h2>
    <p className="text-slate-700">Analytics dashboard goes here.</p>
  </div>
);

const NotFoundScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h2 className="text-3xl font-bold mb-2">404</h2>
    <p className="text-slate-600">Page not found.</p>
  </div>
);

export const routes: RouteConfig[] = [
  {
    path: '/login',
    element: <LoginScreen />,
    label: 'Login'
  },
  {
    path: '/',
    element: <DashboardScreen />,
    label: 'Dashboard',
    protected: true
  },
  {
    path: '/users',
    element: <UsersScreen />,
    label: 'Users',
    protected: true,
    adminOnly: true
  },
  {
    path: '/subscriptions',
    element: <SubscriptionsScreen />,
    label: 'Subscriptions',
    protected: true
  },
  {
    path: '/payments',
    element: <PaymentsScreen />,
    label: 'Payments',
    protected: true
  },
  {
    path: '/analytics',
    element: <AnalyticsScreen />,
    label: 'Analytics',
    protected: true,
    adminOnly: true
  },
  {
    path: '*',
    element: <NotFoundScreen />
  }
];