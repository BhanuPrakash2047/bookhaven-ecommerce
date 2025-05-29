/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUnreadCount,
  selectIsWebSocketConnected,
  selectNotificationLoading,
  fetchUnreadCount,
  connectNotificationWebSocket,
  toggleNotificationPanel
} from '../../store/slices/notificationsSlice';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
// Custom hook for theme (mock implementation)
import { useNavigate } from 'react-router-dom'; 
const NotificationIcon = ({ userId = 'a' }) => {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const unreadCount = useSelector(selectUnreadCount);
  const isWebSocketConnected = useSelector(selectIsWebSocketConnected);
  const loading = useSelector(selectNotificationLoading);

  useEffect(() => {
    if (userId) {
      // Fetch initial unread count
      dispatch(fetchUnreadCount(userId));
     
      
      // Connect WebSocket for real-time notifications
      if (!isWebSocketConnected) {
        dispatch(connectNotificationWebSocket(userId));
      }
    }
  }, [dispatch, userId, isWebSocketConnected]);

  const handleClick = () => {
    dispatch(toggleNotificationPanel());
     navigate('/noti');
  };

  return (
    <button
      onClick={handleClick}
      className={`relative p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
        isDark 
          ? 'hover:bg-gray-700/50 text-gray-200' 
          : 'hover:bg-gray-100 text-gray-700'
      }`}
      disabled={loading.fetchUnreadCount}
    >
      <Bell 
        size={20} 
        className={`${
          isWebSocketConnected 
            ? (isDark ? 'text-orange-400' : 'text-orange-500')
            : (isDark ? 'text-gray-400' : 'text-gray-500')
        } transition-colors duration-200`}
      />
      
      {/* Notification Badge */}
      {unreadCount > 0 && (
        <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-xs font-medium flex items-center justify-center transition-all duration-200 ${
          isDark 
            ? 'bg-red-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
      
      {/* Connection Indicator */}
      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 transition-colors duration-200 ${
        isWebSocketConnected
          ? 'bg-green-400 border-white'
          : 'bg-gray-400 border-white'
      } ${isDark ? 'border-gray-800' : 'border-white'}`} />
    </button>
  );
};

export default NotificationIcon;