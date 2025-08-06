import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  userInfo: UserInfo | null;
  login: (data: UserInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    // Initialize from localStorage on first load
    const storedUserInfo = localStorage.getItem('userInfo');
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  });

  // Store userInfo in localStorage whenever it changes
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  const login = (data: UserInfo) => {
    setUserInfo(data);
  };

  const logout = () => {
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};