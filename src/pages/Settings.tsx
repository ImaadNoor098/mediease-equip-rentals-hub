import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { User, Bell, Shield, Trash2, HelpCircle, Edit3, Package } from 'lucide-react';
import BackButton from '@/components/BackButton';
import EditProfileDialog from '@/components/navbar/EditProfileDialog';
import OrderHistoryDialog from '@/components/navbar/OrderHistoryDialog';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = () => {
    setIsDeleting(true);
    
    // Simulate account deletion process
    setTimeout(() => {
      // Remove user data from localStorage
      localStorage.removeItem('currentUser');
      const storedUsers = localStorage.getItem('registeredUsers');
      if (storedUsers && user?.email) {
        try {
          const usersData = JSON.parse(storedUsers);
          delete usersData[user.email];
          localStorage.setItem('registeredUsers', JSON.stringify(usersData));
        } catch (error) {
          console.error('Error removing user from registered users:', error);
        }
      }
      
      logout();
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted. You can register again with the same email.",
        variant: "destructive",
      });
      navigate('/');
      setIsDeleting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)} />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <BackButton />
            <h1 className="text-3xl font-bold mt-4">Profile</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          {/* Quick Action Boxes */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-lg transition-all cursor-pointer group relative">
              <EditProfileDialog />
              <div className="flex flex-col items-center space-y-3 pointer-events-none">
                <div className="p-4 bg-blue-500 text-white rounded-full group-hover:scale-110 transition-transform">
                  <Edit3 size={24} />
                </div>
                <span className="text-sm font-semibold text-blue-700">Edit Profile</span>
                <span className="text-xs text-blue-600">Update your details</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-lg transition-all cursor-pointer group relative">
              <OrderHistoryDialog />
              <div className="flex flex-col items-center space-y-3 pointer-events-none">
                <div className="p-4 bg-green-500 text-white rounded-full group-hover:scale-110 transition-transform">
                  <Package size={24} />
                </div>
                <span className="text-sm font-semibold text-green-700">Check Orders</span>
                <span className="text-xs text-green-600 font-bold">{user?.orderHistory?.length || 0} orders</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={20} />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Button variant="outline" disabled>
                    Change Email
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Password</h3>
                    <p className="text-sm text-muted-foreground">Change your password</p>
                  </div>
                  <Button variant="outline" disabled>
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell size={20} />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive updates about your orders</p>
                  </div>
                  <Button variant="outline" disabled>
                    Manage
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">Get notified about promotions</p>
                  </div>
                  <Button variant="outline" disabled>
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={20} />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Data Privacy</h3>
                    <p className="text-sm text-muted-foreground">Manage your data preferences</p>
                  </div>
                  <Button variant="outline" disabled>
                    View Settings
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Login History</h3>
                    <p className="text-sm text-muted-foreground">View your recent login activity</p>
                  </div>
                  <Button variant="outline" disabled>
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle size={20} />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Help Center</h3>
                    <p className="text-sm text-muted-foreground">Find answers to common questions</p>
                  </div>
                  <Button variant="outline" onClick={() => navigate('/contact')}>
                    Contact Support
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">About Us</h3>
                    <p className="text-sm text-muted-foreground">Learn more about our company</p>
                  </div>
                  <Button variant="outline" onClick={() => navigate('/about')}>
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 size={20} />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-destructive">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data. 
                      You can register again with the same email address.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account,
                          remove all your data including order history, saved addresses, and profile information.
                          You will be able to register again with the same email address if needed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes, Delete My Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
