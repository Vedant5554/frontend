export const StatCard = ({ title, value, icon: Icon, colorClass = 'text-[var(--color-primary-accent)]', delay = 0 }) => {
  return (
    <div 
      className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-xl shadow-black/5 p-6 hover:-translate-y-1 hover:shadow-2xl hover:border-[var(--color-primary-accent)] transition-all duration-400 relative overflow-hidden group animate-fade-up-stagger"
      style={{ animationDelay: `${delay}ms` }}
    >
      
      {/* Decorative gradient blur in background */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--color-surface-hover)] rounded-full blur-3xl opacity-50 group-hover:bg-[var(--color-primary-accent)] group-hover:opacity-20 transition-colors duration-500 pointer-events-none"></div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-[var(--color-text-muted)] mb-3 tracking-widest uppercase truncate">{title}</p>
          <p className="font-display text-4xl font-bold tracking-tighter text-[var(--color-text-primary)]">{value}</p>
        </div>
        {Icon && (
          <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
            {/* Ambient tinted background based on current text color */}
            <div className="absolute inset-0 bg-current opacity-[0.15] rounded-full"></div>
            <Icon className="w-5 h-5 relative z-10" />
          </div>
        )}
      </div>
    </div>
  );
};
