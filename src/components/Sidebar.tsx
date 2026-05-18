import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

interface SidebarProps {
  className?: string;
}

const navLinks = [
  { to: '/', label: 'Dashboard', protected: true, adminOnly: false },
  { to: '/users', label: 'Users', protected: true, adminOnly: true },
  { to: '/subscriptions', label: 'Subscriptions', protected: true, adminOnly: false },
  { to: '/payments', label: 'Payments', protected: true, adminOnly: false },
  { to: '/analytics', label: 'Analytics', protected: true, adminOnly: true }
];

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <aside className={`bg-slate-900 text-white w-64 min-h-screen flex flex-col py-8 px-4 shadow-lg ${className}`}>
      <div className="flex items-center mb-10 px-2">
        <span className="inline-block w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-black mr-2 text-xl">E</span>
        <span className="font-bold text-xl">Enterprise</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {navLinks.map(link => {
            if (link.protected && !user) return null;
            if (link.adminOnly && !isAdmin()) return null;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`block px-4 py-2 rounded transition-colors ${
                    location.pathname === link.to
                      ? 'bg-blue-700 font-semibold'
                      : 'hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {user && (
        <div className="mt-auto flex items-center space-x-2 px-2 pt-8">
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-full border-2 border-blue-600"
            />
          )}
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5 mt-1 capitalize inline-block">
              {user.role}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;