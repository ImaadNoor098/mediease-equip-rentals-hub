
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { UserRecord, loadRegisteredUsers, saveRegisteredUsers, loadCurrentUser, saveCurrentUser } from '@/utils/authStorage';
import { useAuthOperations } from '@/hooks/useAuthOperations';

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
  const [registeredUsers, setRegisteredUsers] = useState<Map<string, UserRecord>>(new Map());

  // Load stored data on initialization
  useEffect(() => {
    setRegisteredUsers(loadRegisteredUsers());
    setUser(loadCurrentUser());
  }, []);

  // Save registered users to localStorage whenever the map changes
  useEffect(() => {
    saveRegisteredUsers(registeredUsers);
  }, [registeredUsers]);

  // Save current user to localStorage whenever user changes
  useEffect(() => {
    saveCurrentUser(user);
  }, [user]);

  const authOperations = useAuthOperations(registeredUsers, setRegisteredUsers, user, setUser);

  const value = {
    user,
    isAuthenticated: !!user,
    ...authOperations,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
