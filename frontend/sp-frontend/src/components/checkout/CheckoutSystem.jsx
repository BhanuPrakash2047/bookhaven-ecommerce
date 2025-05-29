/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
//
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, MapPin, Smartphone, CreditCard, Home, Phone } from 'lucide-react';
import OrderConfirmationAnimation from './OrderConfirmation';
import {CartItemSkeleton,AddressSkeleton} from './Skeleton';
import { Loader2, ShoppingCart } from 'lucide-react';   
import { selectToken } from '../../store/slices/authSlice';
import { selectDefaultAddress } from '../../store/slices/addressesSlice';
import { fetchAllAddresses } from '../../store/middleware/addressMiddleware';
import { fetchUserCart } from '../../store/middleware/cartMiddleware';
import { Package } from 'lucide-react';



const CheckoutSystem = () => {
      const dispatch = useDispatch();

      useEffect(() => {
    dispatch(fetchAllAddresses());
    dispatch(fetchUserCart());
  }, [dispatch]);

  const { isDark, toggleTheme } = useTheme();

  
  // Mock Redux selectors - replace with your actual selectors
  const cartItems = useSelector(state => state.cart?.items || []);
  const defaultAddress = useSelector((state)=>{
    console.log("from needed method"+state.address.defaultAddress)
    return state.address.defaultAddress  
    
});
    // const {id} = useSelector((state)=>state.address.defaultAddress  );
  const [currentStep, setCurrentStep] = useState('review'); // review, payment, confirmation
  const [selectedPayment, setSelectedPayment] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  console.log("default addresss id"+defaultAddress?.id)
//   console.log("default address id from sle"+id)

  const handlePayment = async () => {
    if (!selectedPayment) return;
    
    setLoading(true);
      
    try {
      // Prepare address data for API
      const addressData = {
        ...defaultAddress,
        isDeleted: false
      };

      // Simulate API call to checkout endpoint
      const response = await fetch('http://localhost:8081/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:'Bearer '+localStorage.getItem("authToken")
          // JWT token will be automatically included by your auth system
        },
        body: JSON.stringify(addressData)
      });

      if (response.ok) {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setCurrentStep('confirmation');
        setOrderPlaced(true);
      } else {
        throw new Error('Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  const PaymentOptions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Select Payment Method</h3>
      
      {/* UPI Payment */}
      <div 
        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
          selectedPayment === 'upi' 
            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
        }`}
        onClick={() => setSelectedPayment('upi')}
      >
        <div className="flex items-center space-x-3">
          <Smartphone className="w-6 h-6 text-orange-600" />
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white">UPI Payment</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Pay using UPI apps like GPay, PhonePe</p>
          </div>
        </div>
      </div>

      {/* Card Payment */}
      <div 
        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
          selectedPayment === 'card' 
            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
        }`}
        onClick={() => setSelectedPayment('card')}
      >
        <div className="flex items-center space-x-3">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white">Credit/Debit Card</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Visa, Mastercard, Rupay accepted</p>
          </div>
        </div>
      </div>
    </div>
  );

  const AddressDisplay = () => {
    if (!defaultAddress) {
      return <AddressSkeleton />;
    }

    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-orange-600 mt-1" />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-medium text-gray-800 dark:text-white">{defaultAddress.fullName}</h4>
              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs rounded">
                {defaultAddress.addressType || 'Default'}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              <Phone className="w-4 h-4 inline mr-1" />
              {defaultAddress.phoneNumber}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <Home className="w-4 h-4 inline mr-1" />
              {defaultAddress.streetAddress}, {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postalCode}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const CartSummary = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <ShoppingCart className="w-5 h-5 mr-2" />
        Order Summary
      </h3>
      
      <div className="space-y-4 mb-6">
        {cartItems.length === 0 ? (
          Array(3).fill(0).map((_, i) => <CartItemSkeleton key={i} />)
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 dark:text-white">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">by {item.author}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
          <span className="text-gray-800 dark:text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Shipping</span>
          <span className="text-gray-800 dark:text-white">$0</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Tax</span>
          <span className="text-gray-800 dark:text-white">$0</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between font-semibold">
          <span className="text-gray-800 dark:text-white">Total</span>
          <span className="text-orange-600 dark:text-orange-400">${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <div className={`flex items-center space-x-2 ${currentStep === 'review' ? 'text-orange-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentStep === 'review' ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
        }`}>
          1
        </div>
        <span className="text-sm font-medium">Review</span>
      </div>
      <div className="w-12 h-px bg-gray-300 dark:bg-gray-600"></div>
      <div className={`flex items-center space-x-2 ${currentStep === 'payment' ? 'text-orange-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentStep === 'payment' ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
        }`}>
          2
        </div>
        <span className="text-sm font-medium">Payment</span>
      </div>
      <div className="w-12 h-px bg-gray-300 dark:bg-gray-600"></div>
      <div className={`flex items-center space-x-2 ${currentStep === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentStep === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
        }`}>
          3
        </div>
        <span className="text-sm font-medium">Confirmed</span>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h1 className="text-xl font-bold text-orange-600">BookHaven</h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep !== 'confirmation' && <StepIndicator />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {currentStep === 'review' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Review Your Order</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Shipping Address</h3>
                    <AddressDisplay />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setCurrentStep('payment')}
                    disabled={!defaultAddress}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <PaymentOptions />

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => setCurrentStep('review')}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={!selectedPayment || loading}
                    className="flex-1 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      `Pay $${total.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'confirmation' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <OrderConfirmationAnimation />
                <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300 text-center">
                    Order ID: #BH{Date.now().toString().slice(-6)} | Estimated delivery: 3-5 business days
                  </p>
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => window.location.href = '/orders'}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                  >
                    View Orders
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {currentStep !== 'confirmation' && (
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckoutSystem;
