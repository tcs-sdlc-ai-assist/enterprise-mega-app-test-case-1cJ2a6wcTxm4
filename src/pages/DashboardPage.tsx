import React, { useMemo } from 'react';
import analyticsService from '../services/analyticsService';
import { useDemoData } from '../contexts/demoDataContext';

const DashboardPage: React.FC = () => {
  const { loading, error, users, subscriptions, payments, analytics } = useDemoData();

  const dashboard = useMemo(() => {
    return analyticsService.computeDashboardAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, subscriptions, payments, analytics]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg text-slate-600">Loading dashboard...</div>
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
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-700">{dashboard.totalUsers}</div>
          <div className="text-slate-600 mt-2">Total Users</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-green-700">{dashboard.activeSubscriptions}</div>
          <div className="text-slate-600 mt-2">Active Subscriptions</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-emerald-700">
            ${dashboard.totalRevenue.toLocaleString()}
          </div>
          <div className="text-slate-600 mt-2">Total Revenue</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-indigo-700">{dashboard.totalPayments}</div>
          <div className="text-slate-600 mt-2">Payments</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">User Status</h2>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Active Users</span>
              <span className="font-bold text-green-700">{dashboard.activeUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Inactive Users</span>
              <span className="font-bold text-slate-500">{dashboard.inactiveUsers}</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-slate-600 font-medium mb-2">Users by Role</h3>
            <ul className="space-y-1">
              {Object.entries(dashboard.usersByRole).map(([role, count]) => (
                <li key={role} className="flex justify-between">
                  <span className="capitalize">{role}</span>
                  <span className="font-semibold">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Subscriptions</h2>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Active</span>
              <span className="font-bold text-green-700">{dashboard.activeSubscriptions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Trialing</span>
              <span className="font-bold text-blue-700">{dashboard.trialingSubscriptions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Past Due</span>
              <span className="font-bold text-yellow-700">{dashboard.pastDueSubscriptions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Canceled</span>
              <span className="font-bold text-red-700">{dashboard.canceledSubscriptions}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Payments</h2>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Completed</span>
              <span className="font-bold text-green-700">{dashboard.paymentsCompleted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Pending</span>
              <span className="font-bold text-yellow-700">{dashboard.paymentsPending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Failed</span>
              <span className="font-bold text-red-700">{dashboard.paymentsFailed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Refunded</span>
              <span className="font-bold text-indigo-700">{dashboard.paymentsRefunded}</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Analytics Events</h2>
          <ul className="space-y-1">
            {Object.entries(dashboard.events).map(([event, count]) => (
              <li key={event} className="flex justify-between">
                <span className="capitalize">{event.replace(/_/g, ' ')}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;