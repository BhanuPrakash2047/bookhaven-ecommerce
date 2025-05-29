import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/wishlist';
const token='Bearer '+localStorage.getItem("authToken")
// Helper function to get username from localStorage
// const getUsername = () => localStorage.getItem('username');

// Async thunks
export const fetchUserWishlist = createAsyncThunk(
  'wishlist/fetchUserWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // 🔐 Add token here
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${bookId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // 🔐 Add token here
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${bookId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // 🔐 Add token here
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);
