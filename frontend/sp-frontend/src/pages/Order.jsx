import { useState,useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { getUserOrders } from "../store/middleware/orderMiddleware";
import { selectUserOrders,selectOrdersLoading,selectOrdersErrors } from "../store/slices/orderSlice";
import { AlertCircle,Filter,Package} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import OrderDetails from "../components/orders/OrderDetails";
import OrderCardSkeleton from "../components/orders/OrderCardSkeleton";
import OrderCard from "../components/orders/OrderCard";
const OrdersSection = () => {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectOrdersLoading);
  const errors = useSelector(selectOrdersErrors);
  
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    dispatch(getUserOrders());
   
  }, [dispatch]);
   useEffect(() => {
    console.log("Order Object"+orders.userOrders);
   
  }, [orders]);

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleBackToList = () => {
    setSelectedOrderId(null);
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'ALL') return true;
    return order.status?.toUpperCase() === filterStatus.toUpperCase();
  });

  const statusOptions = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED'];

  if (selectedOrderId) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderDetails 
            orderId={selectedOrderId} 
            onBack={handleBackToList}
            isDark={isDark}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Your Orders
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Track and manage your book orders
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center space-x-4">
          <div className="flex items-center">
            <Filter className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All Orders' : status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {filteredOrders.length} order(s) found
          </span>
        </div>

        {/* Orders List */}
        {loading.userOrders ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <OrderCardSkeleton key={i} isDark={isDark} />
            ))}
          </div>
        ) : errors.userOrders ? (
          <div className="text-center py-12">
            <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Error Loading Orders
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
              {errors.userOrders.message || 'Failed to load your orders'}
            </p>
            <button
              onClick={() => dispatch(getUserOrders())}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              {filterStatus === 'ALL' ? 'No Orders Yet' : `No ${filterStatus.toLowerCase()} Orders`}
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
              {filterStatus === 'ALL' 
                ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                : `You don't have any ${filterStatus.toLowerCase()} orders.`
              }
            </p>
            {filterStatus !== 'ALL' && (
              <button
                onClick={() => setFilterStatus('ALL')}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                View All Orders
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={handleViewDetails}
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersSection;