
import React from 'react';
import { User, Edit3, Package } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import EditProfileDialog from './EditProfileDialog';
import OrderHistoryDialog from './OrderHistoryDialog';

const UserProfile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  if (!isAuthenticated) {
    return (
      <Button variant="ghost" size="icon" onClick={handleLogin}>
        <User size={20} className="text-foreground" />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User size={20} className="text-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* Quick Action Boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-all cursor-pointer group">
              <EditProfileDialog />
              <div className="flex flex-col items-center space-y-2 pointer-events-none">
                <div className="p-3 bg-blue-500 text-white rounded-full group-hover:scale-110 transition-transform">
                  <Edit3 size={20} />
                </div>
                <span className="text-sm font-medium text-blue-700">Edit Profile</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-all cursor-pointer group">
              <OrderHistoryDialog />
              <div className="flex flex-col items-center space-y-2 pointer-events-none">
                <div className="p-3 bg-green-500 text-white rounded-full group-hover:scale-110 transition-transform">
                  <Package size={20} />
                </div>
                <span className="text-sm font-medium text-green-700">Orders ({user?.orderHistory?.length || 0})</span>
              </div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{user?.name}</h4>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Phone:</span>
              <span className="ml-2 text-muted-foreground">{user?.phone}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Address:</span>
              <span className="ml-2 text-muted-foreground">{user?.address}</span>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Button variant="outline" size="sm" onClick={handleSettingsClick}>
              Settings
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-red-700 hover:border-red-800 animate-pulse hover:animate-none"
                >
                  🚪 Sign Out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be signed out of your account and redirected to the homepage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Yes, Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfile;
