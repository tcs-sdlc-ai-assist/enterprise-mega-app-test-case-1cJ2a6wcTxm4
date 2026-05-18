import React from 'react';
import { useAuth } from '../contexts/authContext';
import { useDemoData } from '../contexts/demoDataContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ResetDemoDataButton from './ResetDemoDataButton';

const navLinks = [
  { to: '/', label: 'Dashboard', protected: true, adminOnly: false },
  { to: '/users', label: 'Users', protected: true, adminOnly: true },
  { to: '/subscriptions', label: 'Subscriptions', protected: true, adminOnly: false },
  { to: '/payments', label: 'Payments', protected: true, adminOnly: false },
  { to: '/analytics', label: 'Analytics', protected: true, adminOnly: true }
];

const Header: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { loading } = useDemoData();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900 text-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl hover:text-blue-300 transition-colors">
            <span className="inline-block w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-black mr-1">E</span>
            <span>Enterprise Mega App</span>
          </Link>
          <nav className="ml-6 flex items-center space-x-2">
            {navLinks.map(link => {
              if (link.protected && !user) return null;
              if (link.adminOnly && !isAdmin()) return null;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded hover:bg-blue-700 transition-colors ${
                    location.pathname === link.to
                      ? 'bg-blue-800 font-semibold'
                      : 'text-slate-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-blue-600"
                />
              )}
              <span className="font-medium">{user.name}</span>
              <span className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5 ml-1 capitalize">
                {user.role}
              </span>
            </div>
          )}
          {user && (
            <button
              type="button"
              className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
              onClick={handleLogout}
              disabled={loading}
            >
              Logout
            </button>
          )}
          {user && isAdmin() && (
            <ResetDemoDataButton className="ml-2" label="Reset Demo Data" />
          )}
          {!user && (
            <Link
              to="/login"
              className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;