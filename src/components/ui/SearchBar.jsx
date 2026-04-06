import { Search } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 text-sm bg-card border border-subtle rounded-xl text-[var(--color-text-primary)] placeholder:text-muted focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 hover:border-[#666]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
