import { useState,useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { getOrderDetails,cancelOrder } from "../../store/middleware/orderMiddleware";
import { selectCurrentOrderDetails,selectOrdersLoading,selectOrdersErrors } from "../../store/slices/orderSlice";
import { AlertCircle, ArrowBigLeft,ArrowLeft,X} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
const OrderDetails = ({ orderId, onBack, isDark }) => {
  const dispatch = useDispatch();
  const orderDetails = useSelector(selectCurrentOrderDetails);
  const loading = useSelector(selectOrdersLoading);
  const errors = useSelector(selectOrdersErrors);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails({ orderId }));
    }
  }, [dispatch, orderId]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setCancelLoading(true);
      try {
        await dispatch(cancelOrder({ orderId })).unwrap();
        // Refresh order details
        dispatch(getOrderDetails({ orderId }));
      } catch (error) {
        console.error('Failed to cancel order:', error);
      } finally {
        setCancelLoading(false);
      }
    }
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


  const canCancelOrder = orderDetails && 
    orderDetails.status && 
    !['SHIPPED', 'DELIVERED', 'CANCELED'].includes(orderDetails.status.toUpperCase());

  if (loading.orderDetails) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} mr-4`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className={`h-6 w-48 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        </div>
        
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errors.orderDetails) {
    return (
      <div className="text-center py-8">
        <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          Error Loading Order Details
        </h3>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
          {errors.orderDetails.message || 'Failed to load order details'}
        </p>
        <button
          onClick={onBack}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} mr-4 transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Order #{orderDetails.orderNumber}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Placed on {formatDate(orderDetails.orderDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <OrderStatusBadge status={orderDetails.status} />
          {canCancelOrder && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelLoading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
            >
              {cancelLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-6 border`}>
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
          Order Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Shipping Address</h3>
            <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm space-y-1`}>
              <p>{orderDetails.shippingAddress?.streetAddress}</p>
              <p>{orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.state} {orderDetails.shippingAddress?.zipCode}</p>
              <p>{orderDetails.shippingAddress?.country}</p>
            </div>
          </div>
          <div>
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Order Total</h3>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {orderDetails.totalAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-6 border`}>
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
          Order Items ({orderDetails.orderItems?.length || 0})
        </h2>
        <div className="space-y-4">
          {orderDetails.orderItems?.map((item, index) => (
            <div key={index} className={`flex justify-between items-start p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
              <div className="flex-1">
                <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.bookTitle}
                </h4>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1`}>
                  by {item.bookAuthor}
                </p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>
                  ISBN: {item.isbn}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.totalPrice}
                </p>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
                  Qty: {item.quantity} × {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default OrderDetails;