import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBook, deleteBook, fetchAllBooks, updateBook } from "../../store/middleware/booksMiddleware";
import { selectAllBooks, selectBooksLoading, selectBooksError } from "../../store/slices/booksSlice";
import BookCardSkeleton from "./Skeleton";
import BookForm from "./BookForm";
import FAQModal from "./FAQModel";
import ImageUploadModal from "./ImageUpload";
import { Plus ,Search,Trash2,Edit,Grid, List,Image,HelpCircle,AlertCircle,Edit3} from "lucide-react";




const BookManagement = () => {

  const dispatch = useDispatch();
  const books = useSelector(selectAllBooks);
  const loading = useSelector(selectBooksLoading);
  const error = useSelector(selectBooksError);
  
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [currentBookTitle, setCurrentBookTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [workflowStep, setWorkflowStep] = useState('create');

  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  const handleCreateBook = (bookData) => {
    dispatch(createBook(bookData)).then((result) => {
      if (result.type === 'books/create/fulfilled') {
        setShowForm(false);
        setCurrentBookTitle(bookData.title);
        setWorkflowStep('images');
        setShowImageModal(true);
      }
    });
  };

  const handleUpdateBook = (bookData) => {
    dispatch(updateBook({ title: editingBook.title, bookData })).then((result) => {
      if (result.type === 'books/update/fulfilled') {
        setShowForm(false);
        setEditingBook(null);
      }
    });
  };

  const handleDeleteBook = (bookTitle) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      dispatch(deleteBook(bookTitle));
    }
  };

  const handleImagesComplete = () => {
    setShowImageModal(false);
    setWorkflowStep('faqs');
    setShowFAQModal(true);
  };

  const handleFAQComplete = () => {
    setShowFAQModal(false);
    setWorkflowStep('complete');
    setCurrentBookTitle('');
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your book inventory</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search books, authors, genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      )}

      {/* Books Grid/List */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {[...Array(6)].map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{book.genre}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900 dark:text-white">${book.price}</p>
                  {book.discountedPrice && (
                    <p className="text-sm text-green-600 dark:text-green-400">${book.discountedPrice}</p>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p>Stock: {book.quantity}</p>
                <p>Published: {book.yearPublished}</p>
                {book.language && <p>Language: {book.language}</p>}
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  book.quantity > 10 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                    : book.quantity > 0
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                }`}>
                  {book.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setCurrentBookTitle(book.title);
                      console.log("title of book from Image"+book.title)
                      setShowImageModal(true);
                    }}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    title="Manage Images"
                  >
                    <Image className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentBookTitle(book.title);
                      setShowFAQModal(true);
                    }}
                    className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                    title="Manage FAQs"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingBook(book);
                      setShowForm(true);
                    }}
                    className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded"
                    title="Edit Book"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book.title)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Delete Book"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <BookForm
          book={editingBook}
          onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
          onCancel={() => {
            setShowForm(false);
            setEditingBook(null);
          }}
          loading={loading}
        />
      )}

      {showImageModal && (
        <ImageUploadModal
          bookTitle={currentBookTitle}
          onClose={() => {
            console.log("second level"+currentBookTitle)
            setShowImageModal(false);
            if (workflowStep === 'images') {
              setCurrentBookTitle('');
            }
          }}
          onComplete={handleImagesComplete}
        />
      )}

      {showFAQModal && (
        <FAQModal
          bookTitle={currentBookTitle}
          onClose={() => {
            setShowFAQModal(false);
            if (workflowStep === 'faqs') {
              setCurrentBookTitle('');
            }
          }}
          onComplete={handleFAQComplete}
        />
      )}
    </div>
  );
};
export default BookManagement;