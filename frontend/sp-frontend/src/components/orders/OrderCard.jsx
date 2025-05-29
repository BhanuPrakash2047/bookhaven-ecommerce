import { MapPin,Package,Calendar,DollarSign,Eye } from "lucide-react";
// import { selectUserOrders } from "../../store/slices/orderSlice";
import OrderStatusBadge from "./OrderStatusBadge";
// import {  useEffect } from "react";
const OrderCard = ({ order, onViewDetails, isDark }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



//   const formatPrice = (price) => {
//     return `$${(price / 100).toFixed(2)}`;
//   };

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow duration-200`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Order #{order.orderNumber}
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} flex items-center mt-1`}>
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(order.orderDate)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="space-y-2 mb-4">
     
        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
          <MapPin className="w-4 h-4 mr-2" />
          {order.shippingAddress?.city}, {order.shippingAddress?.state}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <DollarSign className="w-4 h-4 mr-1" />
          {order.totalAmount}
        </div>
        <button
          onClick={() => onViewDetails(order.id)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
      </div>
    </div>
  );
};
export default OrderCard;