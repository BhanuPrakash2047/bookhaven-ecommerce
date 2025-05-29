import {useTheme} from '../../context/ThemeContext';
import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';





const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-500', textColor: 'text-yellow-800', bgColor: 'bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'PROCESSING', label: 'Processing', color: 'bg-blue-500', textColor: 'text-blue-800', bgColor: 'bg-blue-100 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'SHIPPED', label: 'Shipped', color: 'bg-purple-500', textColor: 'text-purple-800', bgColor: 'bg-purple-100 dark:bg-purple-900 dark:text-purple-200' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-500', textColor: 'text-green-800', bgColor: 'bg-green-100 dark:bg-green-900 dark:text-green-200' },
  { value: 'CANCELED', label: 'Canceled', color: 'bg-red-500', textColor: 'text-red-800', bgColor: 'bg-red-100 dark:bg-red-900 dark:text-red-200' }
];


const StatusUpdateModal = ({ order, isOpen, onClose, onUpdate, isUpdating }) => {
  const { isDark } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState(order?.status || '');

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  const handleUpdate = () => {
    if (selectedStatus && selectedStatus !== order.status) {
      onUpdate(order.id, selectedStatus);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Update Order Status
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            Order #{order.orderNumber}
          </p>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Current Status: <span className="text-orange-500">{order.status}</span>
          </p>
        </div>

        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            New Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className={`flex-1 py-2 px-4 border rounded-lg font-medium transition ${
              isDark 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating || selectedStatus === order.status}
            className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            {isUpdating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default StatusUpdateModal;