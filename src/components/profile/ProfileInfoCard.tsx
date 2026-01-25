import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, MapPin, Settings, LogOut, Phone, Mail } from 'lucide-react';
import { User as UserType } from '@/types/auth';

interface ProfileInfoCardProps {
  user: UserType;
  onLogout: () => void;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{user.name || 'User'}</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{user.phone || 'Not set'}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{user.address || 'No address set'}</span>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfoCard;
