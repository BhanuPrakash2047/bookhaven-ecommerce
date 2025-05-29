
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadBookImages } from '../../store/middleware/booksMiddleware';
import { selectImagesLoading } from '../../store/slices/booksSlice';
import { X } from 'lucide-react';


// Image Upload Component
const ImageUploadModal = ({ bookTitle, onClose, onComplete }) => {

  const dispatch = useDispatch();
  const imagesLoading = useSelector(selectImagesLoading);
  const [files, setFiles] = useState([]);
  const [altTexts, setAltTexts] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setAltTexts(new Array(selectedFiles.length).fill(''));
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    
    dispatch(uploadBookImages({
      title:bookTitle,
      files,
      mainImageIndex,
      altTexts: altTexts.filter(text => text.trim() !== ''),
    })).then(() => {
      onComplete();
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upload Images for "{bookTitle}"
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {files.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Main Image
              </label>
              <select
                value={mainImageIndex}
                onChange={(e) => setMainImageIndex(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                {files.map((file, index) => (
                  <option key={index} value={index}>
                    {file.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {files.map((file, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alt Text for {file.name}
              </label>
              <input
                type="text"
                value={altTexts[index] || ''}
                onChange={(e) => {
                  const newAltTexts = [...altTexts];
                  newAltTexts[index] = e.target.value;
                  setAltTexts(newAltTexts);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Skip
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || imagesLoading}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 flex items-center"
          >
            {imagesLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
            Upload Images
          </button>
        </div>
      </div>
    </div>
  );
};
export default ImageUploadModal