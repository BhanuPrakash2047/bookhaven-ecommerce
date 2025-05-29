import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllBooks,
  fetchBookById,    
  fetchBookImages,
  fetchBookFAQs,
  fetchBookRatingsReviews,
  uploadBookImages,
  addBookFAQ,
  createBook,
  updateBook,
  deleteBook,
  fetchGenres
} from '../middleware/booksMiddleware';

// Initial state based on BookDTO structure
const initialState = {
  books: [],
 genreCount: null,
    genreloading: false,
    genreerror: null,
  selectedBook: null,
  loading: false,
  error: null,
  filters: {
    genre: null,
    minPrice: null, 
    maxPrice: null,
    minRating: null,
    author: null,
    language: null,
    yearPublished: null
  },
  // For specific book details
  bookImages: [],
  bookFaqs: [],
  bookRatingsReviews: [],
  // UI states
  imagesLoading: false,
  faqsLoading: false,
  ratingsLoading: false
};



// Books slice
const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSelectedBook: (state, action) => {
      state.selectedBook = action.payload;
    },
    clearSelectedBook: (state) => {
      state.selectedBook = null;
      state.bookImages = [];
      state.bookFaqs = [];
      state.bookRatingsReviews = [];
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        genre: null,
        minPrice: null,
        maxPrice: null,
        minRating: null,
        author: null,
        language: null,
        yearPublished: null
      };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all books
      .addCase(fetchAllBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch book by ID
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create book
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update book
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        if (state.selectedBook && state.selectedBook.id === action.payload.id) {
          state.selectedBook = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete book
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter(book => book.id !== action.payload);
        if (state.selectedBook && state.selectedBook.id === action.payload) {
          state.selectedBook = null;
        }
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload images
      .addCase(uploadBookImages.pending, (state) => {
        state.imagesLoading = true;
        state.error = null;
      })
      .addCase(uploadBookImages.fulfilled, (state) => {
        state.imagesLoading = false;
      })
      .addCase(uploadBookImages.rejected, (state, action) => {
        state.imagesLoading = false;
        state.error = action.payload;
      })

      // Fetch book images
      .addCase(fetchBookImages.pending, (state) => {
        state.imagesLoading = true;
        state.error = null;
      })
      .addCase(fetchBookImages.fulfilled, (state, action) => {
        state.imagesLoading = false;
        state.bookImages = action.payload;
      })
      .addCase(fetchBookImages.rejected, (state, action) => {
        state.imagesLoading = false;
        state.error = action.payload;
      })

      // Add FAQ
      .addCase(addBookFAQ.pending, (state) => {
        state.faqsLoading = true;
        state.error = null;
      })
      .addCase(addBookFAQ.fulfilled, (state, action) => {
        state.faqsLoading = false;
        state.bookFaqs.push(action.payload);
      })
      .addCase(addBookFAQ.rejected, (state, action) => {
        state.faqsLoading = false;
        state.error = action.payload;
      })

      // Fetch FAQs
      .addCase(fetchBookFAQs.pending, (state) => {
        state.faqsLoading = true;
        state.error = null;
      })
      .addCase(fetchBookFAQs.fulfilled, (state, action) => {
        state.faqsLoading = false;
        state.bookFaqs = action.payload;
      })
      .addCase(fetchBookFAQs.rejected, (state, action) => {
        state.faqsLoading = false;
        state.error = action.payload;
      })

      // Fetch ratings and reviews
      .addCase(fetchBookRatingsReviews.pending, (state) => {
        state.ratingsLoading = true;
        state.error = null;
      })
      .addCase(fetchBookRatingsReviews.fulfilled, (state, action) => {
        state.ratingsLoading = false;
        state.bookRatingsReviews = action.payload;
      })
      .addCase(fetchBookRatingsReviews.rejected, (state, action) => {
        state.ratingsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchGenres.pending, (state) => {
        state.genreloading = true;
        state.genreerror = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genreloading = false;
        state.genreCount = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.genreloading = false;
        state.genreerror = action.payload;
      });
  }
});

export const {
  setSelectedBook,
  clearSelectedBook,
  setFilters,
  clearFilters,
  clearError
} = booksSlice.actions;

// Selectors
export const selectAllBooks = (state) => state.books.books;
export const selectSelectedBook = (state) => state.books.selectedBook;
export const selectBooksLoading = (state) => state.books.loading;
export const selectBooksError = (state) => state.books.error;
export const selectBookFilters = (state) => state.books.filters;
export const selectBookImages = (state) => state.books.bookImages;
export const selectBookFaqs = (state) => state.books.bookFaqs;
export const selectBookRatingsReviews = (state) => state.books.bookRatingsReviews;
export const selectImagesLoading = (state) => state.books.imagesLoading;
export const selectFaqsLoading = (state) => state.books.faqsLoading;
export const selectRatingsLoading = (state) => state.books.ratingsLoading;
export const selectGenreCount = (state) => state.books.genreCount;

export default booksSlice.reducer;