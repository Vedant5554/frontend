export const Table = ({ columns, data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] rounded-xl border border-[#333333] overflow-hidden">
        <div className="p-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 mb-4 last:mb-0">
              {columns.map((_, j) => (
                <div key={j} className="h-5 flex-1 bg-[#222222] rounded animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#0a0a0a] rounded-xl border border-[#333333] p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[#111111] border border-[#333333] flex items-center justify-center mx-auto mb-4">
          <svg className="w-5 h-5 text-[#888888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-white">No records found</p>
        <p className="text-sm text-[#888888] mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] rounded-xl border border-[#333333] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333333]">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left text-[11px] font-bold text-[#888888] uppercase tracking-widest bg-[#0a0a0a]"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222222]">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-[#111111] transition-colors duration-150 group"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm text-[#cccccc] whitespace-nowrap group-hover:text-white transition-colors">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
