import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole]   = useState(() => localStorage.getItem('role'));
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));

  // A helper to construct the "user" object from individual stored parts if needed
  // Alternatively, other files can just use useAuth() and get token, role, and userId directly.
  const user = token ? { userId, role, email: localStorage.getItem('email') } : null;

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const resData = response.data.data;
    
    if (resData && resData.accessToken) {
      localStorage.setItem('token', resData.accessToken);
      localStorage.setItem('userId', resData.userId);
      localStorage.setItem('email', resData.email);
      localStorage.setItem('role', resData.role);
      
      setToken(resData.accessToken);
      setUserId(resData.userId);
      setRole(resData.role);

      return resData;
    }
    throw new Error('Invalid response format');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      
      setToken(null);
      setUserId(null);
      setRole(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, role, userId, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
