import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for processing checkout
export const processCheckout = createAsyncThunk(
  'checkout/processCheckout',
  async ({ shippingAddress, username }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'username': username,
        },
        body: JSON.stringify(shippingAddress),
      });

      if (!response.ok) {
        const errorData = await response.text();
        return rejectWithValue({
          status: response.status,
          message: errorData,
        });
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue({
        status: 500,
        message: error.message || 'Network error occurred',
      });
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    // Checkout state
    isProcessing: false,
    checkoutData: null,
    error: null,
    
    // UI state
    currentStep: 'address', // 'address', 'review', 'payment', 'confirmation'
  },
  reducers: {
    // UI state management
    setCheckoutStep: (state, action) => {
      state.currentStep = action.payload;
    },
    
    // Clear checkout state
    clearCheckoutState: (state) => {
      state.checkoutData = null;
      state.error = null;
      state.isProcessing = false;
      state.currentStep = 'address';
    },
  },
  extraReducers: (builder) => {
    builder
      // Process checkout
      .addCase(processCheckout.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.checkoutData = action.payload;
        state.error = null;
        state.currentStep = 'confirmation';
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
        state.checkoutData = null;
      });
  },
});

export const {
  setCheckoutStep,
  clearCheckoutState,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;

// Selectors
export const selectCheckoutState = (state) => state.checkout;
export const selectIsProcessingCheckout = (state) => state.checkout.isProcessing;
export const selectCheckoutData = (state) => state.checkout.checkoutData;
export const selectCheckoutError = (state) => state.checkout.error;
export const selectCurrentStep = (state) => state.checkout.currentStep;
