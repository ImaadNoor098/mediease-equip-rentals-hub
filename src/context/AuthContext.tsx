
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SavedAddress = {
  id: string;
  fullName: string;
  mobileNumber: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  isDefault?: boolean;
};

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  orderHistory?: OrderHistoryItem[];
  savedAddresses?: SavedAddress[];
};

type OrderHistoryItem = {
  id: string;
  date: string;
  total: number;
  method: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  savings: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addOrder: (order: OrderHistoryItem) => void;
  deleteOrder: (orderId: string) => void;
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => void;
  deleteSavedAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
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

  // Load stored data on initialization
  useEffect(() => {
    // Load registered users from localStorage
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      try {
        const usersData = JSON.parse(storedUsers);
        // Properly type the entries when creating the Map
        const usersMap = new Map<string, { password: string; userData: User }>();
        Object.entries(usersData).forEach(([email, userData]) => {
          // Type assertion since we know the structure from our storage
          usersMap.set(email, userData as { password: string; userData: User });
        });
        setRegisteredUsers(usersMap);
      } catch (error) {
        console.error('Error loading users from localStorage:', error);
      }
    }

    // Check if user was previously logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('AuthProvider: Loaded user from localStorage:', userData);
      } catch (error) {
        console.error('Error loading current user from localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // Save registered users to localStorage whenever the map changes
  useEffect(() => {
    if (registeredUsers.size > 0) {
      const usersData = Object.fromEntries(registeredUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(usersData));
    }
  }, [registeredUsers]);

  // Save current user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      console.log('AuthProvider: Saved user to localStorage:', user);
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

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
    // Check if user already exists
    if (registeredUsers.has(userData.email)) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      orderHistory: [],
      savedAddresses: []
    };
    
    // Store user in our database
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

    // Update the user in registered users as well
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
      console.log('AuthProvider: No user logged in, cannot add order');
      return;
    }

    console.log('AuthProvider: Adding order for user:', user.email, order);

    const updatedUser = {
      ...user,
      orderHistory: [...(user.orderHistory || []), order]
    };
    
    setUser(updatedUser);

    // Update the user in registered users as well
    const userRecord = registeredUsers.get(user.email);
    if (userRecord) {
      const newRegisteredUsers = new Map(registeredUsers);
      newRegisteredUsers.set(user.email, {
        ...userRecord,
        userData: updatedUser
      });
      setRegisteredUsers(newRegisteredUsers);
      console.log('AuthProvider: Order added successfully. New order history length:', updatedUser.orderHistory.length);
    }
  };

  const deleteOrder = (orderId: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      orderHistory: (user.orderHistory || []).filter(order => order.id !== orderId)
    };
    
    setUser(updatedUser);

    // Update the user in registered users as well
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

  const addSavedAddress = (address: Omit<SavedAddress, 'id'>) => {
    if (!user) return;

    const newAddress: SavedAddress = {
      ...address,
      id: Date.now().toString(),
      isDefault: (user.savedAddresses || []).length === 0 // First address is default
    };

    const updatedUser = {
      ...user,
      savedAddresses: [...(user.savedAddresses || []), newAddress]
    };
    
    setUser(updatedUser);

    // Update the user in registered users as well
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

    // Update the user in registered users as well
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

    // Update the user in registered users as well
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

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    addOrder,
    deleteOrder,
    addSavedAddress,
    deleteSavedAddress,
    setDefaultAddress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
