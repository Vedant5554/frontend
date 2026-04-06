import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Table = ({ columns, data, isLoading, pagination = false, pageSize = 20 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when data heavily changes (like during a search filter)
  useEffect(() => {
    setCurrentPage(1);
  }, [data?.length]);

  const totalPages = data ? Math.ceil(data.length / pageSize) : 0;
  
  const currentData = pagination && data
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : data;

  if (isLoading) {
    return (
      <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
        <div className="p-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 mb-4 last:mb-0">
              {columns.map((_, j) => (
                <div key={j} className="h-5 flex-1 bg-[var(--color-subtle)] rounded animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">No records found</p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest bg-[var(--color-card)]"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222222] dark:divide-white/5">
            {currentData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-[var(--color-surface-hover)] transition-colors duration-150 group"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm text-[var(--color-text-secondary)] whitespace-nowrap group-hover:text-[var(--color-text-primary)] transition-colors">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-card)]/50">
          <span className="text-xs text-[var(--color-text-muted)]">
            Showing <span className="font-semibold text-[var(--color-text-primary)]">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-semibold text-[var(--color-text-primary)]">{Math.min(currentPage * pageSize, data.length)}</span> of <span className="font-semibold text-[var(--color-text-primary)]">{data.length}</span> results
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1 mx-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Only show a few pages around the current page to prevent massive lists
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 flex items-center justify-center rounded-md text-sm font-semibold transition-colors 
                        ${currentPage === pageNum 
                          ? 'bg-[var(--color-primary-accent)] text-white shadow-sm shadow-[var(--color-primary-accent)]/20' 
                          : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="text-[var(--color-text-muted)] tracking-widest text-xs px-1">...</span>;
                }
                return null;
              })}
            </div>

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
