import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';

// Views
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import Students from './pages/Students';
import Advisers from './pages/Advisers';
import Staff from './pages/Staff';
import Halls from './pages/Halls';
import Apartments from './pages/Apartments';
import Leases from './pages/Leases';
import Invoices from './pages/Invoices';
import Courses from './pages/Courses';
import Reports from './pages/Reports';
// Role Views
import { RoleGuard } from './components/layout/RoleGuard';
import { useRole } from './hooks/useRole';
import MyProfile from './pages/role-views/MyProfile';
import MyLease from './pages/role-views/MyLease';
import MyInvoices from './pages/role-views/MyInvoices';
import MyAdviser from './pages/role-views/MyAdviser';
import MyStudents from './pages/role-views/MyStudents';
import MyCourses from './pages/role-views/MyCourses';

const ComingSoon = ({ title }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-slate-600">{title}</h2>
      <p className="text-slate-400 mt-2">This page is coming soon.</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Simple wrapper to pass userId/role to components that need it
const ProfileWrapper = () => {
  const { userId, role } = useRole();
  return <MyProfile userId={userId} role={role} />;
};
const LeaseWrapper = () => {
  const { userId } = useRole();
  return <MyLease userId={userId} />;
};
const InvoicesWrapper = () => {
  const { userId } = useRole();
  return <MyInvoices userId={userId} />;
};
const AdviserWrapper = () => {
  const { userId } = useRole();
  return <MyAdviser userId={userId} />;
};
const StudentsWrapper = () => {
  const { userId } = useRole();
  return <MyStudents userId={userId} />;
};
const CoursesWrapper = () => {
  const { userId } = useRole();
  return <MyCourses userId={userId} />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        {/* Universal Protected Routes */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* STUDENT ONLY */}
        <Route path="my-profile" element={<RoleGuard allowedRoles={['STUDENT', 'ADVISER']}><ProfileWrapper /></RoleGuard>} />
        <Route path="my-lease" element={<RoleGuard allowedRoles={['STUDENT']}><LeaseWrapper /></RoleGuard>} />
        <Route path="my-invoices" element={<RoleGuard allowedRoles={['STUDENT']}><InvoicesWrapper /></RoleGuard>} />
        <Route path="my-adviser" element={<RoleGuard allowedRoles={['STUDENT']}><AdviserWrapper /></RoleGuard>} />
        <Route path="my-courses" element={<RoleGuard allowedRoles={['STUDENT']}><CoursesWrapper /></RoleGuard>} />

        {/* ADVISER ONLY */}
        <Route path="my-students" element={<RoleGuard allowedRoles={['ADVISER']}><StudentsWrapper /></RoleGuard>} />

        {/* ADVISER & STAFF */}
        <Route path="reports" element={<RoleGuard allowedRoles={['ADVISER', 'STAFF']}><Reports /></RoleGuard>} />

        {/* STAFF ONLY */}
        <Route path="students" element={<RoleGuard allowedRoles={['STAFF']}><Students /></RoleGuard>} />
        <Route path="advisers" element={<RoleGuard allowedRoles={['STAFF']}><Advisers /></RoleGuard>} />
        <Route path="staff" element={<RoleGuard allowedRoles={['STAFF']}><Staff /></RoleGuard>} />
        <Route path="halls" element={<RoleGuard allowedRoles={['STAFF']}><Halls /></RoleGuard>} />
        <Route path="apartments" element={<RoleGuard allowedRoles={['STAFF']}><Apartments /></RoleGuard>} />
        <Route path="leases" element={<RoleGuard allowedRoles={['STAFF']}><Leases /></RoleGuard>} />
        <Route path="invoices" element={<RoleGuard allowedRoles={['STAFF']}><Invoices /></RoleGuard>} />
        
        {/* Assuming Courses can be seen by Staff, maybe Students. PRD table says Courses only STAFF. So STAFF only. */}
        <Route path="courses" element={<RoleGuard allowedRoles={['STAFF']}><Courses /></RoleGuard>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
