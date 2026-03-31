import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange, totalRecords, pageSize }) => {
  if (totalPages <= 1) return null;

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const btnBase = 'flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent';

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#222222] px-1">
      <p className="text-sm text-[#888888]">
        Showing <span className="font-semibold text-white">{startRecord}–{endRecord}</span> of{' '}
        <span className="font-semibold text-white">{totalRecords}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} text-[#888888] hover:bg-[#111111] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} ${
              page === currentPage
                ? 'bg-white text-black font-bold border-white'
                : 'text-[#888888] hover:bg-[#111111] hover:text-white hover:border-[#333333]'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} text-[#888888] hover:bg-[#111111] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
