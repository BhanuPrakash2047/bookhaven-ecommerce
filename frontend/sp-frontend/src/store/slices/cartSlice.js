/* eslint-disable no-unused-vars */
import { createSlice} from '@reduxjs/toolkit';
import {
  fetchUserCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from '../middleware/cartMiddleware';

// Initial state
const initialState = {
  items: [],
  checkout: false,
  totalPrice: 0,
  totalItems: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
      state.loading = false;
      state.error = null;
    },
  
  toggleCheckout:(state)=>{
    console.log(state.checkout)
    state.checkout = !state.checkout
    console.log(state.checkout)
  }},
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update cart item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.totalPrice = 0;
        state.totalItems = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetCart,toggleCheckout } = cartSlice.actions;
export const selectIsReadyToCheckout=(state)=>{state.checkout}
export default cartSlice.reducer;