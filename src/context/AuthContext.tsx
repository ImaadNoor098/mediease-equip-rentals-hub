
import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
};

type RegisterData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<Map<string, { password: string; userData: User }>>(new Map());

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check if user exists in our registered users
    const userRecord = registeredUsers.get(email);
    
    if (!userRecord) {
      return { success: false, error: 'ACCOUNT_NOT_FOUND' };
    }
    
    if (userRecord.password !== password) {
      return { success: false, error: 'WRONG_CREDENTIALS' };
    }
    
    // Successful login
    setUser(userRecord.userData);
    return { success: true };
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address
    };
    
    // Store user in our mock database
    registeredUsers.set(userData.email, {
      password: userData.password,
      userData: newUser
    });
    
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
