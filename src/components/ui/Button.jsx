export const Button = ({ children, variant = 'primary', size = 'md', className = '', isLoading, disabled, ...props }) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap';
  
  const variants = {
    primary: 'bg-white text-black hover:bg-gray-200 shadow-sm',
    outline: 'border border-[#333333] text-white hover:bg-[#111111] hover:border-[#666666] active:bg-[#222222]',
    ghost: 'text-[#888888] hover:bg-[#111111] hover:text-white',
    danger: 'bg-[#ff0000] text-white hover:bg-[#cc0000]',
    success: 'bg-[#50e3c2] text-black hover:bg-[#40c3a2]',
  };

  const sizes = {
    xs: 'px-2.5 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};
