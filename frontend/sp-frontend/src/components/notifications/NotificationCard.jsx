import React from 'react';
import { Check, Package, Clock, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { markNotificationAsRead } from '../../store/slices/notificationsSlice';
import { useTheme } from '../../context/ThemeContext';


const NotificationCard = ({ notification, userId = 'a' }) => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    if (!notification.isRead) {
      dispatch(markNotificationAsRead({ 
        notificationId: notification.id, 
        userId 
      }));
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ORDER_CONFIRMATION':
        return <Package size={16} className="text-green-500" />;
      case 'SYSTEM':
        return <Clock size={16} className="text-blue-500" />;
      default:
        return <Package size={16} className="text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className={`group relative p-4 border-b transition-all duration-200 hover:shadow-sm ${
      isDark 
        ? `border-gray-700 hover:border-gray-600 ${!notification.isRead ? 'bg-gray-800/50' : 'bg-gray-800/20 hover:bg-gray-800/30'}` 
        : `border-gray-200 hover:border-gray-300 ${!notification.isRead ? 'bg-orange-50/50' : 'bg-white hover:bg-gray-50/50'}`
    }`}>
      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="absolute left-2 top-6 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
      )}

      <div className="flex items-start gap-3 ml-4">
        {/* Icon */}
        <div className={`mt-1 p-2 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          {getTypeIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-medium text-sm leading-5 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {notification.title}
            </h4>
            
            {/* Mark as Read Button */}
            {!notification.isRead && (
              <button
                onClick={handleMarkAsRead}
                className={`opacity-0 group-hover:opacity-100 p-1 rounded-full transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'hover:bg-gray-600 text-gray-400 hover:text-green-400' 
                    : 'hover:bg-gray-200 text-gray-500 hover:text-green-600'
                }`}
                title="Mark as read"
              >
                <Check size={14} />
              </button>
            )}
          </div>

          <p className={`text-sm mt-1 leading-5 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {notification.message}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 mt-2">
            <span className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {formatTime(notification.createdAt)}
            </span>
            
            {notification.orderId && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                isDark 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {notification.orderId}
              </span>
            )}
            
            {notification.totalAmount && (
              <span className={`text-xs font-medium ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>
                ₹{notification.totalAmount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;