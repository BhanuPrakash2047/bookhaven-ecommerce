import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base API URL - adjust according to your configuration
const API_BASE_URL = 'http://localhost:8081/api/orders';
const token=localStorage.getItem("authToken")
// Async thunks for user operations

export const getOrderStatus = createAsyncThunk(
  'orders/getOrderStatus',
  async ({ orderId }, { rejectWithValue }) => {
    try {
      
      const response = await axios.get(`${API_BASE_URL}/${orderId}/status`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const  getOrderDetails = createAsyncThunk(
  'orders/getOrderDetails',
  async ({ orderId }, { rejectWithValue }) => {
    try {
      
      const response = await axios.get(`${API_BASE_URL}/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ orderId }, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(`${API_BASE_URL}/${orderId}/cancel`, {}, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return { ...response.data, orderId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunks for admin operations

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      
      const response = await axios.put(`${API_BASE_URL}/${orderId}/status`, { status }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return { ...response.data, orderId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getOrdersByStatus = createAsyncThunk(
  'orders/getOrdersByStatus',
  async ({ status }, { rejectWithValue }) => {
    try {
      
      const response = await axios.get(`${API_BASE_URL}/status/${status}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getOrderStatistics = createAsyncThunk(
  'orders/getOrderStatistics',
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await axios.get(`${API_BASE_URL}/statistics`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
