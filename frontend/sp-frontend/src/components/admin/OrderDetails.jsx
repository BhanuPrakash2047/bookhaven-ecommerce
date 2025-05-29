import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';
import { Calendar, User, CreditCard, Package, MapPin, Edit3, X } from 'lucide-react';   
import StatusUpdateModal from './StatusUpdateModal';

const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-500', textColor: 'text-yellow-800', bgColor: 'bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'PROCESSING', label: 'Processing', color: 'bg-blue-500', textColor: 'text-blue-800', bgColor: 'bg-blue-100 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'SHIPPED', label: 'Shipped', color: 'bg-purple-500', textColor: 'text-purple-800', bgColor: 'bg-purple-100 dark:bg-purple-900 dark:text-purple-200' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-500', textColor: 'text-green-800', bgColor: 'bg-green-100 dark:bg-green-900 dark:text-green-200' },
  { value: 'CANCELED', label: 'Canceled', color: 'bg-red-500', textColor: 'text-red-800', bgColor: 'bg-red-100 dark:bg-red-900 dark:text-red-200' }
];

// Order Details Modal Component
const OrderDetailsModal = ({ order, isOpen, onClose, onStatusUpdate, isUpdating }) => {
  const { isDark } = useTheme();
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  if (!isOpen || !order) return null;

  const getStatusColor = (status) => {
    const statusObj = ORDER_STATUSES.find(s => s.value === status?.toUpperCase());
    return statusObj?.bgColor || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
        <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="sticky top-0 p-6 border-b bg-inherit">
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Order Details
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Order Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Order #{order.orderNumber}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  <Calendar className="h-4 w-4 inline mr-1" />
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <button
                  onClick={() => setShowStatusUpdate(true)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Update Status
                </button>
              </div>
            </div>

            {/* Customer & Order Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Customer Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {order.username}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Order Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Total: ${order.totalAmount}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {order.orderItems?.length || 0} items
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="mb-6">
                <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Shipping Address
                </h4>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-1" />
                    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <p>{order.shippingAddress.streetAddress}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Order Items
              </h4>
              <div className="space-y-3">
                {order.orderItems?.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.bookTitle}
                        </h5>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          by {item.bookAuthor}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                          ISBN: {item.isbn}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          ${item.totalPrice}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          ${item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <StatusUpdateModal
        order={order}
        isOpen={showStatusUpdate}
        onClose={() => setShowStatusUpdate(false)}
        onUpdate={onStatusUpdate}
        isUpdating={isUpdating}
      />
    </>
  );
};


export default OrderDetailsModal;