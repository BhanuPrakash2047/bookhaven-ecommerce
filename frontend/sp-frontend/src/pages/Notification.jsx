/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import { Bell, CheckCheck, Loader2, Filter, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectNotifications,
  selectNotificationLoading,
  selectNotificationErrors,
  selectUnreadCount,
  selectHasMoreNotifications,
  selectCurrentPage,
  fetchUserNotifications,
  markAllNotificationsAsRead,
  clearNotifications
} from '../store/slices/notificationsSlice';
import NotificationCard from '../components/notifications/NotificationCard';
import NotificationSkeleton from '../components/notifications/NotificationSkeleton';
import { useTheme } from '../context/ThemeContext';

// Custom hook for theme (mock implementation)

const NotificationsPage = ({ userId = 'a' }) => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  
  const notifications = useSelector(selectNotifications);
  const loading = useSelector(selectNotificationLoading);
  const errors = useSelector(selectNotificationErrors);
  const unreadCount = useSelector(selectUnreadCount);
  const hasMore = useSelector(selectHasMoreNotifications);
  const currentPage = useSelector(selectCurrentPage);

  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initial load
  useEffect(() => {
    dispatch(clearNotifications());
    dispatch(fetchUserNotifications({ userId, page: 0, size: 10 }));
  }, [dispatch, userId]);

  // Load more notifications
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading.fetchNotifications || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      await dispatch(fetchUserNotifications({ 
        userId, 
        page: currentPage + 1, 
        size: 10 
      })).unwrap();
    } catch (error) {
      console.error('Failed to load more notifications:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [dispatch, userId, currentPage, hasMore, loading.fetchNotifications, isLoadingMore]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 1000
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleLoadMore]);

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllNotificationsAsRead(userId));
    }
  };

  const handleGoBack = () => {
    // Implement navigation back functionality
    window.history.back();
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const getFilterCount = (filterType) => {
    if (filterType === 'unread') return unreadCount;
    if (filterType === 'read') return notifications.length - unreadCount;
    return notifications.length;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 backdrop-blur-sm border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleGoBack}
                className={`p-2 rounded-lg transition-colors lg:hidden ${
                  isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center gap-2">
                <Bell size={24} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
                <h1 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    isDark 
                      ? 'bg-orange-500/20 text-orange-400' 
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {unreadCount} unread
                  </span>
                )}
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={loading.markAllAsRead}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                  isDark 
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {loading.markAllAsRead ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCheck size={16} />
                )}
                Mark all read
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1 mt-4">
            <Filter size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            <div className="flex gap-1 ml-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'read', label: 'Read' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    filter === key
                      ? (isDark 
                          ? 'bg-orange-500/20 text-orange-400' 
                          : 'bg-orange-100 text-orange-600')
                      : (isDark 
                          ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800' 
                          : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100')
                  }`}
                >
                  {label} ({getFilterCount(key)})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading.fetchNotifications && notifications.length === 0 ? (
          <div className={`rounded-xl border overflow-hidden ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <NotificationSkeleton count={6} />
          </div>
        ) : errors.fetchNotifications ? (
          <div className={`p-8 text-center rounded-xl border ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-gray-400' 
              : 'bg-white border-gray-200 text-gray-500'
          }`}>
            <p className="font-medium">Failed to load notifications</p>
            <p className="text-sm mt-1">Please try again later</p>
            <button
              onClick={() => dispatch(fetchUserNotifications({ userId, page: 0, size: 10 }))}
              className={`mt-3 px-4 py-2 text-sm rounded-lg transition-colors ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              Try again
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className={`p-8 text-center rounded-xl border ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-gray-400' 
              : 'bg-white border-gray-200 text-gray-500'
          }`}>
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-medium text-lg">
              {filter === 'unread' ? 'No unread notifications' : 
               filter === 'read' ? 'No read notifications' : 
               'No notifications yet'}
            </p>
            <p className="text-sm mt-2">
              {filter === 'unread' ? "You're all caught up!" : 
               filter === 'read' ? 'Read notifications will appear here' : 
               'New notifications will appear here'}
            </p>
          </div>
        ) : (
          <div className={`rounded-xl border overflow-hidden ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {filteredNotifications.map((notification, index) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                userId={userId}
              />
            ))}
            
            {/* Load More */}
            {hasMore && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {isLoadingMore ? (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <Loader2 size={16} className="animate-spin" />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Loading more notifications...
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleLoadMore}
                    className={`w-full py-3 text-sm font-medium rounded-lg transition-colors ${
                      isDark 
                        ? 'text-orange-400 hover:bg-gray-700' 
                        : 'text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    Load more notifications
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Spacing for Mobile */}
      <div className="h-20 lg:h-8" />
    </div>
  );
};

export default NotificationsPage;