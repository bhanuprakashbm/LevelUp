import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Target, Activity } from 'lucide-react';

const Benchmarks = () => {
  const [selectedField, setSelectedField] = useState('athletics');

  const performanceData = [
    { name: 'Speed', current: 85, benchmark: 78, target: 90 },
    { name: 'Accuracy', current: 92, benchmark: 88, target: 95 },
    { name: 'Endurance', current: 76, benchmark: 82, target: 85 },
    { name: 'Technique', current: 88, benchmark: 85, target: 92 },
    { name: 'Strategy', current: 79, benchmark: 75, target: 88 },
  ];

  const trendData = [
    { month: 'Jan', performance: 70, benchmark: 75 },
    { month: 'Feb', performance: 75, benchmark: 76 },
    { month: 'Mar', performance: 78, benchmark: 77 },
    { month: 'Apr', performance: 82, benchmark: 78 },
    { month: 'May', performance: 85, benchmark: 79 },
    { month: 'Jun', performance: 88, benchmark: 80 },
  ];

  const fieldData = [
    { name: 'Athletics', value: 35, color: '#3B82F6' },
    { name: 'Team Sports', value: 25, color: '#10B981' },
    { name: 'Individual Sports', value: 20, color: '#F59E0B' },
    { name: 'Combat Sports', value: 20, color: '#EF4444' },
  ];

  const fields = [
    { id: 'athletics', name: 'Athletics', icon: '🏃‍♂️' },
    { id: 'team-sports', name: 'Team Sports', icon: '⚽' },
    { id: 'individual', name: 'Individual Sports', icon: '🎾' },
    { id: 'combat', name: 'Combat Sports', icon: '🥊' },
  ];

  const topPerformers = [
    { name: 'Sarah Johnson', field: 'Athletics', score: 94, improvement: '+12%' },
    { name: 'Mike Chen', field: 'Team Sports', score: 91, improvement: '+8%' },
    { name: 'Emma Davis', field: 'Individual Sports', score: 89, improvement: '+15%' },
    { name: 'Alex Rodriguez', field: 'Combat Sports', score: 87, improvement: '+6%' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Benchmarks</h1>
        <p className="text-blue-600">Compare performance across different fields and track improvements.</p>
      </div>

      {/* Field Selection */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {fields.map((field) => (
            <button
              key={field.id}
              onClick={() => setSelectedField(field.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                selectedField === field.id
                  ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg'
                  : 'bg-white/70 text-blue-700 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              <span>{field.icon}</span>
              <span className="font-medium">{field.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-sky-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-blue-900">84.2</h3>
          <p className="text-blue-600 text-sm">Average Score</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">+3</span>
          </div>
          <h3 className="text-2xl font-bold text-blue-900">7</h3>
          <p className="text-blue-600 text-sm">Above Benchmark</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-600">85%</span>
          </div>
          <h3 className="text-2xl font-bold text-blue-900">12</h3>
          <p className="text-blue-600 text-sm">Target Reached</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">+8.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-blue-900">142</h3>
          <p className="text-blue-600 text-sm">Total Assessments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Performance Comparison */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Performance vs Benchmark</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
              <XAxis dataKey="name" tick={{ fill: '#1E40AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#1E40AF', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid #BFDBFE',
                  borderRadius: '12px'
                }} 
              />
              <Legend />
              <Bar dataKey="current" fill="#3B82F6" name="Current Score" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benchmark" fill="#10B981" name="Benchmark" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#F59E0B" name="Target" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Trend */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
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
              <Legend />
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Your Performance"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="benchmark" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Industry Benchmark"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Distribution */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Performance by Field</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={fieldData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {fieldData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  border: '1px solid #BFDBFE',
                  borderRadius: '12px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {fieldData.map((field, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: field.color }} />
                <span className="text-sm text-blue-800">{field.name}: {field.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">{performer.name}</p>
                    <p className="text-sm text-blue-600">{performer.field}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-900">{performer.score}</p>
                  <p className="text-sm text-green-600">{performer.improvement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benchmarks;