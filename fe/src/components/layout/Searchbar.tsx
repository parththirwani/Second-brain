import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  searchQuery, 
  onSearchChange, 
  onAddClick 
}) => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search content..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>
      <Button onClick={onAddClick} size="sm">
        <Plus className="h-4 w-4" />
        Add Content
      </Button>
    </div>
  );
};

export default SearchBar;