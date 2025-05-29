import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API Base URL - adjust according to your backend
const API_BASE_URL = 'http://localhost:9000/auth/account'; // Update this to match your backend URL

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Login failed');
      }

      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRoles', JSON.stringify(data.roles));
      localStorage.setItem('userName', data.userName);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userFullName', data.name);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error('Failed to fetch profile');
      }

      const profileData = await response.json();
      return profileData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/update_profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        }
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  // Authentication state
  isAuthenticated: !!localStorage.getItem('authToken'),
  token: localStorage.getItem('authToken') || null,
  roles: JSON.parse(localStorage.getItem('userRoles') || '[]'),
  userName: localStorage.getItem('userName') || null,
  userEmail: localStorage.getItem('userEmail') || null,
  userFullName: localStorage.getItem('userFullName') || null,
  
  // Profile state
  profile: null,
  
  // Loading states
  loginLoading: false,
  profileLoading: false,
  updateLoading: false,
  
  // Error states
  loginError: null,
  profileError: null,
  updateError: null,
  
  // Success flags
  profileUpdated: false,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear all errors
    clearErrors: (state) => {
      state.loginError = null;
      state.profileError = null;
      state.updateError = null;
    },
    
    // Clear login error specifically
    clearLoginError: (state) => {
      state.loginError = null;
    },
    
    // Clear profile error specifically
    clearProfileError: (state) => {
      state.profileError = null;
    },
    
    // Clear update error specifically
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    
    // Reset profile updated flag
    resetProfileUpdated: (state) => {
      state.profileUpdated = false;
    },
    
    // Logout user
    logout: (state) => {
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRoles');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userFullName');
      
      // Reset state
      state.isAuthenticated = false;
      state.token = null;
      state.roles = [];
      state.userName = null;
      state.userEmail = null;
      state.userFullName = null;
      state.profile = null;
      state.loginError = null;
      state.profileError = null;
      state.updateError = null;
      state.profileUpdated = false;
      console.log("User logged out successfully");
    },
    
    // Set authentication from stored token (for app initialization)
    initializeAuth: (state) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
        state.roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
        state.userName = localStorage.getItem('userName');
        state.userEmail = localStorage.getItem('userEmail');
        state.userFullName = localStorage.getItem('userFullName');
      }
    },
  },
  
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login successful"+action.payload)

        state.loginLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.roles = action.payload.roles;
        state.userName = action.payload.userName;
        state.userEmail = action.payload.email;
        state.userFullName = action.payload.name;
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("login not successful")
        state.loginLoading = false;
        state.loginError = action.payload;
        state.isAuthenticated = false;
      })
      
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
        
        // If unauthorized, logout user
        if (action.payload?.includes('Unauthorized')) {
          authSlice.caseReducers.logout(state);
        }
      })
      
      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.profileUpdated = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile = action.payload;
        state.updateError = null;
        state.profileUpdated = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.profileUpdated = false;
        
        // If unauthorized, logout user
        if (action.payload?.includes('Unauthorized')) {
          authSlice.caseReducers.logout(state);
        }
      });
  },
});

// Export actions
export const {
  clearErrors,
  clearLoginError,
  clearProfileError,
  clearUpdateError,
  resetProfileUpdated,
  logout,
  initializeAuth,
} = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectToken = (state) => state.auth.token;
export const selectUserRoles = (state) => state.auth.roles;
export const selectUserName = (state) => state.auth.userName;
export const selectUserEmail = (state) => state.auth.userEmail;
export const selectUserFullName = (state) => state.auth.userFullName;
export const selectProfile = (state) => state.auth.profile;
export const selectLoginLoading = (state) => state.auth.loginLoading;
export const selectProfileLoading = (state) => state.auth.profileLoading;
export const selectUpdateLoading = (state) => state.auth.updateLoading;
export const selectLoginError = (state) => state.auth.loginError;
export const selectProfileError = (state) => state.auth.profileError;
export const selectUpdateError = (state) => state.auth.updateError;
export const selectProfileUpdated = (state) => state.auth.profileUpdated;

// Helper selectors
export const selectHasRole = (role) => (state) => 
  state.auth.roles.includes(role);

export const selectIsLoading = (state) => 
  state.auth.loginLoading || state.auth.profileLoading || state.auth.updateLoading;

export const selectHasAnyError = (state) => 
  !!(state.auth.loginError || state.auth.profileError || state.auth.updateError);

// Export reducer
export default authSlice.reducer;