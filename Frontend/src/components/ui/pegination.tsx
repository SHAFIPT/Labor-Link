import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5; // Adjust based on screen size

  // Function to generate page numbers dynamically
  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <nav className="inline-flex rounded-md shadow-sm bg-gray-900 p-1" aria-label="Pagination">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* First Page (if needed) */}
        {currentPage > 3 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
            >
              1
            </button>
            <span className="px-2 py-2 text-gray-500">...</span>
          </>
        )}

        {/* Visible Page Numbers */}
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-2 border border-gray-700 text-sm font-medium ${
              pageNum === currentPage
                ? "bg-indigo-700 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            aria-current={pageNum === currentPage ? "page" : undefined}
          >
            {pageNum}
          </button>
        ))}

        {/* Last Page (if needed) */}
        {currentPage < totalPages - 2 && (
          <>
            <span className="px-2 py-2 text-gray-500">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>

      {/* Page info */}
      <div className="text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
