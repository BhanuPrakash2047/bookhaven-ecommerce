import { getOrderDetails, getOrderStatus, getUserOrders, cancelOrder, updateOrderStatus, getOrdersByStatus, getOrderStatistics } from "../middleware/orderMiddleware";
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // User-specific state
  userOrders: [],
  currentOrderDetails: null,
  currentOrderStatus: null,
  
  // Admin-specific state
  adminOrders: [],
  ordersByStatus: [],
  orderStatistics: null,
  
  // Loading states
  loading: {
    userOrders: false,
    orderDetails: false,
    orderStatus: false,
    cancelOrder: false,
    updateOrderStatus: false,
    ordersByStatus: false,
    orderStatistics: false,
  },
  
  // Error states
  errors: {
    userOrders: null,
    orderDetails: null,
    orderStatus: null,
    cancelOrder: null,
    updateOrderStatus: null,
    ordersByStatus: null,
    orderStatistics: null,
  },
  
  // UI state
  selectedOrder: null,
  filterStatus: 'ALL',
};

// Orders slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state, action) => {
      const { errorType } = action.payload;
      if (errorType) {
        state.errors[errorType] = null;
      } else {
        Object.keys(state.errors).forEach(key => {
          state.errors[key] = null;
        });
      }
    },
    
    // Clear all data
    clearOrdersData: (state) => {
      state.userOrders = [];
      state.currentOrderDetails = null;
      state.currentOrderStatus = null;
      state.adminOrders = [];
      state.ordersByStatus = [];
      state.orderStatistics = null;
      state.selectedOrder = null;
    },
    
    // Set selected order
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    
    // Set filter status
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
    
    // Update order in user orders list (useful after cancellation)
    updateOrderInList: (state, action) => {
      const { orderId, updates } = action.payload;
      const orderIndex = state.userOrders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        state.userOrders[orderIndex] = { ...state.userOrders[orderIndex], ...updates };
      }
    },
    
    // Update order in admin orders list
    updateAdminOrderInList: (state, action) => {
      const { orderId, updates } = action.payload;
      const orderIndex = state.adminOrders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        state.adminOrders[orderIndex] = { ...state.adminOrders[orderIndex], ...updates };
      }
      
      // Also update in ordersByStatus if present
      const statusOrderIndex = state.ordersByStatus.findIndex(order => order.id === orderId);
      if (statusOrderIndex !== -1) {
        state.ordersByStatus[statusOrderIndex] = { ...state.ordersByStatus[statusOrderIndex], ...updates };
      }
    },
  },
  
  extraReducers: (builder) => {
    // Get Order Status
    builder
      .addCase(getOrderStatus.pending, (state) => {
        state.loading.orderStatus = true;
        state.errors.orderStatus = null;
      })
      .addCase(getOrderStatus.fulfilled, (state, action) => {
        state.loading.orderStatus = false;
        state.currentOrderStatus = action.payload.data;
        state.errors.orderStatus = null;
      })
      .addCase(getOrderStatus.rejected, (state, action) => {
        state.loading.orderStatus = false;
        state.errors.orderStatus = action.payload;
      });

    // Get User Orders
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.loading.userOrders = true;
        state.errors.userOrders = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading.userOrders = false;
        state.userOrders = action.payload.data || [];
        console.log(state.userOrders)
        state.errors.userOrders = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading.userOrders = false;
        state.errors.userOrders = action.payload;
      });

    // Get Order Details
    builder
      .addCase(getOrderDetails.pending, (state) => {
        state.loading.orderDetails = true;
        state.errors.orderDetails = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading.orderDetails = false;
        state.currentOrderDetails = action.payload.data;
        state.errors.orderDetails = null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading.orderDetails = false;
        state.errors.orderDetails = action.payload;
      });

    // Cancel Order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.loading.cancelOrder = true;
        state.errors.cancelOrder = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading.cancelOrder = false;
        state.errors.cancelOrder = null;
        
        // Update the order status in user orders list
        const orderId = action.payload.orderId;
        const orderIndex = state.userOrders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          state.userOrders[orderIndex].status = 'CANCELED';
        }
        
        // Update current order details if it's the same order
        if (state.currentOrderDetails && state.currentOrderDetails.id === orderId) {
          state.currentOrderDetails.status = 'CANCELED';
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading.cancelOrder = false;
        state.errors.cancelOrder = action.payload;
      });

    // Update Order Status (Admin)
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading.updateOrderStatus = true;
        state.errors.updateOrderStatus = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading.updateOrderStatus = false;
        state.errors.updateOrderStatus = null;
        
        // Update the order status in admin orders
        const { orderId, status } = action.payload;
        const orderIndex = state.adminOrders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
          state.adminOrders[orderIndex].status = status;
        }
        
        // Update in ordersByStatus if present
        const statusOrderIndex = state.ordersByStatus.findIndex(order => order.id === orderId);
        if (statusOrderIndex !== -1) {
          state.ordersByStatus[statusOrderIndex].status = status;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading.updateOrderStatus = false;
        state.errors.updateOrderStatus = action.payload;
      });

    // Get Orders By Status (Admin)
    builder
      .addCase(getOrdersByStatus.pending, (state) => {
        state.loading.ordersByStatus = true;
        state.errors.ordersByStatus = null;
      })
      .addCase(getOrdersByStatus.fulfilled, (state, action) => {
        state.loading.ordersByStatus = false;
        state.ordersByStatus = action.payload.data || [];
        console.log("hi"+state.ordersByStatus)
        state.errors.ordersByStatus = null;
      })
      .addCase(getOrdersByStatus.rejected, (state, action) => {
        state.loading.ordersByStatus = false;
        state.errors.ordersByStatus = action.payload;
      });

    // Get Order Statistics (Admin)
    builder
      .addCase(getOrderStatistics.pending, (state) => {
        state.loading.orderStatistics = true;
        state.errors.orderStatistics = null;
      })
      .addCase(getOrderStatistics.fulfilled, (state, action) => {
        state.loading.orderStatistics = false;
        state.orderStatistics = action.payload.data?.orderCounts;
        console.log(state.orderStatistics);
        state.errors.orderStatistics = null;
      })
      .addCase(getOrderStatistics.rejected, (state, action) => {
        state.loading.orderStatistics = false;
        state.errors.orderStatistics = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearOrdersData,
  setSelectedOrder,
  setFilterStatus,
  updateOrderInList,
  updateAdminOrderInList,
} = ordersSlice.actions;

// Selectors
export const selectUserOrders = (state) => state.orders.userOrders;
export const selectCurrentOrderDetails = (state) => state.orders.currentOrderDetails;
export const selectCurrentOrderStatus = (state) => state.orders.currentOrderStatus;
export const selectAdminOrders = (state) => state.orders.adminOrders;
export const selectOrdersByStatus = (state) => state.orders.ordersByStatus;
export const selectOrderStatistics = (state) => state.orders.orderStatistics;
export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectFilterStatus = (state) => state.orders.filterStatus;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersErrors = (state) => state.orders.errors;

// Filtered selectors
export const selectFilteredUserOrders = (state) => {
  const orders = selectUserOrders(state);
  const filterStatus = selectFilterStatus(state);
  
  if (filterStatus === 'ALL') {
    return orders;
  }
  
  return orders.filter(order => order.status === filterStatus);
};

export const selectOrderById = (orderId) => (state) => {
  const userOrders = selectUserOrders(state);
  const adminOrders = selectAdminOrders(state);
  
  return userOrders.find(order => order.id === orderId) || 
         adminOrders.find(order => order.id === orderId) || 
         null;
};

// Export the reducer
export default ordersSlice.reducer;