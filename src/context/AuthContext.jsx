import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Attempt to fetch current profile from backend
          const res = await api.get('/auth/me');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          // If server call fails or backend not up, keep local stored user if available
          console.log('Backend sync offline or auth check skipped:', err.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: jwtToken, user: userData } = response.data;

      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, data: response.data };
    } catch (error) {
      console.warn('API Login failed, checking mock demo mode fallback:', error);
      
      // Fallback for visual preview if backend is not currently running
      if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        const mockUser = {
          id: 'demo-user-1',
          name: email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Fitness Enthusiast',
          email: email,
        };
        const mockToken = 'demo-jwt-token-xyz-123';
        
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true, isDemo: true, data: { token: mockToken, user: mockUser } };
      }

      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token: jwtToken, user: userData } = response.data;

      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, data: response.data };
    } catch (error) {
      console.warn('API Registration failed, checking mock demo fallback:', error);

      if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          name: name,
          email: email,
        };
        const mockToken = 'demo-jwt-token-' + Date.now();
        
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true, isDemo: true, data: { token: mockToken, user: mockUser } };
      }

      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
