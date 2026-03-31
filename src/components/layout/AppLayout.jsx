import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const AppLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="h-screen bg-[#000000] flex">
      <div className="w-full app-bg overflow-hidden relative h-full flex">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative scroll-smooth p-6 pl-2 modal-scroll">
          {/* Top Header extracted here for global presence */}
          <header className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 px-4 shrink-0">
            {/* Brand / Logo Area */}
            <div className="flex items-center gap-2">
                <span className="font-display font-bold text-2xl tracking-tighter">UAMS</span>
            </div>


            <div className="flex-1" />

            {/* User Profile */}
            <div className="flex items-center gap-3 bg-card px-3 py-1.5 rounded-lg border border-subtle cursor-pointer hover:border-[#666] transition-colors">
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-semibold text-white leading-tight">{user?.email || 'Admin'}</div>
                    <div className="text-[10px] text-muted font-medium uppercase tracking-widest">{user?.role || 'System Admin'}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#222] border border-[#333] flex items-center justify-center">
                    <span className="font-bold text-xs text-white">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
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
