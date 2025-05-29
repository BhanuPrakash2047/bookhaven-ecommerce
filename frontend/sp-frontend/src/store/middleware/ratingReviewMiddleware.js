import { createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for submitting rating/review
export const submitRatingReview = createAsyncThunk(
  'ratingReview/submitRatingReview',
  async ({ username, bookId, requestData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/books/${bookId}/ratings-reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'username': username,
        },
        body: JSON.stringify(requestData),
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

// Async thunk for updating rating/review
export const updateRatingReview = createAsyncThunk(
  'ratingReview/updateRatingReview',
  async ({ username, reviewId, requestData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/ratings-reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'username': username,
        },
        body: JSON.stringify(requestData),
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

// Async thunk for deleting rating/review
export const deleteRatingReview = createAsyncThunk(
  'ratingReview/deleteRatingReview',
  async ({ username, reviewId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/ratings-reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'username': username,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        return rejectWithValue({
          status: response.status,
          message: errorData,
        });
      }

      return reviewId;
    } catch (error) {
      return rejectWithValue({
        status: 500,
        message: error.message || 'Network error occurred',
      });
    }
  }
);

// Async thunk for getting book ratings/reviews
export const getBookRatingsReviews = createAsyncThunk(
  'ratingReview/getBookRatingsReviews',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/books/${bookId}/ratings-reviews`);

      if (!response.ok) {
        const errorData = await response.text();
        return rejectWithValue({
          status: response.status,
          message: errorData,
        });
      }

      const data = await response.json();
      return { bookId, reviews: data };
    } catch (error) {
      return rejectWithValue({
        status: 500,
        message: error.message || 'Network error occurred',
      });
    }
  }
);

// Async thunk for getting user ratings/reviews
export const getUserRatingsReviews = createAsyncThunk(
  'ratingReview/getUserRatingsReviews',
  async (username, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/user/ratings-reviews', {
        headers: {
          'username': username,
        },
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