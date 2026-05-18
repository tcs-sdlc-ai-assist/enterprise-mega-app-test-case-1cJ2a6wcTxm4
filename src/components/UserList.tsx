import React from 'react';
import type { User } from '../types/types';

interface UserListProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  currentUserId?: string;
  className?: string;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
  currentUserId,
  className = ''
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-slate-100">
            <th className="py-3 px-4 text-left font-semibold">Name</th>
            <th className="py-3 px-4 text-left font-semibold">Email</th>
            <th className="py-3 px-4 text-left font-semibold">Role</th>
            <th className="py-3 px-4 text-left font-semibold">Status</th>
            {(onEdit || onDelete) && (
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t last:border-b-0">
              <td className="py-2 px-4 flex items-center space-x-2">
                {u.avatarUrl && (
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-7 h-7 rounded-full border border-slate-200"
                  />
                )}
                <span>{u.name}</span>
                {u.id === currentUserId && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5">
                    You
                  </span>
                )}
              </td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4 capitalize">{u.role}</td>
              <td className="py-2 px-4">
                {u.isActive ? (
                  <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium">
                    Active
                  </span>
                ) : (
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-200 text-slate-600 text-xs font-medium">
                    Inactive
                  </span>
                )}
              </td>
              {(onEdit || onDelete) && (
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    {onEdit && (
                      <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => onEdit(u)}
                        type="button"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="text-red-600 hover:underline text-sm"
                        onClick={() => onDelete(u)}
                        type="button"
                        disabled={u.id === currentUserId}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={onEdit || onDelete ? 5 : 4} className="py-6 text-center text-slate-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;