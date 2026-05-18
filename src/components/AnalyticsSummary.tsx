import React from 'react';
import analyticsService from '../services/analyticsService';

interface AnalyticsSummaryProps {
  className?: string;
}

const colorMap: Record<string, string> = {
  login: 'bg-blue-100 text-blue-700',
  logout: 'bg-slate-100 text-slate-700',
  payment: 'bg-green-100 text-green-700',
  subscription_update: 'bg-indigo-100 text-indigo-700',
  page_view: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700'
};

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ className = '' }) => {
  const dashboard = analyticsService.computeDashboardAnalytics();

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">Analytics Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-700">{dashboard.totalUsers}</div>
          <div className="text-slate-600 mt-1 text-sm">Total Users</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-green-700">{dashboard.activeSubscriptions}</div>
          <div className="text-slate-600 mt-1 text-sm">Active Subs</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold text-emerald-700">
            ${dashboard.totalRevenue.toLocaleString()}
          </div>
          <div className="text-slate-600 mt-1 text-sm">Total Revenue</div>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-slate-700 font-medium mb-2">Events</h3>
        <ul className="space-y-1">
          {Object.entries(dashboard.events).map(([event, count]) => (
            <li key={event} className="flex items-center justify-between">
              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium mr-2 ${colorMap[event] ?? 'bg-slate-100 text-slate-700'}`}
              >
                {event.replace(/_/g, ' ')}
              </span>
              <span className="font-semibold">{count}</span>
            </li>
          ))}
          {Object.keys(dashboard.events).length === 0 && (
            <li className="text-slate-400 text-sm">No analytics events found.</li>
          )}
        </ul>
      </div>
      <div>
        <h3 className="text-slate-700 font-medium mb-2">Users by Role</h3>
        <ul className="space-y-1">
          {Object.entries(dashboard.usersByRole).map(([role, count]) => (
            <li key={role} className="flex items-center justify-between">
              <span className="capitalize">{role}</span>
              <span className="font-semibold">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsSummary;