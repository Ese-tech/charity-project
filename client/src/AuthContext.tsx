import React, { createContext, useState,  useContext, type ReactNode } from 'react';

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
  updateUserInfo: (data: UserInfo) => void; // <-- New function to update user info
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const storedUser = localStorage.getItem('userInfo');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (data: UserInfo) => {
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };
  
  const updateUserInfo = (data: UserInfo) => {
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};