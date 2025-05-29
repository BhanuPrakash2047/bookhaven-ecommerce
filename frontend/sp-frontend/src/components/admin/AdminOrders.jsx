/* eslint-disable no-unused-vars */
import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderStatistics, getOrdersByStatus, getOrderDetails, updateOrderStatus} from '../../store/middleware/orderMiddleware';
import { useTheme } from '../../context/ThemeContext';
import { selectOrderStatistics, selectOrdersByStatus, selectCurrentOrderDetails, selectOrdersLoading, selectOrdersErrors,clearError } from '../../store/slices/orderSlice';
import { CheckCircle,Clock,Package,Truck,XCircle,ArrowLeft,AlertCircle } from 'lucide-react';
import OrderDetailsModal from './OrderDetails';
import StatusUpdateModal from './StatusUpdateModal';
import StatisticsSkeleton from './StatisticsSkeleton';
import StatisticsCard from './StatisticsCard';
import OrderCard from './OrderCard';
import OrdersSkeleton from './OrdersSkeleton';








const AdminOrders = () => {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  
  // Redux selectors
  const statistics = useSelector(selectOrderStatistics);
  const ordersByStatus = useSelector(selectOrdersByStatus);
  const currentOrderDetails = useSelector(selectCurrentOrderDetails);
  const loading = useSelector(selectOrdersLoading);
  const errors = useSelector(selectOrdersErrors);

  // Local state
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  // Load statistics on component mount
  useEffect(() => {
    dispatch(getOrderStatistics());
  }, [dispatch]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError({}));
    };
  }, [dispatch]);

  // Handle status card click
  const handleStatusClick = (status) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(status);
      dispatch(getOrdersByStatus({ status }));
    }
  };

  // Handle view order details
  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    dispatch(getOrderDetails({ orderId }))
      .then(() => setShowOrderDetails(true));
  };

  // Handle status update
  const handleStatusUpdate = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }))
      .then((result) => {
        if (!result.error) {
          // Refresh the orders list if we're viewing a specific status
          if (selectedStatus) {
            dispatch(getOrdersByStatus({ status: selectedStatus }));
          }
          // Close the modal
          setShowStatusUpdate(false);
          // Refresh statistics
          dispatch(getOrderStatistics());
        }
      });
  };

  const getStatisticsData = () => {
    if (!statistics) return [];
    
    return [
      {
        title: 'Pending Orders',
        count: statistics?.CREATED || 0,
        icon: Clock,
        color: 'bg-yellow-500',
        status: 'CREATED'
      },
      {
        title: 'Processing',
        count: statistics?.PROCESSING || 0,
        icon: Package,
        color: 'bg-blue-500',
        status: 'PROCESSING'
      },
      {
        title: 'Shipped',
        count: statistics?.SHIPPED || 0,
        icon: Truck,
        color: 'bg-purple-500',
        status: 'SHIPPED'
      },
      {
        title: 'Delivered',
        count: statistics?.DELIVERED || 0,
        icon: CheckCircle,
        color: 'bg-green-500',
        status: 'DELIVERED'
      },
      {
        title: 'Canceled',
        count: statistics?.CANCELED || 0,
        icon: XCircle,
        color: 'bg-red-500',
        status: 'CANCELED'
      }
    ];
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Order Management
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Monitor and manage all orders from your dashboard
          </p>
        </div>

        {/* Error Display */}
        {Object.values(errors).some(error => error) && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 dark:text-red-300">
                There was an error loading some data. Please try refreshing.
              </p>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {loading.orderStatistics ? (
          <StatisticsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {getStatisticsData().map((stat) => (
              <StatisticsCard
                key={stat.status}
                title={stat.title}
                count={stat.count}
                icon={stat.icon}
                color={stat.color}
                onClick={() => handleStatusClick(stat.status)}
                isActive={selectedStatus === stat.status}
              />
            ))}
          </div>
        )}

        {/* Orders List */}
        {selectedStatus && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {selectedStatus.charAt(0) + selectedStatus.slice(1).toLowerCase()} Orders
              </h2>
              <button
                onClick={() => setSelectedStatus(null)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Overview
              </button>
            </div>

            {loading.ordersByStatus ? (
              <OrdersSkeleton />
            ) : ordersByStatus.length > 0 ? (
              <div className="grid gap-6">
                {ordersByStatus.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                    onStatusUpdate={(orderId, currentStatus) => {
                      setSelectedOrderId(orderId);
                      setShowStatusUpdate(true);
                    }}
                    isUpdating={loading.updateOrderStatus}
                  />
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders found with status: {selectedStatus}</p>
              </div>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        <OrderDetailsModal
          order={currentOrderDetails}
          isOpen={showOrderDetails}
          onClose={() => setShowOrderDetails(false)}
          onStatusUpdate={handleStatusUpdate}
          isUpdating={loading.updateOrderStatus}
        />

        {/* Status Update Modal */}
        <StatusUpdateModal
          order={ordersByStatus.find(order => order.id === selectedOrderId)}
          isOpen={showStatusUpdate}
          onClose={() => setShowStatusUpdate(false)}
          onUpdate={handleStatusUpdate}
          isUpdating={loading.updateOrderStatus}
        />
      </div>
    </div>
  );
};

export default AdminOrders;