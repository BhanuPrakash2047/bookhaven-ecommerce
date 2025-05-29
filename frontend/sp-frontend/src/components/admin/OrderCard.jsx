import { useTheme } from '../../context/ThemeContext';
import React from 'react';
import { User, CreditCard, Package, Eye, Edit3 } from 'lucide-react';




const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-500', textColor: 'text-yellow-800', bgColor: 'bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'PROCESSING', label: 'Processing', color: 'bg-blue-500', textColor: 'text-blue-800', bgColor: 'bg-blue-100 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'SHIPPED', label: 'Shipped', color: 'bg-purple-500', textColor: 'text-purple-800', bgColor: 'bg-purple-100 dark:bg-purple-900 dark:text-purple-200' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-500', textColor: 'text-green-800', bgColor: 'bg-green-100 dark:bg-green-900 dark:text-green-200' },
  { value: 'CANCELED', label: 'Canceled', color: 'bg-red-500', textColor: 'text-red-800', bgColor: 'bg-red-100 dark:bg-red-900 dark:text-red-200' }
];



const OrderCard = ({ order, onViewDetails, onStatusUpdate, isUpdating }) => {
  const { isDark } = useTheme();
  
  const getStatusColor = (status) => {
    const statusObj = ORDER_STATUSES.find(s => s.value === status?.toUpperCase());
    return statusObj?.bgColor || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`p-6 rounded-lg border transition-all hover:shadow-lg ${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Order #{order.orderNumber}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {formatDate(order.orderDate)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <User className="h-4 w-4 mr-2 text-gray-400" />
          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{order.username}</span>
        </div>
        <div className="flex items-center text-sm">
          <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>${order.totalAmount}</span>
        </div>
        <div className="flex items-center text-sm">
          <Package className="h-4 w-4 mr-2 text-gray-400" />
          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
            {order.orderItems?.length || 0} items
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => onViewDetails(order.id)}
          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </button>
        <button
          onClick={() => onStatusUpdate(order.id, order.status)}
          disabled={isUpdating}
          className="flex items-center px-3 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition disabled:opacity-50"
        >
          <Edit3 className="h-4 w-4 mr-1" />
          Update Status
        </button>
      </div>
    </div>
  );
};

export default OrderCard;