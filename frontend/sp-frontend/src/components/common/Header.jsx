/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Bell, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Home,
  Book,
  Grid3X3,
  MapPin,
  Shield,
  Package,
  Star
} from 'lucide-react';
import CartIcon from '../cart/CartIcon';
import NotificationIcon from '../notifications/NotificationBell';
import { logout, selectIsAuthenticated} from '../../store/slices/authSlice';
import { useDispatch ,useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Header = () => {
   const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const isLoggedIn = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
 
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    console.log("Header component mounted");
  }, [isLoggedIn]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleLogout = () => {
    console.log("Loggins out");
    if(isLoggedIn===true){
    dispatch(logout());
    navigate('/auth');
    }
    else{
      navigate('/auth');
    }


    }

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Books', href: '/books/Programming', icon: Book },
    { name: 'Categories', href: '/', icon: Grid3X3 },
    { name: 'Addresses', href: '/address', icon: MapPin },
    { name: 'Admin', href: '/admin', icon: Shield },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'Recommendations', href: '/recommendations', icon: Star },
  ];

  return (
    <div className={`${isDark ? 'dark' : ''}`}>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-white dark:bg-gray-900 shadow-sm'
      } border-b border-gray-200 dark:border-gray-700`}>
        
        {/* Top Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 text-white py-2.5 text-center relative overflow-hidden"
        >
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
          <div className="relative z-10 flex items-center justify-center space-x-2 text-sm font-medium">
            <span>📚</span>
            <span className="hidden sm:inline">Free shipping on orders over $50!</span>
            <span className="sm:hidden">Free shipping $50+!</span>
            <span className="hidden md:inline">Use code BOOKWORM for 15% off</span>
          </div>
        </motion.div>
        
        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex-shrink-0 cursor-pointer"
            >
              <Link to="/">
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                  BookHaven
                </h1>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.slice(0, 4).map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.href}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
                  >
                    <item.icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
              
              {/* More Menu */}
              <div className="relative group">
                <motion.button 
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  <Grid3X3 size={16} />
                  <span>More</span>
                </motion.button>
                
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {navigationItems.slice(4).map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      <item.icon size={16} />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
            
            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </motion.button>
              
  
                <NotificationIcon />

              
              {/* Cart & Wishlist */}
              <div className="hidden md:flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/cart"
                    className="p-2.5 bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg inline-block"
                  >
                    <ShoppingBag size={18} />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/wishlist"
                    className="p-2.5 bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg inline-block"
                  >
                    <Heart size={18} />
                  </Link>
                </motion.div>
              </div>
              
              {/* User Avatar */}
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold cursor-pointer shadow-md"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <User size={18} />
              </motion.div>

              {/* Login/Logout */}

              <motion.button
                onClick={
        handleLogout
                }
                className="hidden lg:block px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoggedIn ? 'Logout' : 'Login'}
              </motion.button>
              
              {/* Mobile Menu Button */}
              <motion.button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={isMobileMenuOpen ? "open" : "closed"}
                  variants={{
                    open: { rotate: 180 },
                    closed: { rotate: 0 }
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="px-4 py-4 space-y-1 max-h-96 overflow-y-auto">
                {navigationItems.map((item) => (
                  <motion.div
                    key={item.name}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Cart & Wishlist */}
                <div className="md:hidden space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <motion.div
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to="/cart"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <CartIcon />
                      <span>Cart</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to="/wishlist"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart size={18} />
                      <span>Wishlist</span>
                    </Link>
                  </motion.div>
                </div>
                
                <motion.button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium"
                  whileHover={{ x: 5 }}
                >
                  <User size={18} />
                  <span>{isLoggedIn ? 'Logout' : 'Login'}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};

export default Header;