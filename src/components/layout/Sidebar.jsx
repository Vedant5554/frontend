import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Users, GraduationCap, Building, 
  Bed, FileText, Receipt, LogOut, FileBarChart, BookOpen, Settings
} from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useAuth();
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
    <aside className="w-20 bg-card m-3 rounded-xl flex flex-col items-center py-8 shrink-0 z-10 border border-subtle relative">
      {/* Brand Icon */}
      <div className="mb-10 w-10 h-10 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-transform hover:scale-105">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H22L12 2Z" fill="#000000" />
        </svg>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col gap-4 flex-grow w-full px-3 overflow-y-auto modal-scroll">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                title={item.name}
                className={`nav-link flex items-center justify-center w-full h-12 rounded-lg ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
              </Link>
            );
          })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-4 mt-auto pt-4 w-full px-3 shrink-0">
          <button className="nav-link flex items-center justify-center w-full h-12 rounded-lg" title="Settings">
              <Settings className="w-5 h-5 text-muted" strokeWidth={2} />
          </button>
          <button onClick={logout} className="nav-link flex items-center justify-center w-full h-12 rounded-lg hover:text-danger-accent group" title="Sign Out">
              <LogOut className="w-5 h-5 text-muted group-hover:text-danger-accent transition-colors" strokeWidth={2} />
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;
