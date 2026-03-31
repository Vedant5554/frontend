export const StatCard = ({ title, value, icon: Icon, colorClass = 'text-white border-subtle' }) => {
  return (
    <div className="bg-card rounded-xl border border-subtle p-6 hover:border-[#666] transition-colors relative overflow-hidden group">
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-muted mb-3 tracking-widest uppercase truncate">{title}</p>
          <p className="font-display text-4xl font-bold tracking-tighter text-white">{value}</p>
        </div>
        {Icon && (
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border bg-[#111] ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};
