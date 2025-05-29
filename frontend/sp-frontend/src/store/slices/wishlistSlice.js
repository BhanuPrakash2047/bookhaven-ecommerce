import { createSlice } from '@reduxjs/toolkit';
import {   
  fetchUserWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../middleware/wishlistMiddleware';

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder
      .addCase(fetchUserWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(fetchUserWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add to wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove from wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;