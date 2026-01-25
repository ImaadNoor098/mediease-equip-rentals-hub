import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthContextType, RegisterData, OrderHistoryItem, SavedAddress } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          // Defer profile fetch to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (profile) {
      setUser({
        id: profile.id,
        name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        orderHistory: [],
        savedAddresses: []
      });
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'WRONG_CREDENTIALS' };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: userData.name,
            phone: userData.phone,
            address: userData.address,
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          return { success: false, error: 'EMAIL_EXISTS' };
        }
        return { success: false, error: error.message };
      }

      // Check if user was created (not just a duplicate signup attempt)
      if (!data.user) {
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      // Update profile with additional info
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone: userData.phone,
            address: userData.address,
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }
      }

      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user || !session) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.name,
        phone: updates.phone,
        address: updates.address,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    setUser({ ...user, ...updates });
  };

  const addOrder = async (order: OrderHistoryItem) => {
    if (!user || !session) {
      console.error('Cannot add order - no user logged in');
      return;
    }

    const { error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: order.id,
        items: order.items,
        subtotal: order.total - (order.total * 0.18 / 1.18), // Remove GST to get subtotal
        gst: order.total * 0.18 / 1.18,
        total: order.total,
        savings: order.savings,
        customer_name: order.shippingAddress?.fullName,
        customer_email: user.email,
        customer_phone: order.shippingAddress?.mobileNumber,
        shipping_address: order.shippingAddress ? 
          `${order.shippingAddress.addressLine1}, ${order.shippingAddress.addressLine2 || ''}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}` : null,
        payment_method: order.method,
        status: 'completed'
      });

    if (error) {
      console.error('Error adding order:', error);
      toast({
        title: "Error saving order",
        description: "Order was placed but couldn't be saved to history.",
        variant: "destructive"
      });
      return;
    }

    console.log('Order saved to database successfully');
  };

  const deleteOrder = async (orderId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('order_number', orderId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting order:', error);
    }
  };

  const bulkDeleteOrders = async (orderIds: string[]) => {
    if (!user) return;

    const { error } = await supabase
      .from('orders')
      .delete()
      .in('order_number', orderIds)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error bulk deleting orders:', error);
    }
  };

  const addSavedAddress = (address: Omit<SavedAddress, 'id'>) => {
    // For now, keep addresses in local state (can be moved to DB later)
    if (!user) return;
    const newAddress: SavedAddress = {
      ...address,
      id: Date.now().toString(),
      isDefault: (user.savedAddresses || []).length === 0
    };
    setUser({
      ...user,
      savedAddresses: [...(user.savedAddresses || []), newAddress]
    });
  };

  const deleteSavedAddress = (addressId: string) => {
    if (!user) return;
    setUser({
      ...user,
      savedAddresses: (user.savedAddresses || []).filter(addr => addr.id !== addressId)
    });
  };

  const setDefaultAddress = (addressId: string) => {
    if (!user) return;
    const updatedAddresses = (user.savedAddresses || []).map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setUser({
      ...user,
      savedAddresses: updatedAddresses
    });
  };

  const validateCurrentPassword = async (password: string): Promise<boolean> => {
    if (!user || !session) return false;
    
    // Try to sign in with current password to validate
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    });

    return !error;
  };

  const updateUserPassword = async (newPassword: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw new Error(error.message);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!session && !!user,
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
