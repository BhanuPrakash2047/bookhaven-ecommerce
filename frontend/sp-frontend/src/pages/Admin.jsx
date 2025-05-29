import { Package, ShoppingCart, Settings } from "lucide-react";
import BookManagement from "../components/admin/BookManagement";
import OrderVerification from "../components/admin/OrderVerification";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import AdminOrders from "../components/admin/AdminOrders";
// Main Admin Panel Component
const AdminPanel = () => {
  const { isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('inventory');

  const tabs = [
    {
      id: 'inventory',
      name: 'Inventory Management',
      icon: Package,
      component: BookManagement
    },
    {
      id: 'orders',
      name: 'Order Verification',
      icon: ShoppingCart,
      component: AdminOrders
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || BookManagement;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-orange-500" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {isDark ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActiveComponent />
      </main>
    </div>
  );
};

export default AdminPanel;