import { Clock, Package, Truck, CheckCircle, XCircle, AlertCircle } from "lucide-react";


// Order Status Badge Component



const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'created':
        return { icon: Clock, color: 'bg-yellow-500', text: 'Pending' };
      case 'processing':
        return { icon: Package, color: 'bg-blue-500', text: 'Processing' };
      case 'shipped':
        return { icon: Truck, color: 'bg-indigo-500', text: 'Shipped' };
      case 'delivered':
        return { icon: CheckCircle, color: 'bg-green-500', text: 'Delivered' };
      case 'canceled':
        return { icon: XCircle, color: 'bg-red-500', text: 'Canceled' };
      default:
        return { icon: AlertCircle, color: 'bg-gray-500', text: 'Unknown' };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </span>
  );
};

export default OrderStatusBadge
