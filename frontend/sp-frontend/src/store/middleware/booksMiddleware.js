import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL - adjust according to your setup
const API_BASE_URL = 'http://localhost:8081/api/admin/books';
// const token="Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJodHRwczovL3NlY3VyZS5nZW51aW5lY29kZXIuY29tIiwibmFtZSI6IkJoYXUgUHJhYXNoIiwiZW1haWwiOiJiaGFudUBlYW1wbGUuY29tIiwic3ViIjoiYSIsImlhdCI6MTc0ODQyNzcyOSwiZXhwIjoxNzQ4NDM5NzI5fQ.h9-MMIteTuE6gdJhZ_LFaBU6UtbFQVzAFnRZOxt7fKrWGwa21dvPt9r4IIcKKtGj1eLBdy_Dv7NveHYK9kuhJg"
const token='Bearer '+localStorage.getItem("authToken")

export const fetchGenres=createAsyncThunk('genres/fetchGenres', async () => {
  const response = await axios.get(API_BASE_URL+'/categories/count'); // Your endpoint
  return response.data; // Should be { Romance: 10, Sci-Fi: 5, ... }
});


// Async thunks for API calls
export const fetchAllBooks = createAsyncThunk(
  'books/fetchAll',
  async (filters = {}, { rejectWithValue }) => {


    try {
      console.log("this is token"+token)
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });


      const response = await fetch(`${API_BASE_URL}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // 🔐 Add token here
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchById',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${bookId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch book');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBook = createAsyncThunk(
  'books/create',
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': token,

        },
        body: JSON.stringify(bookData),
      });
      if (!response.ok) {
        throw new Error('Failed to create book');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/update',
  async ({ title, bookData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${title}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': token,
        },
        body: JSON.stringify(bookData),
      });
      if (!response.ok) {
        throw new Error('Failed to update book');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/delete',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${bookId}`, {
        method: 'DELETE',
           headers: {
          'Content-Type': 'application/json',
           'Authorization': token,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete book');
      }
      return bookId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadBookImages = createAsyncThunk(
  'books/uploadImages',
  async ({ title, files, mainImageIndex, altTexts }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('mainImageIndex', mainImageIndex);
      if (altTexts) {
        altTexts.forEach(altText => formData.append('altTexts', altText));
      }

      const response = await fetch(`${API_BASE_URL}/${title}/images`, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data', // Note: This header is usually set automatically by the browser when using FormData
           'Authorization': token,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload images');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookImages = createAsyncThunk(
  'books/fetchImages',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${bookId}/images`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // 🔐 Add token here
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch book images');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBookFAQ = createAsyncThunk(
  'books/addFAQ',
  async ({ bookId, faqData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${bookId}/faq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           'Authorization': token,
        },
        body: JSON.stringify(faqData),
      });
      if (!response.ok) {
        throw new Error('Failed to add FAQ');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookFAQs = createAsyncThunk(
  'books/fetchFAQs',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${bookId}/faq`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // 🔐 Add token here
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch book FAQs');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookRatingsReviews = createAsyncThunk(
  'books/fetchRatingsReviews',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${bookId}/ratings-reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // 🔐 Add token her
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch ratings and reviews');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
