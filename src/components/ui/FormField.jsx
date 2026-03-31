export const FormField = ({ 
  label, type = 'text', options = [], className = '', 
  required, placeholder, ...props 
}) => {
  const baseInput = 'w-full px-4 py-2 text-sm bg-[#050505] border border-[#333333] hover:border-[#666666] rounded-xl text-white placeholder:text-[#666666] focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 disabled:bg-[#111111] disabled:text-[#666666] disabled:border-[#222222] disabled:cursor-not-allowed';

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
        <label className="block text-sm font-medium text-[#888888] tracking-wide mb-2">
          {label}
          {required && <span className="text-[#ff0000] ml-1">*</span>}
        </label>
      )}
      {renderInput()}
    </div>
  );
};
