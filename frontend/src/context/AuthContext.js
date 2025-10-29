import React, { useContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    const loginTime = localStorage.getItem('loginTime');

    if (token && userData && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime, 10);
      if (elapsed < SESSION_TIMEOUT) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setCurrentUser(JSON.parse(userData));
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token, user, role } = res.data;

    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('role', role);
    localStorage.setItem('loginTime', Date.now().toString());
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setCurrentUser(user);
    return role;
  };

  const signup = async (name, email, password) => {
    const res = await API.post('/auth/signup', { name, email, password });
    const { token, user } = res.data;

    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('loginTime', Date.now().toString());
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('loginTime');
    delete API.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  // ✅ Add updateUser() — the missing function
  const updateUser = (updatedUser) => {
    if (!updatedUser) return;
    setCurrentUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  // 🔁 Auto-logout after timeout
  useEffect(() => {
    const interval = setInterval(() => {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime) {
        const elapsed = Date.now() - parseInt(loginTime, 10);
        if (elapsed >= SESSION_TIMEOUT) logout();
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateUser, // ✅ Include this so other components can access it
    loading,
    setCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div className="text-center mt-5">Loading...</div> : children}
    </AuthContext.Provider>
  );
}
