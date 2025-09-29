import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Upload, User, BarChart3, Bell, TrendingUp, Users, Home } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard', color: 'from-blue-500 to-sky-500' },
    { path: '/upload', icon: Upload, label: 'Upload Video', color: 'from-green-500 to-emerald-500' },
    { path: '/profile', icon: User, label: 'Profile', color: 'from-purple-500 to-violet-500' },
    { path: '/benchmarks', icon: BarChart3, label: 'Benchmarks', color: 'from-orange-500 to-amber-500' },
    { path: '/notifications', icon: Bell, label: 'Notifications', color: 'from-red-500 to-pink-500' },
    { path: '/statistics', icon: TrendingUp, label: 'Statistics', color: 'from-indigo-500 to-blue-500' },
    { path: '/clubs', icon: Users, label: 'Clubs', color: 'from-cyan-500 to-teal-500' },
  ];

  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-white/90 backdrop-blur-md border-r border-blue-100 shadow-sm">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                    : 'hover:bg-blue-50 text-blue-700 hover:text-blue-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-600 group-hover:text-blue-800'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;