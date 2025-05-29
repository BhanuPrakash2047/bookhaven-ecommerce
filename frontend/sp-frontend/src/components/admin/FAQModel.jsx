import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBookFAQ } from '../../store/middleware/booksMiddleware';
import { selectFaqsLoading } from '../../store/slices/booksSlice';
// FAQ Modal Component
const FAQModal = ({ bookTitle, onClose, onComplete }) => {
  const dispatch = useDispatch();
  const faqsLoading = useSelector(selectFaqsLoading);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBookFAQ({
      bookId:bookTitle,
      faqData: { question, answer },

    })).then(() => {
      onComplete();
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add FAQ for "{bookTitle}"
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question
            </label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Answer
            </label>
            <textarea
              rows={4}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={faqsLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 flex items-center"
            >
              {faqsLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
              Add FAQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default FAQModal;