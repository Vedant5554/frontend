import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const AppLayout = () => {
  const { user } = useAuth();

  return (
    <div className="h-screen flex bg-[var(--color-app-bg)] relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary-accent)] rounded-full blur-[120px] opacity-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-20 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[100px] opacity-[0.03] pointer-events-none -translate-x-1/2 translate-y-1/3"></div>

      <div className="w-full overflow-hidden relative h-full flex z-10">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative scroll-smooth p-6 pl-2 modal-scroll">
          {/* Top Header extracted here for global presence */}
          <header className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 px-4 shrink-0">
            {/* Brand / Logo Area */}
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl tracking-tighter bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-text-muted)] bg-clip-text text-transparent">UAMS</span>
            </div>


            <div className="flex-1" />

            {/* User Profile */}
            <div className="flex items-center gap-3 bg-[var(--color-card)]/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--color-subtle)] cursor-pointer hover:border-[var(--color-primary-accent)]/50 shadow-sm transition-all duration-300 group">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight">{user?.email || 'Admin'}</div>
                <div className="text-[10px] text-[var(--color-primary-accent)] font-bold uppercase tracking-widest">{user?.role || 'System Admin'}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-surface-hover)] to-[var(--color-card)] border border-[var(--color-border)] flex items-center justify-center group-hover:border-[var(--color-primary-accent)]/50 transition-colors shadow-inner">
                <span className="font-bold text-xs text-[var(--color-text-primary)]">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 relative flex flex-col">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
