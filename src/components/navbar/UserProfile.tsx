
import React from 'react';
import { User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const UserProfile = () => {
  // Mock user data - in a real app this would come from auth context
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '',
    initials: 'JD',
    joinDate: 'January 2024'
  };

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
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{user.name}</h4>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Member since:</span>
              <span className="ml-2 text-muted-foreground">{user.joinDate}</span>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              Order History
            </Button>
            <Button variant="outline" size="sm">
              Settings
            </Button>
            <Button variant="destructive" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfile;
