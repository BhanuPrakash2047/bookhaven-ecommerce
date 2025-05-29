import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

// API Base URL - adjust according to your backend
const API_BASE_URL = 'http://localhost:8081/api/notifications';
const token=localStorage.getItem("authToken")
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
};

// 1. Fetch all notifications (with pagination)
export const fetchUserNotifications = createAsyncThunk(
  'notifications/fetchUserNotifications',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/me?page=${page}&size=${size}`, {
        headers,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      return { data, page };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Fetch unread notifications
export const fetchUnreadNotifications = createAsyncThunk(
  'notifications/fetchUnreadNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/me/unread`, {
        headers,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch unread notifications');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 3. Fetch unread count
export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/me/unread/count`, {
        headers,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }
      const data = await response.json();
      return data.count;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 4. Mark a single notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${notificationId}/read`, {
        method: 'PUT',
        headers,
      });
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      return { notificationId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 5. Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/me/read-all`, {
        method: 'PUT',
        headers,
      });
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      const data = await response.json();
      return { updatedCount: data.updatedCount };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// WebSocket connection management
let stompClient = null;
let reconnectInterval = null;
const RECONNECT_DELAY = 5000; // 5 seconds

const connectWebSocket = (userId='a', dispatch) => {
  if (stompClient && stompClient.connected) {
    return; // Already connected
  }

  try {
    const socket = new SockJS('http://localhost:8086/ws'); // Adjust URL as needed
    stompClient = Stomp.over(socket);
    
    // Disable debug logging in production
    stompClient.debug = (str) => {
      console.log('STOMP: ' + str);
    };

    stompClient.connect(
      {},
      (frame) => {
        console.log('Connected to WebSocket: ' + frame);
        dispatch(setWebSocketConnected(true));
        
        // Clear any existing reconnect interval
        if (reconnectInterval) {
          clearInterval(reconnectInterval);
          reconnectInterval = null;
        }

        // Subscribe to user-specific notifications
        stompClient.subscribe(`/user/${userId}/queue/notifications`, (message) => {
          try {
            const notification = JSON.parse(message.body);
            dispatch(addRealTimeNotification(notification));
            dispatch(incrementUnreadCount());
            
            // Show browser notification if permission granted
            if (Notification.permission === 'granted') {
              new Notification(notification.title, {
                body: notification.message,
              
              });
            }
          } catch (error) {
            console.error('Error parsing notification message:', error);
          }
        });
      },
      (error) => {
        console.error('WebSocket connection error:', error);
        dispatch(setWebSocketConnected(false));
        
        // Attempt to reconnect
        if (!reconnectInterval) {
          reconnectInterval = setInterval(() => {
            console.log('Attempting to reconnect WebSocket...');
            connectWebSocket(userId, dispatch);
          }, RECONNECT_DELAY);
        }
      }
    );
  } catch (error) {
    console.error('Error creating WebSocket connection:', error);
    dispatch(setWebSocketConnected(false));
  }
};

const disconnectWebSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log('WebSocket disconnected');
    });
  }
  
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
    reconnectInterval = null;
  }
  
  stompClient = null;
};

// WebSocket middleware thunks
export const connectNotificationWebSocket = createAsyncThunk(
  'notifications/connectWebSocket',
  async (userId, { dispatch }) => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    
    connectWebSocket('a', dispatch);
    return userId;
  }
);

export const disconnectNotificationWebSocket = createAsyncThunk(
  'notifications/disconnectWebSocket',
  async (_, { dispatch }) => {
    disconnectWebSocket();
    dispatch(setWebSocketConnected(false));
  }
);

// Initial state
const initialState = {
  // Notification data
  notifications: [],
  unreadNotifications: [],
  unreadCount: 0,
  
  // Pagination
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  hasMore: true,
  
  // WebSocket connection
  isWebSocketConnected: false,
  connectedUserId: null,
  
  // Loading states
  loading: {
    fetchNotifications: false,
    fetchUnread: false,
    fetchUnreadCount: false,
    markAsRead: false,
    markAllAsRead: false,
    createNotification: false,
  },
  
  // Error states
  error: {
    fetchNotifications: null,
    fetchUnread: null,
    fetchUnreadCount: null,
    markAsRead: null,
    markAllAsRead: null,
    createNotification: null,
    webSocket: null,
  },
  
  // UI state
  showNotificationPanel: false,
  lastNotificationTime: null,
};

// Notification slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // WebSocket connection actions
    setWebSocketConnected: (state, action) => {
      state.isWebSocketConnected = action.payload;
      if (!action.payload) {
        state.connectedUserId = null;
      }
    },
    
    // Real-time notification handling
    addRealTimeNotification: (state, action) => {
      const newNotification = action.payload;
      
      // Add to unread notifications
      state.unreadNotifications.unshift(newNotification);
      
      // Add to main notifications list if not already present
      const existingIndex = state.notifications.findIndex(n => n.id === newNotification.id);
      if (existingIndex === -1) {
        state.notifications.unshift(newNotification);
      }
      
      state.lastNotificationTime = new Date().toISOString();
    },
    
    // Counter actions
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    
    // UI actions
    toggleNotificationPanel: (state) => {
      state.showNotificationPanel = !state.showNotificationPanel;
    },
    
    setNotificationPanelVisible: (state, action) => {
      state.showNotificationPanel = action.payload;
    },
    
    // Utility actions
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadNotifications = [];
      state.unreadCount = 0;
      state.currentPage = 0;
      state.totalPages = 0;
      state.totalElements = 0;
      state.hasMore = true;
    },
    
    clearErrors: (state) => {
      state.error = {
        fetchNotifications: null,
        fetchUnread: null,
        fetchUnreadCount: null,
        markAsRead: null,
        markAllAsRead: null,
        createNotification: null,
        webSocket: null,
      };
    },
  },
  
  extraReducers: (builder) => {
    // Fetch user notifications
    builder
      .addCase(fetchUserNotifications.pending, (state) => {
        state.loading.fetchNotifications = true;
        state.error.fetchNotifications = null;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.loading.fetchNotifications = false;
        const { data, page } = action.payload;
        
        if (page === 0) {
          // First page - replace notifications
          state.notifications = data.content;
        } else {
          // Subsequent pages - append notifications
          state.notifications.push(...data.content);
        }
        
        state.currentPage = data.number;
        state.totalPages = data.totalPages;
        state.totalElements = data.totalElements;
        state.hasMore = !data.last;
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.loading.fetchNotifications = false;
        state.error.fetchNotifications = action.payload;
      });
    
    // Fetch unread notifications
    builder
      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.loading.fetchUnread = true;
        state.error.fetchUnread = null;
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.loading.fetchUnread = false;
        state.unreadNotifications = action.payload;
      })
      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.loading.fetchUnread = false;
        state.error.fetchUnread = action.payload;
      });
    
    // Fetch unread count
    builder
      .addCase(fetchUnreadCount.pending, (state) => {
        state.loading.fetchUnreadCount = true;
        state.error.fetchUnreadCount = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.loading.fetchUnreadCount = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.loading.fetchUnreadCount = false;
        state.error.fetchUnreadCount = action.payload;
      });
    
    // Mark notification as read
    builder
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading.markAsRead = true;
        state.error.markAsRead = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading.markAsRead = false;
        const { notificationId } = action.payload;
        
        // Update notification in main list
        const mainIndex = state.notifications.findIndex(n => n.id === notificationId);
        if (mainIndex !== -1) {
          state.notifications[mainIndex].isRead = true;
        }
        
        // Remove from unread notifications
        state.unreadNotifications = state.unreadNotifications.filter(n => n.id !== notificationId);
        
        // Decrement unread count
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading.markAsRead = false;
        state.error.markAsRead = action.payload;
      });
    
    // Mark all notifications as read
    builder
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading.markAllAsRead = true;
        state.error.markAllAsRead = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.loading.markAllAsRead = false;
        
        // Mark all notifications as read
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          isRead: true
        }));
        
        // Clear unread notifications
        state.unreadNotifications = [];
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.loading.markAllAsRead = false;
        state.error.markAllAsRead = action.payload;
      });
    
   
    // WebSocket connection
    builder
      .addCase(connectNotificationWebSocket.fulfilled, (state, action) => {
        state.connectedUserId = action.payload;
      })
      .addCase(disconnectNotificationWebSocket.fulfilled, (state) => {
        state.isWebSocketConnected = false;
        state.connectedUserId = null;
      });
  },
});

// Export actions
export const {
  setWebSocketConnected,
  addRealTimeNotification,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount,
  toggleNotificationPanel,
  setNotificationPanelVisible,
  clearNotifications,
  clearErrors,
} = notificationSlice.actions;

// Selectors
export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadNotifications = (state) => state.notifications.unreadNotifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationLoading = (state) => state.notifications.loading;
export const selectNotificationErrors = (state) => state.notifications.error;
export const selectIsWebSocketConnected = (state) => state.notifications.isWebSocketConnected;
export const selectConnectedUserId = (state) => state.notifications.connectedUserId;
export const selectShowNotificationPanel = (state) => state.notifications.showNotificationPanel;
export const selectHasMoreNotifications = (state) => state.notifications.hasMore;
export const selectCurrentPage = (state) => state.notifications.currentPage;
export const selectLastNotificationTime = (state) => state.notifications.lastNotificationTime;

// Complex selectors
export const selectNotificationById = (state, notificationId) =>
  state.notifications.notifications.find(n => n.id === notificationId);

export const selectNotificationsByType = (state, type) =>
  state.notifications.notifications.filter(n => n.type === type);

export const selectRecentNotifications = (state, limit = 5) =>
  state.notifications.notifications.slice(0, limit);

// Export reducer
export default notificationSlice.reducer;