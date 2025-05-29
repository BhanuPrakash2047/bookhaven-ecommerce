import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// Assume these are imported from your config
const API_BASE_URL = 'http://localhost:8081/api/admin/books';
const RECOMMENDATIONS_API_URL = 'http://localhost:8081/api/recommendations';

// Helper function to get token dynamically
const getAuthToken = () => {
  // Replace this with your actual token retrieval logic
 return 'Bearer '+localStorage.getItem("authToken");
}
// Async thunk to fetch recommendations for a user
export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(RECOMMENDATIONS_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken(),
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch recommendations`);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch books by genre
export const fetchBooksByGenre = createAsyncThunk(
  'recommendations/fetchBooksByGenre',
  async (genre, { rejectWithValue }) => {
    try {
      // Validate genre parameter
      if (!genre || genre.trim().length === 0) {
        throw new Error('Genre parameter is required');
      }

      const params = new URLSearchParams();
      params.append('genre', genre.trim());

      const response = await fetch(`${API_BASE_URL}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch books for genre: ${genre}`);
      }

      const books = await response.json();
      console.log("Books fetched for genre:", genre, books);
      return { genre, books };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch books by author
export const fetchBooksByAuthor = createAsyncThunk(
  'recommendations/fetchBooksByAuthor',
  async (author, { rejectWithValue }) => {
    try {
      // Validate author parameter
      if (!author || author.trim().length === 0) {
        throw new Error('Author parameter is required');
      }

      const params = new URLSearchParams();
      params.append('author', author.trim());

      const response = await fetch(`${API_BASE_URL}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch books for author: ${author}`);
      }

      const books = await response.json();
      console.log("Books fetched for author:", author, books);
      return { author, books };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  // Raw recommendations response
  recommendations: null,
  
  // Parsed recommendation data (if your API returns structured data)
  recommendedAuthors: [],
  recommendedGenres: [],
  recommendedBooks: [],
  
  // Books organized by recommendation type
  booksByGenre: {},
  booksByAuthor: {},
  
  // Loading states
  loading: {
    recommendations: false,
    booksByGenre: {},
    booksByAuthor: {},
  },
  
  // Error states
  error: {
    recommendations: null,
    booksByGenre: {},
    booksByAuthor: {},
  },
  
  // UI state
  lastFetched: null,
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    // Clear all recommendations data
    clearRecommendations: (state) => {
      state.recommendations = null;
      state.recommendedAuthors = [];
      state.recommendedGenres = [];
      state.recommendedBooks = [];
      state.booksByGenre = {};
      state.booksByAuthor = {};
      state.loading = {
        recommendations: false,
        booksByGenre: {},
        booksByAuthor: {},
      };
      state.error = {
        recommendations: null,
        booksByGenre: {},
        booksByAuthor: {},
      };
      state.lastFetched = null;
    },
    
    // Clear error for a specific type
    clearError: (state, action) => {
      const { type, key } = action.payload;
      if (key && state.error[type]) {
        state.error[type][key] = null;
      } else if (state.error[type] !== undefined) {
        state.error[type] = null;
      }
    },

    // Clear loading state
    clearLoading: (state, action) => {
      const { type, key } = action.payload;
      if (key && state.loading[type]) {
        state.loading[type][key] = false;
      } else if (state.loading[type] !== undefined) {
        state.loading[type] = false;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Recommendations
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading.recommendations = true;
        state.error.recommendations = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading.recommendations = false;
        state.recommendations = action.payload;
        
        // Parse the response if it contains structured recommendation data
        if (action.payload) {
          state.recommendedAuthors = action.payload.recommendedAuthors || [];
          state.recommendedGenres = action.payload.recommendedGenres || [];
          state.recommendedBooks = action.payload.recommendedBooks || [];
        }
        
        state.lastFetched = new Date().toISOString();
        state.error.recommendations = null;
        
        console.log("Recommendations fetched:", state.recommendations);
        console.log("Recommended authors:", state.recommendedAuthors);
        console.log("Recommended genres:", state.recommendedGenres);
        console.log("Recommended books:", state.recommendedBooks);
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading.recommendations = false;
        state.error.recommendations = action.payload;
        console.error("Failed to fetch recommendations:", action.payload);
      })

    // Fetch Books by Genre
    builder
      .addCase(fetchBooksByGenre.pending, (state, action) => {
        const genre = action.meta.arg;
        state.loading.booksByGenre[genre] = true;
        state.error.booksByGenre[genre] = null;
      })
      .addCase(fetchBooksByGenre.fulfilled, (state, action) => {
        const { genre, books } = action.payload;
        state.loading.booksByGenre[genre] = false;
        state.booksByGenre[genre] = books;
        state.error.booksByGenre[genre] = null;
      })
      .addCase(fetchBooksByGenre.rejected, (state, action) => {
        const genre = action.meta.arg;
        state.loading.booksByGenre[genre] = false;
        state.error.booksByGenre[genre] = action.payload;
        console.error(`Failed to fetch books for genre ${genre}:`, action.payload);
      })

    // Fetch Books by Author
    builder
      .addCase(fetchBooksByAuthor.pending, (state, action) => {
        const author = action.meta.arg;
        state.loading.booksByAuthor[author] = true;
        state.error.booksByAuthor[author] = null;
      })
      .addCase(fetchBooksByAuthor.fulfilled, (state, action) => {
        const { author, books } = action.payload;
        state.loading.booksByAuthor[author] = false;
        state.booksByAuthor[author] = books;
        state.error.booksByAuthor[author] = null;
      })
      .addCase(fetchBooksByAuthor.rejected, (state, action) => {
        const author = action.meta.arg;
        state.loading.booksByAuthor[author] = false;
        state.error.booksByAuthor[author] = action.payload;
        console.error(`Failed to fetch books for author ${author}:`, action.payload);
      });
  },
});

// Export actions
export const { clearRecommendations, clearError, clearLoading } = recommendationsSlice.actions;

// Base selectors (these access the state directly)
const selectRecommendationsState = (state) => state.recommendations || {};
export const selectRecommendedAuthors =(state)=>state.recommendation.recommendedAuthors;
export const selectRecommendedGenres = (state) => state.recommendation.recommendedGenres;
export const selectBooksByGenre=(state)=>{
  return state.booksByGenre;
}

// MEMOIZED SELECTORS using createSelector to prevent unnecessary re-renders
export const selectRecommendations = createSelector(
  [selectRecommendationsState],
  (recommendationsState) => recommendationsState.recommendations
);

// export const selectRecommendedAuthors = createSelector(
//   [selectRecommendationsState],
//   (recommendationsState) => recommendationsState.recommendedAuthors || []
// );

// export const selectRecommendedGenres = createSelector(
//   [selectRecommendationsState],
//   (recommendationsState) => recommendationsState.recommendedGenres || []
// );

export const selectRecommendedBooks = createSelector(
  [selectRecommendationsState],
  (recommendationsState) => recommendationsState.recommendedBooks || []
);



export const selectBooksByAuthor = createSelector(
  [selectRecommendationsState],
  (recommendationsState) => recommendationsState.booksByAuthor || {}
);

export const selectRecommendationsLoading = createSelector(
  [selectRecommendationsState],
  (recommendationsState) => recommendationsState.loading?.recommendations || false
);

export const selectRecommendationsError = createSelector(
  [selectRecommendationsState],
  (recommendationsState) => recommendationsState.error?.recommendations
);

// Specific selectors for individual genres/authors with memoization
export const selectBooksBySpecificGenre = (genre) => createSelector(
  [selectBooksByGenre],
  (booksByGenre) => booksByGenre[genre] || []
);

export const selectBooksBySpecificAuthor = (author) => createSelector(
  [selectBooksByAuthor],
  (booksByAuthor) => booksByAuthor[author] || []
);

export const selectGenreLoading = (genre) => createSelector(
  [selectRecommendationsState],
  (recommendationsState) => recommendationsState.loading?.booksByGenre?.[genre] || false
);

export const selectAuthorLoading = (author) => createSelector(
  [selectRecommendationsState],
  (recommendationsState) => recommendationsState.loading?.booksByAuthor?.[author] || false
);

export const selectGenreError = (genre) => createSelector(
  [selectRecommendationsState],
  (recommendationsState) => recommendationsState.error?.booksByGenre?.[genre]
);

export const selectAuthorError = (author) => createSelector(
  [selectRecommendationsState],
  (recommendationsState) => recommendationsState.error?.booksByAuthor?.[author]
);

// Helper selectors with memoization
export const selectHasRecommendations = createSelector(
  [selectRecommendations],
  (recommendations) => Boolean(recommendations)
);

export const selectIsAnyGenreLoading = createSelector(
  [selectRecommendationsState],
  (recommendationsState) => {
    const loadingStates = recommendationsState.loading?.booksByGenre || {};
    return Object.values(loadingStates).some(Boolean);
  }
);

export const selectIsAnyAuthorLoading = createSelector(
  [selectRecommendationsState],
  (recommendationsState) => {
    const loadingStates = recommendationsState.loading?.booksByAuthor || {};
    return Object.values(loadingStates).some(Boolean);
  }
);

// Export reducer
export default recommendationsSlice.reducer;