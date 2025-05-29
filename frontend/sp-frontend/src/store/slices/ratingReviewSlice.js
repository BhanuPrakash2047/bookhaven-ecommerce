// store/slices/ratingReviewSlice.js
import { createSlice} from '@reduxjs/toolkit';
import {
    submitRatingReview,
    updateRatingReview,
    deleteRatingReview,
    getBookRatingsReviews,
    getUserRatingsReviews,
} from '../middleware/ratingReviewMiddleware';

const ratingReviewSlice = createSlice({
  name: 'ratingReview',
  initialState: {
    // Book reviews by bookId
    bookReviews: {}, // { bookId: [reviews] }
    
    // User's reviews
    userReviews: [],
    
    // Loading states
    isSubmitting: false,
    isUpdating: false,
    isDeleting: false,
    isLoadingBookReviews: false,
    isLoadingUserReviews: false,
    
    // Error states
    submitError: null,
    updateError: null,
    deleteError: null,
    loadError: null,
    
    // UI state
    activeReviewForm: null, // { bookId, reviewId } or null
    selectedRating: 0,
    reviewText: '',
    
    // Statistics - now managed by backend but kept for backward compatibility
    reviewStats: {}, // { bookId: { averageRating, totalReviews } }
    
    // Book rating statistics from backend
    bookRatingStats: {}, // { bookId: { totalRatings, averageRating } }
  },
  reducers: {
    // UI state management
    setActiveReviewForm: (state, action) => {
      state.activeReviewForm = action.payload;
    },
    
    clearActiveReviewForm: (state) => {
      state.activeReviewForm = null;
      state.selectedRating = 0;
      state.reviewText = '';
    },
    
    setSelectedRating: (state, action) => {
      state.selectedRating = action.payload;
    },
    
    setReviewText: (state, action) => {
      state.reviewText = action.payload;
    },
    
    // Clear errors
    clearSubmitError: (state) => {
      state.submitError = null;
    },
    
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    
    clearLoadError: (state) => {
      state.loadError = null;
    },
    
    // Update book rating statistics from backend
    updateBookRatingStats: (state, action) => {
      const { bookId, totalRatings, averageRating } = action.payload;
      state.bookRatingStats[bookId] = {
        totalRatings,
        averageRating,
      };
      
      // Also update legacy reviewStats for backward compatibility
      state.reviewStats[bookId] = {
        averageRating,
        totalReviews: totalRatings,
      };
    },
    
    // Statistics calculation (legacy - now primarily handled by backend)
    calculateReviewStats: (state, action) => {
      const { bookId } = action.payload;
      const reviews = state.bookReviews[bookId] || [];
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const averageRating = totalRating / reviews.length;
        
        state.reviewStats[bookId] = {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: reviews.length,
        };
        
        // Update new format as well
        state.bookRatingStats[bookId] = {
          totalRatings: reviews.length,
          averageRating: Math.round(averageRating),
        };
      } else {
        state.reviewStats[bookId] = {
          averageRating: 0,
          totalReviews: 0,
        };
        
        state.bookRatingStats[bookId] = {
          totalRatings: 0,
          averageRating: 0,
        };
      }
    },
    
    // Clear all state
    clearRatingReviewState: (state) => {
      state.bookReviews = {};
      state.userReviews = [];
      state.activeReviewForm = null;
      state.selectedRating = 0;
      state.reviewText = '';
      state.reviewStats = {};
      state.bookRatingStats = {};
      state.submitError = null;
      state.updateError = null;
      state.deleteError = null;
      state.loadError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit rating/review
      .addCase(submitRatingReview.pending, (state) => {
        state.isSubmitting = true;
        state.submitError = null;
      })
      .addCase(submitRatingReview.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submitError = null;
        
        const newReview = action.payload;
        const bookId = newReview.bookId;
        
        // Add to book reviews
        if (!state.bookReviews[bookId]) {
          state.bookReviews[bookId] = [];
        }
        state.bookReviews[bookId].unshift(newReview);
        
        // Add to user reviews
        state.userReviews.unshift(newReview);
        
        // Clear form
        state.activeReviewForm = null;
        state.selectedRating = 0;
        state.reviewText = '';
        
        // Calculate local stats (backend will handle the authoritative stats)
        const reviews = state.bookReviews[bookId];
        const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        const averageRating = totalRating / reviews.length;
        
        state.reviewStats[bookId] = {
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: reviews.length,
        };
        
        state.bookRatingStats[bookId] = {
          totalRatings: reviews.length,
          averageRating: Math.round(averageRating),
        };
      })
      .addCase(submitRatingReview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError = action.payload;
      })
      
      // Update rating/review
      .addCase(updateRatingReview.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateRatingReview.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.updateError = null;
        
        const updatedReview = action.payload;
        const bookId = updatedReview.bookId;
        
        // Update in book reviews
        if (state.bookReviews[bookId]) {
          const index = state.bookReviews[bookId].findIndex(r => r.id === updatedReview.id);
          if (index !== -1) {
            state.bookReviews[bookId][index] = updatedReview;
          }
        }
        
        // Update in user reviews
        const userIndex = state.userReviews.findIndex(r => r.id === updatedReview.id);
        if (userIndex !== -1) {
          state.userReviews[userIndex] = updatedReview;
        }
        
        // Clear form
        state.activeReviewForm = null;
        state.selectedRating = 0;
        state.reviewText = '';
        
        // Recalculate local stats
        if (state.bookReviews[bookId]) {
          const reviews = state.bookReviews[bookId];
          const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
          const averageRating = totalRating / reviews.length;
          
          state.reviewStats[bookId] = {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length,
          };
          
          state.bookRatingStats[bookId] = {
            totalRatings: reviews.length,
            averageRating: Math.round(averageRating),
          };
        }
      })
      .addCase(updateRatingReview.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload;
      })
      
      // Delete rating/review
      .addCase(deleteRatingReview.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteRatingReview.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteError = null;
        
        const reviewId = action.payload;
        
        // Remove from user reviews and get bookId
        const userReviewIndex = state.userReviews.findIndex(r => r.id === reviewId);
        let bookId = null;
        if (userReviewIndex !== -1) {
          bookId = state.userReviews[userReviewIndex].bookId;
          state.userReviews.splice(userReviewIndex, 1);
        }
        
        // Remove from book reviews
        if (bookId && state.bookReviews[bookId]) {
          const bookReviewIndex = state.bookReviews[bookId].findIndex(r => r.id === reviewId);
          if (bookReviewIndex !== -1) {
            state.bookReviews[bookId].splice(bookReviewIndex, 1);
          }
          
          // Recalculate local stats
          const reviews = state.bookReviews[bookId];
          if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
            const averageRating = totalRating / reviews.length;
            
            state.reviewStats[bookId] = {
              averageRating: Math.round(averageRating * 10) / 10,
              totalReviews: reviews.length,
            };
            
            state.bookRatingStats[bookId] = {
              totalRatings: reviews.length,
              averageRating: Math.round(averageRating),
            };
          } else {
            state.reviewStats[bookId] = {
              averageRating: 0,
              totalReviews: 0,
            };
            
            state.bookRatingStats[bookId] = {
              totalRatings: 0,
              averageRating: 0,
            };
          }
        }
      })
      .addCase(deleteRatingReview.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload;
      })
      
      // Get book ratings/reviews
      .addCase(getBookRatingsReviews.pending, (state) => {
        state.isLoadingBookReviews = true;
        state.loadError = null;
      })
      .addCase(getBookRatingsReviews.fulfilled, (state, action) => {
        state.isLoadingBookReviews = false;
        state.loadError = null;
        
        const reviews = action.payload;
        if (reviews && reviews.length > 0) {
          const bookId = reviews[0].bookId;
          state.bookReviews[bookId] = reviews;
          
          // Calculate local stats
          const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
          const averageRating = totalRating / reviews.length;
          
          state.reviewStats[bookId] = {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length,
          };
          
          state.bookRatingStats[bookId] = {
            totalRatings: reviews.length,
            averageRating: Math.round(averageRating),
          };
        }
      })
      .addCase(getBookRatingsReviews.rejected, (state, action) => {
        state.isLoadingBookReviews = false;
        state.loadError = action.payload;
      })
      
      // Get user ratings/reviews
      .addCase(getUserRatingsReviews.pending, (state) => {
        state.isLoadingUserReviews = true;
        state.loadError = null;
      })
      .addCase(getUserRatingsReviews.fulfilled, (state, action) => {
        state.isLoadingUserReviews = false;
        state.loadError = null;
        state.userReviews = action.payload;
      })
      .addCase(getUserRatingsReviews.rejected, (state, action) => {
        state.isLoadingUserReviews = false;
        state.loadError = action.payload;
      });
  },
});

