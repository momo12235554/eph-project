import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'expo-router';
import { apiClient } from '../services/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  // Restaurer au démarrage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('eph_token');
        const savedUser = localStorage.getItem('eph_user');
        if (savedToken && savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setToken(savedToken);
            setUser(parsedUser);
            apiClient.setToken(savedToken);
            console.log("Session restaurée pour:", parsedUser.prenom);
        }
    }
  }, []);

  const login = (authData) => {
    setUser(authData.user);
    setToken(authData.token);
    apiClient.setToken(authData.token);
    if (typeof window !== 'undefined') {
        localStorage.setItem('eph_user', JSON.stringify(authData.user));
        localStorage.setItem('eph_token', authData.token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    apiClient.setToken(null);
    if (typeof window !== 'undefined') {
        localStorage.removeItem('eph_user');
        localStorage.removeItem('eph_token');
    }
    router.replace('/');
  };



  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

