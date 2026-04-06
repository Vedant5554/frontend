import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Home, Users, GraduationCap, Building,
  Bed, FileText, Receipt, LogOut, FileBarChart, BookOpen, Settings,
  Sun, Moon
} from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const role = user?.role || 'STAFF';

  const getNavItems = () => {
    switch (role) {
      case 'STUDENT':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: Home },
          { name: 'My Profile', path: '/my-profile', icon: GraduationCap },
          { name: 'My Adviser', path: '/my-adviser', icon: Users },
          { name: 'My Courses', path: '/my-courses', icon: BookOpen },
          { name: 'My Lease', path: '/my-lease', icon: Bed },
          { name: 'My Invoices', path: '/my-invoices', icon: Receipt }
        ];
      case 'ADVISER':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: Home },
          { name: 'My Students', path: '/my-students', icon: Users },
          { name: 'Reports', path: '/reports', icon: FileBarChart },
          { name: 'My Profile', path: '/my-profile', icon: GraduationCap }
        ];
      case 'STAFF':
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: Home },
          { name: 'Students', path: '/students', icon: Users },
          { name: 'Advisers', path: '/advisers', icon: GraduationCap },
          { name: 'Staff', path: '/staff', icon: Users },
          { name: 'Halls', path: '/halls', icon: Building },
          { name: 'Apartments', path: '/apartments', icon: Bed },
          { name: 'Courses', path: '/courses', icon: BookOpen },
          { name: 'Leases', path: '/leases', icon: FileText },
          { name: 'Invoices', path: '/invoices', icon: Receipt },
          { name: 'Reports', path: '/reports', icon: FileBarChart }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Invisible structural spacer that matches the compressed sidebar footprint */}
      <div className="w-20 m-3 shrink-0 opacity-0 pointer-events-none hidden md:block"></div>

      <aside 
        className="group absolute left-0 top-0 bottom-0 w-20 hover:w-64 m-3 rounded-2xl flex flex-col py-8 z-50 border border-white/10 dark:border-white/5 shadow-2xl shadow-black/10 backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-card) 90%, transparent)' }}
      >
        {/* Brand Icon */}
        <div className="mb-10 flex items-center px-4 shrink-0 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary-accent)] to-[#3b82f6] flex items-center justify-center shrink-0 shadow-lg shadow-[var(--color-primary-accent)]/30 transition-transform">
            <span className="font-display font-black text-white text-xl tracking-tighter">U</span>
          </div>
          <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
             <span className="font-display font-bold text-lg tracking-tight text-[var(--color-text-primary)]">UAMS</span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-2 flex-grow w-full px-4 overflow-y-auto overflow-x-hidden modal-scroll">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                title={item.name}
                className={`nav-link flex items-center w-full h-12 rounded-xl transition-all duration-300 overflow-hidden ${isActive ? 'active bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'}`}
              >
                <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="ml-2 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 mt-auto pt-4 w-full px-4 shrink-0 overflow-hidden">
          <button onClick={toggleTheme} className="nav-link flex items-center w-full h-12 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-warning-accent transition-all duration-300" title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              {isDarkMode ? <Sun className="w-5 h-5 transition-colors" strokeWidth={2} /> : <Moon className="w-5 h-5 transition-colors" strokeWidth={2} />}
            </div>
             <span className="ml-2 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
             </span>
          </button>
          
          <button className="nav-link flex items-center w-full h-12 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-all duration-300" title="Settings">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              <Settings className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="ml-2 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Settings
             </span>
          </button>

          <button onClick={logout} className="nav-link flex items-center w-full h-12 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-danger-accent)]/10 hover:text-[var(--color-danger-accent)] transition-all duration-300 group" title="Sign Out">
            <div className="w-12 h-12 shrink-0 flex items-center justify-center">
              <LogOut className="w-5 h-5 transition-colors" strokeWidth={2} />
            </div>
            <span className="ml-2 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Sign Out
             </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
