/* eslint-disable no-unused-vars */
import {motion} from 'framer-motion';



const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-4">BookHaven</h3>
            <p className="text-gray-300 mb-4">
              Your trusted literary companion since 2020. We're passionate about connecting readers with their next favorite book.
            </p>
            <div className="flex space-x-4">
              {['📘', '🐦', '📷', '💼'].map((icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white hover:from-orange-600 hover:to-red-600 transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold text-orange-500 mb-4">Shop</h3>
            <ul className="space-y-2">
              {['New Releases', 'Bestsellers', 'Award Winners', 'Pre-orders', 'Gift Cards'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-orange-500 mb-4">Support</h3>
            <ul className="space-y-2">
              {['Help Center', 'Shipping Info', 'Returns', 'Track Order', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Community Links */}
          <div>
            <h3 className="text-lg font-semibold text-orange-500 mb-4">Community</h3>
            <ul className="space-y-2">
              {['Book Club', 'Author Events', 'Reading Challenges', 'Book Reviews', 'Literary Blog'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 BookHaven. All rights reserved. Made with ❤️ for book lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;