export const {
  setActiveReviewForm,
  clearActiveReviewForm,
  setSelectedRating,
  setReviewText,
  clearSubmitError,
  clearUpdateError,
  clearDeleteError,
  clearLoadError,
  calculateReviewStats,
  updateBookRatingStats,
  clearRatingReviewState,
} = ratingReviewSlice.actions;

export default ratingReviewSlice.reducer;

// Selectors
export const selectRatingReviewState = (state) => state.ratingReview;
export const selectBookReviews = (bookId) => (state) => state.ratingReview.bookReviews[bookId] || [];
export const selectUserReviews = (state) => state.ratingReview.userReviews;
export const selectIsSubmittingReview = (state) => state.ratingReview.isSubmitting;
export const selectIsUpdatingReview = (state) => state.ratingReview.isUpdating;
export const selectIsDeletingReview = (state) => state.ratingReview.isDeleting;
export const selectIsLoadingBookReviews = (state) => state.ratingReview.isLoadingBookReviews;
export const selectIsLoadingUserReviews = (state) => state.ratingReview.isLoadingUserReviews;
export const selectActiveReviewForm = (state) => state.ratingReview.activeReviewForm;
export const selectSelectedRating = (state) => state.ratingReview.selectedRating;
export const selectReviewText = (state) => state.ratingReview.reviewText;

// Legacy selector for backward compatibility
export const selectReviewStats = (bookId) => (state) => 
  state.ratingReview.reviewStats[bookId] || { averageRating: 0, totalReviews: 0 };

// New selector for backend-managed stats
export const selectBookRatingStats = (bookId) => (state) => 
  state.ratingReview.bookRatingStats[bookId] || { totalRatings: 0, averageRating: 0 };

export const selectRatingReviewErrors = (state) => ({
  submitError: state.ratingReview.submitError,
  updateError: state.ratingReview.updateError,
  deleteError: state.ratingReview.deleteError,
  loadError: state.ratingReview.loadError,
});