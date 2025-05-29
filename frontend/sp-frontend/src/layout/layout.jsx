// src/layout/Layout.jsx
import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Outlet } from 'react-router-dom';
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default Layout;