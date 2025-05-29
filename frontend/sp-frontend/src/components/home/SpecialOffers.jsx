/* eslint-disable no-unused-vars */
// src/components/SpecialOffers.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SpecialOffers = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          Special Offers
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Don't miss out on these amazing deals and exclusive offers
        </p>

        {/* Offer Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {/* Student Discount */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-[#22C55E] rounded-lg shadow-md p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Student Discount</h3>
            <p className="text-white mb-6">
              Students get 25% off all textbooks and academic materials. Verify your student status and start saving today!
            </p>
            <button className="bg-white text-[#22C55E] hover:bg-[#16A34A] hover:text-white font-bold py-2 px-4 rounded-full">
              Claim Discount
            </button>
          </motion.div>

          {/* Book Club Special */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="bg-[#E23744] rounded-lg shadow-md p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Book Club Special</h3>
            <p className="text-white mb-6">
              Join our monthly book club and get exclusive access to author events, early releases, and member-only discounts.
            </p>
            <button className="bg-white text-[#E23744] hover:bg-[#CC2635] hover:text-white font-bold py-2 px-4 rounded-full">
              Join Now
            </button>
          </motion.div>

          {/* Weekend Flash Sale */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
            className="bg-[#F59E0B] rounded-lg shadow-md p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Weekend Flash Sale</h3>
            <p className="text-white mb-6">
              This weekend only! Get up to 50% off bestsellers, free shipping, and a bonus bookmark with every purchase.
            </p>
            <button className="bg-white text-[#F59E0B] hover:bg-[#F04554] hover:text-white font-bold py-2 px-4 rounded-full">
              Shop Sale
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;