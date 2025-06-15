
import { User } from '@/types/auth';

export type UserRecord = { password: string; userData: User };

export const loadRegisteredUsers = (): Map<string, UserRecord> => {
  const storedUsers = localStorage.getItem('registeredUsers');
  if (storedUsers) {
    try {
      const usersData = JSON.parse(storedUsers);
      const usersMap = new Map<string, UserRecord>();
      Object.entries(usersData).forEach(([email, userData]) => {
        usersMap.set(email, userData as UserRecord);
      });
      return usersMap;
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
    }
  }
  return new Map();
};

export const saveRegisteredUsers = (users: Map<string, UserRecord>): void => {
  if (users.size > 0) {
    const usersData = Object.fromEntries(users);
    localStorage.setItem('registeredUsers', JSON.stringify(usersData));
  }
};

export const loadCurrentUser = (): User | null => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      console.log('AuthProvider: Loaded user from localStorage:', userData);
      return userData;
    } catch (error) {
      console.error('Error loading current user from localStorage:', error);
      localStorage.removeItem('currentUser');
    }
  }
  return null;
};

export const saveCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    console.log('AuthProvider: Saved user to localStorage:', user);
  } else {
    localStorage.removeItem('currentUser');
  }
};
