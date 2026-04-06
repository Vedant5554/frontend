export const FormField = ({ 
  label, type = 'text', options = [], className = '', 
  required, placeholder, ...props 
}) => {
  const baseInput = 'w-full px-4 py-2 text-sm bg-[var(--color-surface-secondary)] border border-[var(--color-border)] hover:border-[var(--color-muted)] rounded-xl text-[var(--color-text-primary)] placeholder:text-[#666666] focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 disabled:bg-[var(--color-surface-hover)] disabled:text-[#666666] disabled:border-[var(--color-border-light)] disabled:cursor-not-allowed';

  const renderInput = () => {
    if (type === 'select') {
      return (
        <select className={`${baseInput} cursor-pointer appearance-none`} required={required} {...props}>
          <option value="">— Select —</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }
    if (type === 'textarea') {
      return (
        <textarea
          className={`${baseInput} resize-none min-h-[100px]`}
          required={required}
          placeholder={placeholder}
          rows={3}
          {...props}
        />
      );
    }
    return (
      <input
        type={type}
        className={baseInput}
        required={required}
        placeholder={placeholder}
        {...props}
      />
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-muted)] tracking-wide mb-2">
          {label}
          {required && <span className="text-[#ff0000] ml-1">*</span>}
        </label>
      )}
      {renderInput()}
    </div>
  );
};
