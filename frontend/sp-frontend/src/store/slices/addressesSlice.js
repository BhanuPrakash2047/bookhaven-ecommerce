/* eslint-disable no-unused-vars */

// store/slices/addressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createAddress,
  fetchAllAddresses,
  fetchAddressById,
    updateAddress, 
    deleteAddress,
    setDefaultAddress
} from '../middleware/addressMiddleware';

// Initial state based on Address entity structure
const initialAddressState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
  defaultAddress: null
};


// Address slice
const addressSlice = createSlice({
  name: 'address',
  initialState: initialAddressState,
  reducers: {
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateLocalDefaultAddress: (state, action) => {
      // Update default address in local state
      const newDefaultId = action.payload;
      state.addresses = state.addresses.map(address => ({
        ...address,
        defaultAddress: address.id === newDefaultId
      }));
      state.defaultAddress = state.addresses.find(addr => addr.id === newDefaultId);
    }
  },
  extraReducers: (builder) => {
    builder
      // Create address
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload);
        // If this is the first address, make it default
        if (state.addresses.length === 1) {
          state.defaultAddress = action.payload;
        }
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all addresses
      .addCase(fetchAllAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        // Set default address
        state.defaultAddress = action.payload.find(addr => addr.defaultAddress) || null;
      
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch address by ID
      .addCase(fetchAddressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddressById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAddress = action.payload;
      })
      .addCase(fetchAddressById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        if (state.selectedAddress && state.selectedAddress.id === action.payload.id) {
          state.selectedAddress = action.payload;
        }
        // Update default address if this was the default
        if (action.payload.defaultAddress) {
          state.defaultAddress = action.payload;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        const deletedAddress = state.addresses.find(addr => addr.id === action.payload);
        state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
        
        // Clear selected address if it was deleted
        if (state.selectedAddress && state.selectedAddress.id === action.payload) {
          state.selectedAddress = null;
        }
        
        // Clear default address if it was deleted
        if (state.defaultAddress && state.defaultAddress.id === action.payload) {
          state.defaultAddress = state.addresses.find(addr => addr.defaultAddress) || null;
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Set default address
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        const newDefaultId = action.payload.id;
        
        // Update all addresses - remove default from old, set new
        state.addresses = state.addresses.map(address => ({
          ...address,
          defaultAddress: address.id === newDefaultId
        }));
        
        // Update default address reference
        state.defaultAddress = state.addresses.find(addr => addr.id === newDefaultId);
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSelectedAddress,
  clearSelectedAddress,
  clearError: clearAddressError,
  updateLocalDefaultAddress
} = addressSlice.actions;

// Address selectors
export const selectAllAddresses = (state) => state.address.addresses;
export const selectSelectedAddress = (state) => state.address.selectedAddress;
export const selectDefaultAddress = (state) => state.address.defaultAddress;
export const selectAddressLoading = (state) => state.address.loading;
export const selectAddressError = (state) => state.address.error;
export const selectAddressesByType = (type) => (state) => 
  state.address.addresses.filter(addr => addr.addressType === type);

export default addressSlice.reducer;