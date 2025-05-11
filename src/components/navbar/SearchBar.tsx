
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className={`flex items-center ${className}`}>
      <Input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full mr-2 focus:border-medieaze-500 focus:ring-medieaze-500 bg-background"
      />
      <Button
        type="submit"
        variant="outline"
        size="icon"
        className="h-10 w-10 text-medieaze-600"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default SearchBar;
