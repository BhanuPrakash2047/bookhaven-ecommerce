import React from 'react';

const BookHavenSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-orange-400 h-12 flex items-center justify-center">
        <div className="h-4 bg-orange-300 rounded w-80 animate-pulse"></div>
      </div>
      
      {/* Navigation Skeleton */}
      <div className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="flex space-x-8">
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 bg-orange-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section Skeleton (for homepage) */}
        <div className="bg-orange-300 rounded-lg p-12 mb-12">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-12 bg-orange-400 rounded w-96 mb-4 animate-pulse"></div>
              <div className="h-12 bg-orange-400 rounded w-80 mb-6 animate-pulse"></div>
              <div className="h-6 bg-orange-400 rounded w-full max-w-lg mb-2 animate-pulse"></div>
              <div className="h-6 bg-orange-400 rounded w-4/5 max-w-md mb-8 animate-pulse"></div>
              <div className="flex space-x-4">
                <div className="h-12 bg-white bg-opacity-20 rounded-full w-32 animate-pulse"></div>
                <div className="h-12 bg-white bg-opacity-20 rounded-full w-28 animate-pulse"></div>
              </div>
            </div>
            <div className="h-24 w-24 bg-orange-400 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Page Title and Search Skeleton (for catalog pages) */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 max-w-lg">
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Skeleton */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              
              {/* Filter Sections */}
              {[1, 2, 3, 4].map((section) => (
                <div key={section} className="mb-6 pb-6 border-b border-gray-100 last:border-b-0">
                  <div className="h-5 bg-gray-200 rounded w-20 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
                    {section === 2 && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex justify-between">
                          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Book Cover Skeleton */}
                  <div className="relative">
                    <div className="aspect-[3/4] bg-gray-200 animate-pulse"></div>
                    <div className="absolute top-3 left-3 h-6 bg-red-200 rounded w-12 animate-pulse"></div>
                    <div className="absolute top-3 right-3 h-6 bg-orange-200 rounded w-16 animate-pulse"></div>
                  </div>
                  
                  {/* Book Details Skeleton */}
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-3 animate-pulse"></div>
                    
                    {/* Rating Skeleton */}
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                      <div className="h-4 bg-gray-200 rounded w-8 ml-2 animate-pulse"></div>
                    </div>
                    
                    {/* Price and Stock Skeleton */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-green-200 rounded w-16 animate-pulse"></div>
                    </div>
                    
                    <div className="h-4 bg-gray-200 rounded w-12 mt-2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Genres Section Skeleton (for homepage) */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-600 rounded-lg p-6 text-center">
                <div className="h-12 w-12 bg-gray-500 rounded mx-auto mb-4 animate-pulse"></div>
                <div className="h-5 bg-gray-500 rounded w-16 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookHavenSkeleton;