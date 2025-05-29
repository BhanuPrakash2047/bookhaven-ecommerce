/* eslint-disable no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { selectToken } from '../slices/authSlice';

const token=localStorage.getItem("authToken")
// API base URL
const ADDRESS_API_BASE_URL = 'http://localhost:8081/api/addresses';
// Async thunks for address operations
export const createAddress = createAsyncThunk(
  'address/create',
  async ({ addressData }, { rejectWithValue }) => {
    try {
      const response = await fetch(ADDRESS_API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Assuming username is used as a token here
        },
        body: JSON.stringify(addressData),
      });
      if (!response.ok) {
        throw new Error('Failed to create address');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllAddresses = createAsyncThunk(
  'address/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(ADDRESS_API_BASE_URL, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchAddressById = createAsyncThunk(
  'address/fetchById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ADDRESS_API_BASE_URL}/${id}`, {
        headers: {
         
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'address/update',
  async ({ id, addressData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ADDRESS_API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
         
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(addressData),
      });
      if (!response.ok) {
        throw new Error('Failed to update address');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/delete',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ADDRESS_API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
         
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete address');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'address/setDefault',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${ADDRESS_API_BASE_URL}/${id}/default`, {
        method: 'PUT',
        headers: {
         
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        }
      });
      if (!response.ok) {
        throw new Error('Failed to set default address');
      }
      const result = await response.json();
      return { id, ...result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);