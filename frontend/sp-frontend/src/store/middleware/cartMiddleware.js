import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";



const API_BASE_URL = 'http://localhost:8081/api/cart';
const token='Bearer '+localStorage.getItem("authToken")

// Helper function to get username from localStorage

// Async thunks
export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // 🔐 Add token here
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ bookId, quantity }, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(API_BASE_URL, 
        { bookId, quantity },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token, // 🔐 Best practice
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);


export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, bookId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${cartItemId}`, 
        { bookId, quantity },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token, // 🔐 Best practice
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${cartItemId}`, {
                 headers: { 
            'Content-Type': 'application/json',
            'Authorization': token, // 🔐 Best practice
          }
        
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/clear`, { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token, // 🔐 Best practice
          }
        });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);