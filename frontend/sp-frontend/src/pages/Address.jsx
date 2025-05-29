/* eslint-disable no-unused-vars */
import { useTheme } from '../context/ThemeContext';
import { Calendar, User } from 'lucide-react';  
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, MapPin } from 'lucide-react';
import AddressCard from '../components/address/AddressCard';
import AddressForm from '../components/address/AddressForm';
import AddressSkeleton from '../components/address/AddressSkeleton';
import { createAddress, deleteAddress, fetchAllAddresses,  updateAddress ,setDefaultAddress} from '../store/middleware/addressMiddleware';
import { Link } from 'react-router-dom';
import { selectAddressError, selectAddressLoading, selectAllAddresses, selectDefaultAddress, } from '../store/slices/addressesSlice';
import { selectIsReadyToCheckout } from '../store/slices/cartSlice';



const AddressManagement = () => {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const addresses = useSelector(selectAllAddresses);
  const loading = useSelector(selectAddressLoading);
  const error = useSelector(selectAddressError);
  const defaultAddress = useSelector(selectDefaultAddress);
  const readyToCheckout=useSelector((state)=>state.cart.checkout);
 
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    dispatch(fetchAllAddresses());
  }, [dispatch]);
  
  useEffect(() => {
    console.log('Addresses updated:', addresses);
  }, [addresses]);


  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleSaveAddress = async (addressData) => {
    try {
      if (editingAddress) {
        await dispatch(updateAddress({ 
          id: editingAddress.id, 
          addressData 
        })).unwrap();
      } else {
        await dispatch(createAddress({ addressData })).unwrap();
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddress({ id })).unwrap();
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await dispatch(setDefaultAddress({ id })).unwrap();
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              My Addresses
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your delivery addresses
            </p>
          </div>
          <button
            onClick={handleAddAddress}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-colors"
          >
            <Plus size={20} />
            <span>Add Address</span>
          </button>
          {readyToCheckout && <p className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-colors"

          ><Link to="/checkout">Proceed To Checkout
          </Link></p>
          }
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg dark:bg-red-900 dark:border-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            // Skeleton Loading
            Array.from({ length: 4 }).map((_, index) => (
              <AddressSkeleton key={index} isDark={isDark} />
            ))
          ) : addresses.length === 0 ? (
            // Empty State
            <div className="col-span-full text-center py-12">
              <MapPin size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                No addresses found
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                Add your first address to get started with deliveries.
              </p>
              <button
                onClick={handleAddAddress}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 font-medium"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            // Address Cards
            addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefault}
                isDark={isDark}
              />
            ))
          )}
        </div>

        {/* Address Form Modal */}
        {showForm && (
          <AddressForm
            address={editingAddress}
            onSave={handleSaveAddress}
            onCancel={handleCancel}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
};
export default AddressManagement;