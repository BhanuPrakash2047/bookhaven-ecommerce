/* eslint-disable no-unused-vars */
import { AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LegendSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-26 bg-gradient-to-br from-orange-400 via-orange-500 to-red-400 text-white relative overflow-hidden">
      {/* Enhanced Background Pattern with layered depth */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.15'%3E%3Crect x='8' y='8' width='6' height='84' fill='white' rx='3'/%3E%3Crect x='22' y='12' width='6' height='76' fill='white' rx='3'/%3E%3Crect x='36' y='4' width='6' height='92' fill='white' rx='3'/%3E%3Crect x='50' y='16' width='6' height='68' fill='white' rx='3'/%3E%3Crect x='64' y='10' width='6' height='80' fill='white' rx='3'/%3E%3Crect x='78' y='6' width='6' height='88' fill='white' rx='3'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }}></div>
        
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5"></div>
      </div>
      
      {/* Refined Floating Elements */}
      <motion.div 
        className="absolute top-12 right-12 text-5xl opacity-15 select-none"
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, 3, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        📚
      </motion.div>
      
      <motion.div 
        className="absolute bottom-16 left-16 text-4xl opacity-10 select-none"
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -2, 0]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        ✨
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ 
              duration: 0.9,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Your Next Great Read
                  Awaits
              </motion.h1>                
              <motion.p 
                className="text-lg md:text-xl opacity-90 leading-relaxed font-light max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover thousands of books across every genre. From bestsellers to hidden gems, 
                find your perfect match in our carefully curated collection.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                className="group px-8 py-4 bg-white text-orange-600 rounded-full font-semibold text-lg 
                         shadow-lg hover:shadow-xl transition-all duration-300 
                         border border-white/20 backdrop-blur-sm
                         hover:bg-orange-50 active:scale-95"
                whileHover={{ 
                  scale: 1.02, 
                  y: -3,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { navigate("books/all") }}
              >
                <span className="flex items-center gap-2">
                  Explore Books
                  <motion.span
                    className="inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
              
              <motion.button
                className="px-8 py-4 border-2 border-white/80 text-white rounded-full font-semibold text-lg 
                         hover:bg-white/10 hover:border-white transition-all duration-300
                         backdrop-blur-sm active:scale-95"
                whileHover={{ 
                  scale: 1.02, 
                  y: -3,
                  backgroundColor: "rgba(255,255,255,0.15)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { navigate("books/all") }}
              >
                View Deals
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ 
              duration: 0.9, 
              delay: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <motion.div
              className="relative"
              animate={{ 
                y: [0, -12, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="text-8xl md:text-9xl opacity-95 select-none filter drop-shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 10,
                  transition: { duration: 0.3 }
                }}
              >
                📖
              </motion.div>
              
              {/* Subtle glow effect */}
              <motion.div
                className="absolute inset-0 text-8xl md:text-9xl opacity-20 blur-sm select-none"
                animate={{
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                📖
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/5 to-transparent"></div>
    </section>
  );
};

export default LegendSection;