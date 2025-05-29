// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './slices/booksSlice';
import addressReducer from './slices/addressesSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice'; // Assuming you have a wishlistSlice
import ordersSlice from './slices/orderSlice'
import notificationSlice from './slices/notificationsSlice';
import  recommendationsSlice from './slices/recommendationSlice'
import authSlice from './slices/authSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer,
    address: addressReducer,
    cart:cartReducer,
    wishlist: wishlistReducer, // Assuming you have a wishlistSlice
    orders:ordersSlice,
    notifications:notificationSlice,
    recommendation:recommendationsSlice
    ,auth:authSlice
  },
});

export default store;