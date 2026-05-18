import React from 'react';
import type { Subscription, User, SubscriptionStatus } from '../types/types';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  users: User[];
  onEdit?: (sub: Subscription) => void;
  onDelete?: (sub: Subscription) => void;
  currentUserId?: string;
  className?: string;
}

const statusColors: Record<SubscriptionStatus, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-slate-200 text-slate-600',
  canceled: 'bg-red-100 text-red-700',
  trialing: 'bg-blue-100 text-blue-700',
  past_due: 'bg-yellow-100 text-yellow-700'
};

const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  users,
  onEdit,
  onDelete,
  currentUserId,
  className = ''
}) => {
  const userMap = React.useMemo(() => {
    const map: Record<string, User> = {};
    users.forEach(u => {
      map[u.id] = u;
    });
    return map;
  }, [users]);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-slate-100">
            <th className="py-3 px-4 text-left font-semibold">User</th>
            <th className="py-3 px-4 text-left font-semibold">Plan</th>
            <th className="py-3 px-4 text-left font-semibold">Status</th>
            <th className="py-3 px-4 text-left font-semibold">Started</th>
            <th className="py-3 px-4 text-left font-semibold">Renewal/Ends</th>
            {(onEdit || onDelete) && (
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => {
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
                    {user?.id === currentUserId && (
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
                {(onEdit || onDelete) && (
                  <td className="py-2 px-4">
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button
                          className="text-blue-600 hover:underline text-sm"
                          onClick={() => onEdit(sub)}
                          type="button"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="text-red-600 hover:underline text-sm"
                          onClick={() => onDelete(sub)}
                          type="button"
                          disabled={user?.id === currentUserId}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
          {subscriptions.length === 0 && (
            <tr>
              <td colSpan={onEdit || onDelete ? 6 : 5} className="py-6 text-center text-slate-500">
                No subscriptions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionList;