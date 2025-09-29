import React, { useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, X, Clock, Filter } from 'lucide-react';

const Notifications = () => {
  const [filter, setFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Competition Registration Deadline',
      message: 'The registration deadline for the National Championships is approaching. Please submit your application by March 15th.',
      authority: 'Sports Federation',
      time: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      title: 'New Training Guidelines Released',
      message: 'Updated training protocols and safety guidelines have been published. All coaches are required to review the new standards.',
      authority: 'Training Committee',
      time: '5 hours ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'success',
      title: 'Video Analysis Completed',
      message: 'Your recent training session video has been successfully analyzed. Performance metrics are now available in your dashboard.',
      authority: 'AI Analysis System',
      time: '1 day ago',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Equipment Inspection Required',
      message: 'Annual equipment safety inspection is due. Please schedule your inspection before the end of this month.',
      authority: 'Safety Committee',
      time: '1 day ago',
      read: true,
      priority: 'high'
    },
    {
      id: 5,
      type: 'info',
      title: 'Workshop Registration Open',
      message: 'Registration is now open for the Advanced Coaching Workshop. Limited seats available.',
      authority: 'Education Department',
      time: '2 days ago',
      read: true,
      priority: 'medium'
    },
    {
      id: 6,
      type: 'success',
      title: 'Certification Approved',
      message: 'Your Level 2 Coaching Certification has been approved. Certificate will be available for download shortly.',
      authority: 'Certification Board',
      time: '3 days ago',
      read: true,
      priority: 'low'
    }
  ];

  const [notificationList, setNotificationList] = useState(notifications);

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBorderColor = (type, priority) => {
    if (priority === 'high') return 'border-l-red-500';
    if (type === 'alert') return 'border-l-red-500';
    if (type === 'success') return 'border-l-green-500';
    if (type === 'info') return 'border-l-blue-500';
    return 'border-l-gray-300';
  };

  const markAsRead = (id) => {
    setNotificationList(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id) => {
    setNotificationList(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notificationList.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'high') return notif.priority === 'high';
    return notif.type === filter;
  });

  const unreadCount = notificationList.filter(notif => !notif.read).length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Notifications</h1>
          <p className="text-blue-600">Stay updated with alerts and announcements from authorities.</p>
        </div>
        {unreadCount > 0 && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium">
            {unreadCount} unread notifications
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
        <Filter className="w-5 h-5 text-blue-600 flex-shrink-0" />
        {[
          { key: 'all', label: 'All', count: notificationList.length },
          { key: 'unread', label: 'Unread', count: unreadCount },
          { key: 'high', label: 'High Priority', count: notificationList.filter(n => n.priority === 'high').length },
          { key: 'alert', label: 'Alerts', count: notificationList.filter(n => n.type === 'alert').length },
          { key: 'info', label: 'Information', count: notificationList.filter(n => n.type === 'info').length },
          { key: 'success', label: 'Updates', count: notificationList.filter(n => n.type === 'success').length },
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 whitespace-nowrap ${
              filter === filterOption.key
                ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg'
                : 'bg-white/70 text-blue-700 hover:bg-blue-50 border border-blue-200'
            }`}
          >
            <span>{filterOption.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              filter === filterOption.key
                ? 'bg-white/20 text-white'
                : 'bg-blue-100 text-blue-600'
            }`}>
              {filterOption.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl">
            <Bell className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">No notifications found</h3>
            <p className="text-blue-600">There are no notifications matching your selected filter.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-l-4 transition-all duration-200 hover:shadow-xl ${getBorderColor(notification.type, notification.priority)} ${
                !notification.read ? 'border border-blue-200' : 'border border-blue-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-blue-900' : 'text-blue-700'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {notification.priority === 'high' && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                          High Priority
                        </span>
                      )}
                    </div>
                    <p className="text-blue-700 mb-3">{notification.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-blue-500">
                      <span className="flex items-center space-x-1">
                        <span>📋</span>
                        <span>{notification.authority}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{notification.time}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Remove notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-sky-500 rounded-2xl p-6 text-white">
          <h3 className="font-semibold mb-2">Mark All as Read</h3>
          <p className="text-blue-100 text-sm mb-4">Clear all unread notifications</p>
          <button 
            onClick={() => setNotificationList(prev => prev.map(n => ({ ...n, read: true })))}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Mark All Read
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <h3 className="font-semibold mb-2">Notification Settings</h3>
          <p className="text-green-100 text-sm mb-4">Customize your alert preferences</p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Open Settings
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl p-6 text-white">
          <h3 className="font-semibold mb-2">Authority Contact</h3>
          <p className="text-purple-100 text-sm mb-4">Get in touch with authorities</p>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;