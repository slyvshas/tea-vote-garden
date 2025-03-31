
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import TeaShopCard from '@/components/TeaShopCard';
import { useTeaShops } from '@/context/TeaShopContext';
import SortOptions from '@/components/SortOptions';

const TeaShopsPage: React.FC = () => {
  const { teaShops, sortedTeaShops } = useTeaShops();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'alphabetical'>('rating');
  
  const handleSortChange = (value: 'rating' | 'newest' | 'alphabetical') => {
    setSortBy(value);
  };
  
  const sorted = sortedTeaShops(sortBy);
  
  const filteredShops = sorted.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-tea-earl dark:text-tea-cream">
        All Tea Shops
      </h1>
      
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="search"
          placeholder="Search by name, description, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <SortOptions onSortChange={handleSortChange} currentSort={sortBy} />
      
      {filteredShops.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No tea shops found</h3>
          <p className="text-muted-foreground">
            Try changing your search or add a new tea shop.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <TeaShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeaShopsPage;
