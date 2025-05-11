
import React from 'react';
import SearchBar from './SearchBar';
import Navigation from './Navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onSearch: (query: string) => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onSearch, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden mt-4 pb-4">
      <div className="flex flex-col space-y-4">
        <Navigation 
          className="flex-col space-y-4" 
          onItemClick={onClose}
        />
        
        {/* Mobile Search */}
        <SearchBar onSearch={onSearch} className="mt-2" />
      </div>
    </div>
  );
};

export default MobileMenu;
