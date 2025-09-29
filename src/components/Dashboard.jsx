import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, User, BarChart3, Bell, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Upload Video',
      description: 'Upload and process your videos with AI analysis',
      icon: Upload,
      color: 'from-green-500 to-emerald-500',
      path: '/upload',
      stats: '12 videos processed'
    },
    {
      title: 'Profile & Users',
      description: 'Manage your profile and view user details',
      icon: User,
      color: 'from-purple-500 to-violet-500',
      path: '/profile',
      stats: '3 active users'
    },
    {
      title: 'Benchmarks',
      description: 'Compare performance across different fields',
      icon: BarChart3,
      color: 'from-orange-500 to-amber-500',
      path: '/benchmarks',
      stats: '8 benchmarks active'
    },
    {
      title: 'Notifications',
      description: 'View updates and alerts from authorities',
      icon: Bell,
      color: 'from-red-500 to-pink-500',
      path: '/notifications',
      stats: '5 new alerts'
    },
    {
      title: 'Statistics',
      description: 'View detailed individual performance metrics',
      icon: TrendingUp,
      color: 'from-indigo-500 to-blue-500',
      path: '/statistics',
      stats: '15% improvement'
    },
    {
      title: 'Clubs Directory',
      description: 'Explore clubs and their contact information',
      icon: Users,
      color: 'from-cyan-500 to-teal-500',
      path: '/clubs',
      stats: '24 clubs listed'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">Welcome to Your Dashboard</h1>
        <p className="text-blue-600 text-lg">Manage your activities, track progress, and stay connected.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-blue-100 hover:border-blue-200 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300" 
                   style={{backgroundImage: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`}} />
              
              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${card.color} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {card.title}
                </h3>
                
                <p className="text-blue-600 mb-4 text-sm">
                  {card.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
                    {card.stats}
                  </span>
                  <div className="w-6 h-6 text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200">
                    →
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-blue-800">Video analysis completed</span>
              <span className="text-blue-500 text-sm ml-auto">2 min ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-800">New benchmark added</span>
              <span className="text-blue-500 text-sm ml-auto">1 hour ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-blue-800">Authority notification received</span>
              <span className="text-blue-500 text-sm ml-auto">3 hours ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-sky-500 rounded-xl text-white">
              <div className="text-2xl font-bold">42</div>
              <div className="text-blue-100 text-sm">Total Videos</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white">
              <div className="text-2xl font-bold">89%</div>
              <div className="text-green-100 text-sm">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl text-white">
              <div className="text-2xl font-bold">24</div>
              <div className="text-purple-100 text-sm">Active Clubs</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white">
              <div className="text-2xl font-bold">15</div>
              <div className="text-orange-100 text-sm">Benchmarks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;