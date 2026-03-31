import { useAuth } from '../context/AuthContext';

export const useRole = () => {
  const { user } = useAuth();
  
  // user.role should be 'STUDENT', 'ADVISER', or 'STAFF'
  // userId corresponds to studentId, adviserId, or staffId respectively
  return {
    role: user?.role || null,
    userId: user?.userId || null,
    isStudent: user?.role === 'STUDENT',
    isAdviser: user?.role === 'ADVISER',
    isStaff: user?.role === 'STAFF',
    user
  };
};
