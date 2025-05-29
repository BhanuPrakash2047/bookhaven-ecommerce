// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SkeletonCard from './components/recommendations/SkeletonLoader';
import BookHavenSkeleton from './components/common/SkeletonLoader';

// Lazy load all pages
const Home = React.lazy(() => import('./pages/Home'));
const Layout = React.lazy(() => import('./layout/layout'));
const BooksPage = React.lazy(() => import('./pages/Books'));
const BookDetailsPage = React.lazy(() => import('./pages/BookDetails'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Wishlist = React.lazy(() => import('./pages/Wishlist'));
const AddressManagement = React.lazy(() => import('./pages/Address'));
const AdminPanel = React.lazy(() => import('./pages/Admin'));
const OrdersSection = React.lazy(() => import('./pages/Order'));
const NotificationPage = React.lazy(() => import('./pages/Notification'));
const BookRecommendations = React.lazy(() => import('./pages/Recommendations'));
const AuthContainer = React.lazy(() => import('./pages/Authentication'));
const CheckoutSystem = React.lazy(() => import('./components/checkout/CheckoutSystem'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<BookHavenSkeleton/>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="books/:selectedGenreFromBrowse" element={<BooksPage />} />
            <Route path="book/:bookId" element={<BookDetailsPage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="address" element={<AddressManagement />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="orders" element={<OrdersSection />} />
            <Route path="noti" element={<NotificationPage />} />
            <Route path="recommendations" element={<BookRecommendations />} />
            <Route path="auth" element={<AuthContainer />} />
            <Route path="checkout" element={<CheckoutSystem />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
