const colorMap = {
  indigo: 'bg-white/10 text-white ring-white/20',
  blue: 'bg-white/10 text-white ring-white/20',
  green: 'bg-success-accent/10 text-success-accent ring-1 ring-inset ring-success-accent/20',
  amber: 'bg-warning-accent/10 text-warning-accent ring-1 ring-inset ring-warning-accent/20',
  red: 'bg-danger-accent/10 text-danger-accent ring-1 ring-inset ring-danger-accent/20',
  gray: 'bg-[#222222] text-[#888888] ring-1 ring-inset ring-[#444444]',
  purple: 'bg-white/10 text-white ring-white/20',
};

export const Badge = ({ children, color = 'indigo' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors ${colorMap[color] || colorMap.indigo}`}>
      {children}
    </span>
  );
};
