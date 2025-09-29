import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, BarChart, Bar } from 'recharts';
import { TrendingUp, Activity, Award, Target, Calendar, Download } from 'lucide-react';

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const performanceData = [
    { month: 'Jan', overall: 72, speed: 68, technique: 75, endurance: 70 },
    { month: 'Feb', overall: 75, speed: 72, technique: 78, endurance: 73 },
    { month: 'Mar', overall: 78, speed: 76, technique: 80, endurance: 76 },
    { month: 'Apr', overall: 82, speed: 80, technique: 84, endurance: 80 },
    { month: 'May', overall: 85, speed: 83, technique: 87, endurance: 84 },
    { month: 'Jun', overall: 88, speed: 86, technique: 90, endurance: 87 },
  ];

  const radarData = [
    { skill: 'Speed', current: 86, potential: 95 },
    { skill: 'Accuracy', current: 90, potential: 96 },
    { skill: 'Endurance', current: 78, potential: 88 },
    { skill: 'Technique', current: 88, potential: 94 },
    { skill: 'Strategy', current: 79, potential: 90 },
    { skill: 'Teamwork', current: 85, potential: 92 },
  ];

  const weeklyData = [
    { day: 'Mon', sessions: 2, performance: 85 },
    { day: 'Tue', sessions: 1, performance: 78 },
    { day: 'Wed', sessions: 3, performance: 92 },
    { day: 'Thu', sessions: 2, performance: 88 },
    { day: 'Fri', sessions: 1, performance: 76 },
    { day: 'Sat', sessions: 4, performance: 94 },
    { day: 'Sun', sessions: 0, performance: 0 },
  ];

  const achievements = [
    { title: 'Speed Demon', description: 'Achieved top 10% in speed metrics', date: '2024-01-15', icon: '⚡' },
    { title: 'Consistency King', description: '30-day training streak completed', date: '2024-01-10', icon: '🏆' },
    { title: 'Technical Excellence', description: 'Perfect technique score achieved', date: '2024-01-05', icon: '🎯' },
    { title: 'Team Player', description: 'Outstanding teamwork rating', date: '2023-12-20', icon: '🤝' },
  ];

  const stats = [
    { label: 'Overall Score', value: '88.2', change: '+12.5%', color: 'from-blue-500 to-sky-500' },
    { label: 'Training Sessions', value: '156', change: '+8', color: 'from-green-500 to-emerald-500' },
    { label: 'Goals Achieved', value: '42', change: '+15', color: 'from-purple-500 to-violet-500' },
    { label: 'Rank Position', value: '#7', change: '+3', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Individual Statistics</h1>
          <p className="text-blue-600">Track your detailed performance metrics and improvements.</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-blue-200 rounded-lg bg-white/70 text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-lg hover:from-blue-600 hover:to-sky-600 transition-all duration-200 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                {index === 0 && <TrendingUp className="w-6 h-6 text-white" />}
                {index === 1 && <Activity className="w-6 h-6 text-white" />}
                {index === 2 && <Award className="w-6 h-6 text-white" />}
                {index === 3 && <Target className="w-6 h-6 text-white" />}
              </div>
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-blue-900 mb-1">{stat.value}</h3>
            <p className="text-blue-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Over Time */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
              <XAxis dataKey="month" tick={{ fill: '#1E40AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#1E40AF', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid #BFDBFE',
                  borderRadius: '12px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="overall" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorOverall)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Radar */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Skill Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#1E40AF', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#1E40AF', fontSize: 10 }} />
              <Radar 
                name="Current" 
                dataKey="current" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar 
                name="Potential" 
                dataKey="potential" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Training */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Weekly Training Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
              <XAxis dataKey="day" tick={{ fill: '#1E40AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#1E40AF', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid #BFDBFE',
                  borderRadius: '12px'
                }} 
              />
              <Bar dataKey="sessions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-900">13</p>
              <p className="text-sm text-blue-600">Sessions this week</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-900">4.2h</p>
              <p className="text-sm text-green-600">Average duration</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-900">86%</p>
              <p className="text-sm text-purple-600">Average performance</p>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Recent Achievements</h3>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 text-sm">{achievement.title}</h4>
                  <p className="text-xs text-blue-600 mb-1">{achievement.description}</p>
                  <div className="flex items-center space-x-1 text-xs text-blue-500">
                    <Calendar className="w-3 h-3" />
                    <span>{achievement.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-gold-100 to-yellow-100 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2 flex items-center space-x-2">
              <span>🏆</span>
              <span>Next Goal</span>
            </h4>
            <p className="text-sm text-yellow-800">Reach 90+ overall score to unlock "Elite Performer" badge</p>
            <div className="mt-2 w-full bg-yellow-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '88%' }} />
            </div>
            <p className="text-xs text-yellow-700 mt-1">88% complete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;