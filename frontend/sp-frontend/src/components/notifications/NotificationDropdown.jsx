import React, { useEffect, useRef } from 'react';
import { X, CheckCheck, Bell, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectShowNotificationPanel,
  selectUnreadNotifications,
  selectNotificationLoading,
  selectNotificationErrors,
  selectUnreadCount,
  fetchUnreadNotifications,
  markAllNotificationsAsRead,
  setNotificationPanelVisible
} from '../../store/slices/notificationsSlice';
import NotificationCard from './NotificationCard';
import NotificationSkeleton from './NotificationSkeleton';

// Custom hook for theme (mock implementation)
const useTheme = () => {
  const [isDark, setIsDark] = React.useState(false);
  const toggleTheme = () => setIsDark(!isDark);
  return { isDark, toggleTheme };
};

const NotificationPanel = ({ userId = 'a' }) => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const panelRef = useRef(null);
  
  const showPanel = useSelector(selectShowNotificationPanel);
  const unreadNotifications = useSelector(selectUnreadNotifications);
  const loading = useSelector(selectNotificationLoading);
  const errors = useSelector(selectNotificationErrors);
  const unreadCount = useSelector(selectUnreadCount);

  // Load unread notifications when panel opens
  useEffect(() => {
    if (showPanel && userId) {
      dispatch(fetchUnreadNotifications(userId));
    }
  }, [dispatch, showPanel, userId]);

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        dispatch(setNotificationPanelVisible(false));
      }
    };

    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPanel, dispatch]);

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0 && userId) {
      dispatch(markAllNotificationsAsRead(userId));
    }
  };

  const handleClose = () => {
    dispatch(setNotificationPanelVisible(false));
  };

  if (!showPanel) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile Backdrop */}
      <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm" />
      
      {/* Panel */}
      <div 
        ref={panelRef}
        className={`absolute right-0 top-0 lg:top-12 w-full max-w-sm lg:max-w-md h-full lg:h-auto lg:max-h-96 shadow-2xl border border-opacity-20 backdrop-blur-sm transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800/95 border-gray-600' 
            : 'bg-white/95 border-gray-200'
        } lg:rounded-xl overflow-hidden`}
      >
        {/* Header */}
        <div className={`sticky top-0 px-4 py-3 border-b backdrop-blur-sm ${
          isDark 
            ? 'bg-gray-800/90 border-gray-700' 
            : 'bg-white/90 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
              <h3 className={`font-semibold text-lg ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  isDark 
                    ? 'bg-orange-500/20 text-orange-400' 
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {unreadCount} new
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {/* Mark All as Read */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading.markAllAsRead}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    isDark 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-green-400' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-green-600'
                  }`}
                  title="Mark all as read"
                >
                  {loading.markAllAsRead ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCheck size={16} />
                  )}
                </button>
              )}
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-red-600'
                }`}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-80">
          {loading.fetchUnread ? (
            <NotificationSkeleton count={4} />
          ) : errors.fetchUnread ? (
            <div className={`p-8 text-center ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <p className="text-sm">Failed to load notifications</p>
              <button
                onClick={() => dispatch(fetchUnreadNotifications(userId))}
                className={`mt-2 px-3 py-1 text-xs rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                Try again
              </button>
            </div>
          ) : unreadNotifications.length === 0 ? (
            <div className={`p-8 text-center ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Bell size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No new notifications</p>
              <p className="text-xs mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div>
              {unreadNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  userId={userId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {unreadNotifications.length > 0 && (
          <div className={`sticky bottom-0 px-4 py-3 border-t backdrop-blur-sm ${
            isDark 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-white/90 border-gray-200'
          }`}>
            <button
              onClick={() => {
                // Navigate to full notifications page
                handleClose();
                // You can implement navigation here
                console.log('Navigate to notifications page');
              }}
              className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${
                isDark 
                  ? 'text-orange-400 hover:bg-gray-700' 
                  : 'text-orange-600 hover:bg-orange-50'
              }`}
            >
              View all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;