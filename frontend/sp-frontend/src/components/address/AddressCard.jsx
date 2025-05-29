import { Edit, Trash2, Home, Building, Navigation } from "lucide-react";
import { MapPin, Phone, Star } from "lucide-react";


const AddressCard = ({ address, onEdit, onDelete, onSetDefault, isDark }) => {
  const getAddressTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'home':
        return <Home size={16} className="text-orange-500" />;
      case 'office':
      case 'work':
        return <Building size={16} className="text-blue-500" />;
      default:
        return <Navigation size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 transition-all duration-200 hover:shadow-lg`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            {getAddressTypeIcon(address.addressType)}
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {address.fullName}
            </h3>
          </div>
        </div>
        {address.defaultAddress && (
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-orange-900 dark:text-orange-300">
            Default Address
          </span>
        )}
      </div>

      {/* Address Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start space-x-2">
          <MapPin size={16} className={`mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <div className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
            <p>{address.streetAddress}</p>
            <p>{address.city}, {address.state} {address.postalCode}</p>
            <p>{address.country}</p>
          </div>
        </div>
        {address.phoneNumber && (
          <div className="flex items-center space-x-2">
            <Phone size={16} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
              {address.phoneNumber}
            </span>
          </div>
        )}
        {address.addressType && (
          <div className="flex items-center space-x-2">
            <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs uppercase tracking-wide font-medium`}>
              {address.addressType}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(address)}
          className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            isDark 
              ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' 
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          <Edit size={12} />
          <span>Edit</span>
        </button>
        
        <button
          onClick={() => onDelete(address.id)}
          className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            isDark 
              ? 'bg-red-900 text-red-300 hover:bg-red-800' 
              : 'bg-red-50 text-red-700 hover:bg-red-100'
          }`}
        >
          <Trash2 size={12} />
          <span>Delete</span>
        </button>

        {!address.defaultAddress && (
          <button
            onClick={() => onSetDefault(address.id)}
            className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              isDark 
                ? 'bg-orange-900 text-orange-300 hover:bg-orange-800' 
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            <Star size={12} />
            <span>Set Default</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;