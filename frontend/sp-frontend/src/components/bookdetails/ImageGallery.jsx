import { X } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Image Gallery Component
const ImageGallery = ({ images, isOpen, onClose, currentIndex, setCurrentIndex }) => {
  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <X size={32} />
      </button>
      
      <button
        onClick={prevImage}
        className="absolute left-4 text-white hover:text-gray-300 z-10"
      >
        <ChevronLeft size={48} />
      </button>
      
      <button
        onClick={nextImage}
        className="absolute right-4 text-white hover:text-gray-300 z-10"
      >
        <ChevronRight size={48} />
      </button>

      <div className="max-w-4xl max-h-full p-4">
        <img
          src={images[currentIndex]?.imageBlob ? 
            `data:image/png;base64,${images[currentIndex].imageBlob}` : 
            '/api/placeholder/800/600'
          }
          alt={images[currentIndex]?.altText || 'Book image'}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
export default ImageGallery;