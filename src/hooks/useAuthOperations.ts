
import { useState } from 'react';
import { User, RegisterData, OrderHistoryItem, SavedAddress } from '@/types/auth';
import { UserRecord, saveRegisteredUsers, saveCurrentUser } from '@/utils/authStorage';

export const useAuthOperations = (
  registeredUsers: Map<string, UserRecord>,
  setRegisteredUsers: (users: Map<string, UserRecord>) => void,
  user: User | null,
  setUser: (user: User | null) => void
) => {
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const userRecord = registeredUsers.get(email);
    
    if (!userRecord) {
      return { success: false, error: 'ACCOUNT_NOT_FOUND' };
    }
    
    if (userRecord.password !== password) {
      return { success: false, error: 'WRONG_CREDENTIALS' };
    }
    
    setUser(userRecord.userData);
    return { success: true };
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    if (registeredUsers.has(userData.email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      orderHistory: [],
      savedAddresses: []
    };
    
    const newRegisteredUsers = new Map(registeredUsers);
    newRegisteredUsers.set(userData.email, {
      password: userData.password,
      userData: newUser
    });
    
    setRegisteredUsers(newRegisteredUsers);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    const userRecord = registeredUsers.get(user.email);
    if (userRecord) {
      const newRegisteredUsers = new Map(registeredUsers);
      newRegisteredUsers.set(user.email, {
        ...userRecord,
        userData: updatedUser
      });
      setRegisteredUsers(newRegisteredUsers);
    }
  };

  const addOrder = (order: OrderHistoryItem) => {
    if (!user) {
      console.error('AuthProvider: Cannot add order - no user logged in');
      return;
    }

    console.log('AuthProvider: Adding order for user:', user.email);
    console.log('AuthProvider: Order details:', order);

    const updatedUser = {
      ...user,
      orderHistory: [order, ...(user.orderHistory || [])]
    };
    
    console.log('AuthProvider: Updated order history length:', updatedUser.orderHistory.length);
    
    setUser(updatedUser);

    const userRecord = registeredUsers.get(user.email);
    if (userRecord) {
      const newRegisteredUsers = new Map(registeredUsers);
      newRegisteredUsers.set(user.email, {
        ...userRecord,
        userData: updatedUser
      });
      setRegisteredUsers(newRegisteredUsers);
      
      saveRegisteredUsers(newRegisteredUsers);
      saveCurrentUser(updatedUser);
      
      console.log('AuthProvider: Order added successfully. Total orders:', updatedUser.orderHistory.length);
    } else {
      console.error('AuthProvider: User record not found for:', user.email);
    }
  };

  const deleteOrder = (orderId: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      orderHistory: (user.orderHistory || []).filter(order => order.id !== orderId)
    };
    
    setUser(updatedUser);

    const userRecord = registeredUsers.get(user.email);
    if (userRecord) {
      const newRegisteredUsers = new Map(registeredUsers);
      newRegisteredUsers.set(user.email, {
        ...userRecord,
        userData: updatedUser
      });
      setRegisteredUsers(newRegisteredUsers);
    }
  };

  const bulkDeleteOrders = (orderIds: string[]) => {
    if (!user) return;

    console.log('AuthContext: Bulk deleting orders:', orderIds);

    const updatedUser = {
      ...user,
      orderHistory: (user.orderHistory || []).filter(order => !orderIds.includes(order.id))
    };
    
    setUser(updatedUser);

    const userRecord = registeredUsers.get(user.email);
    if (userRecord) {
      const newRegisteredUsers = new Map(registeredUsers);
      newRegisteredUsers.set(user.email, {
        ...userRecord,
        userData: updatedUser
      });
      setRegisteredUsers(newRegisteredUsers);
    }

    console.log('AuthContext: Bulk delete completed. Remaining orders:', updatedUser.orderHistory?.length || 0);
  };

  const addSavedAddress = (address: Omit<SavedAddress, 'id'>) => {
    if (!user) return;

    const newAddress: SavedAddress = {
      ...address,
      id: Date.now().toString(),
      isDefault: (user.savedAddresses || []).length === 0
    };

    const updatedUser = {
      ...user,
      savedAddresses: [...(user.savedAddresses || []), newAddress]
    };
    
    setUser(updatedUser);

    const userRecord = registeredUsers.get(user.email);
    if (userRecord) {
      const newRegisteredUsers = new Map(registeredUsers);
      newRegisteredUsers.set(user.email, {
        ...userRecord,
        userData: updatedUser
      });
      setRegisteredUsers(newRegisteredUsers);
    }
  };

  const deleteSavedAddress = (addressId: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      savedAddresses: (user.savedAddresses || []).filter(addr => addr.id !== addressId)
    };
    
    setUser(updatedUser);

    const userRecord = registeredUsers.get(user.email);
    if (userRecord) {
      const newRegisteredUsers = new Map(registeredUsers);
      newRegisteredUsers.set(user.email, {
        ...userRecord,
        userData: updatedUser
      });
      setRegisteredUsers(newRegisteredUsers);
    }
  };

  const setDefaultAddress = (addressId: string) => {
    if (!user) return;

    const updatedAddresses = (user.savedAddresses || []).map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));

    const updatedUser = {
      ...user,
      savedAddresses: updatedAddresses
    };
    
    setUser(updatedUser);

    const userRecord = registeredUsers.get(user.email);
    if (userRecord) {
      const newRegisteredUsers = new Map(registeredUsers);
      newRegisteredUsers.set(user.email, {
        ...userRecord,
        userData: updatedUser
      });
      setRegisteredUsers(newRegisteredUsers);
    }
  };

  const validateCurrentPassword = async (password: string): Promise<boolean> => {
    if (!user) {
      console.log('No user logged in for password validation');
      return false;
    }
    
    const userRecord = registeredUsers.get(user.email);
    console.log('Validating password for user:', user.email);
    console.log('User record exists:', !!userRecord);
    console.log('Stored password:', userRecord?.password);
    console.log('Entered password:', password);
    
    const isValid = userRecord?.password === password;
    console.log('Password validation result:', isValid);
    return isValid;
  };

  const updateUserPassword = async (newPassword: string): Promise<void> => {
    if (!user) {
      console.log('No user logged in for password update');
      throw new Error('No user logged in');
    }

    console.log('Updating password for user:', user.email);
    
    const userRecord = registeredUsers.get(user.email);
    if (userRecord) {
      const newRegisteredUsers = new Map(registeredUsers);
      newRegisteredUsers.set(user.email, {
        ...userRecord,
        password: newPassword
      });
      setRegisteredUsers(newRegisteredUsers);
      console.log('Password updated successfully');
    } else {
      console.error('User record not found for password update');
      throw new Error('User record not found');
    }
  };

  return {
    login,
    register,
    logout,
    updateUser,
    addOrder,
    deleteOrder,
    bulkDeleteOrders,
    addSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
    updateUserPassword,
    validateCurrentPassword,
  };
};
