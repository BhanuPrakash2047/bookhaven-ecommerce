import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const OrderConfirmationAnimation = () => {
  const [showCheck, setShowCheck] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowCheck(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`relative mb-6 transition-all duration-1000 ${showCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <div className="absolute inset-0 w-24 h-24 border-4 border-green-600 dark:border-green-400 rounded-full animate-ping"></div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Order Confirmed!</h2>
      <p className="text-gray-600 dark:text-gray-300 text-center">Your order has been successfully placed.</p>
    </div>
  );
};
export default OrderConfirmationAnimation;