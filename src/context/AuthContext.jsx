import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken') || '',
    admin_id: localStorage.getItem('admin_id') || sessionStorage.getItem('admin_id') || ''
  });

  const login = (token, rememberMe, admin_id) => {
    if (rememberMe) {
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('admin_id', admin_id);
    } else {
      sessionStorage.setItem('jwtToken', token);
      sessionStorage.setItem('admin_id', admin_id);
    }
    setAuthState({ token, admin_id });
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    sessionStorage.removeItem('jwtToken');
    localStorage.removeItem('admin_id');
    sessionStorage.removeItem('admin_id');
    setAuthState({ token: '', admin_id: '' });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
