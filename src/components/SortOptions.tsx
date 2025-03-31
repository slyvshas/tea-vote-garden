
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SortOptionsProps {
  onSortChange: (sortBy: 'rating' | 'newest' | 'alphabetical') => void;
  currentSort: 'rating' | 'newest' | 'alphabetical';
}

const SortOptions: React.FC<SortOptionsProps> = ({ onSortChange, currentSort }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
      <div className="text-sm font-medium text-muted-foreground">Sort by:</div>
      <div className="flex space-x-2">
        <Select
          value={currentSort}
          onValueChange={(value) => onSortChange(value as 'rating' | 'newest' | 'alphabetical')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="alphabetical">A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SortOptions;
