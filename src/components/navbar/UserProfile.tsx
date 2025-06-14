
import React from 'react';
import { User } from 'lucide-react';
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
        <User size={24} className="text-foreground" />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User size={24} className="text-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
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
            <EditProfileDialog />
            <OrderHistoryDialog />
            <Button variant="outline" size="sm" onClick={handleSettingsClick}>
              Settings
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Sign Out
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
