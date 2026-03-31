
import { Navigate } from 'react-router-dom';
import { useRole } from '../../hooks/useRole';

export const RoleGuard = ({ children, allowedRoles }) => {
  const { role } = useRole();

  if (!role || !allowedRoles.includes(role)) {
    // Redirect to dashboard if user's role is not authorized for this route
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
