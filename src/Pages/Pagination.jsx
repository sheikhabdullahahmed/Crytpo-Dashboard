import React, { useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const delta = 2; // Number of pages on each side

  // ✅ Generate pagination range using useMemo
  const pageNumbers = useMemo(() => {
    const range = [];
    const rangeWithDots = [];

    // Middle range around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Handle start and dots
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      for (let i = 1; i < Math.max(2, currentPage - delta); i++) {
        rangeWithDots.push(i);
      }
    }

    rangeWithDots.push(...range);

    // Handle end and dots
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      for (
        let i = Math.min(totalPages - delta, totalPages - 1);
        i <= totalPages;
        i++
      ) {
        if (!rangeWithDots.includes(i)) rangeWithDots.push(i);
      }
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  // ✅ If no pages to show
  if (totalPages <= 1) return null;

  // ✅ Handlers to prevent invalid navigation
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 select-none">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 border hover:bg-gray-50 hover:border-blue-500"
        }`}
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span
            key={`dots-${index}`}
            className="flex items-center justify-center w-10 h-10 text-gray-500"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
             onClick={() => {
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: "smooth" }); // 👈 Scroll to top here
          }}
            
            className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-md"
                : "text-white hover:text-blue-500"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 border hover:bg-gray-50 hover:border-blue-500"
        }`}
      >
        <FaChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
