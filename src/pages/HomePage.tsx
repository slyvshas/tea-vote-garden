
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import TeaShopCard from '@/components/TeaShopCard';
import { useTeaShops } from '@/context/TeaShopContext';
import SortOptions from '@/components/SortOptions';

const HomePage: React.FC = () => {
  const { teaShops, sortedTeaShops } = useTeaShops();
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'alphabetical'>('rating');
  
  const handleSortChange = (value: 'rating' | 'newest' | 'alphabetical') => {
    setSortBy(value);
  };
  
  const sortedShops = sortedTeaShops(sortBy);
  
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12 relative">
        <div className="bg-tea-leaf/10 dark:bg-tea-matcha/5 rounded-lg py-12 px-4">
          <h1 className="text-4xl font-bold mb-4 text-tea-earl dark:text-tea-cream">
            Find and Rate the Best Tea Shops
          </h1>
          <p className="text-lg mb-6 max-w-2xl mx-auto text-muted-foreground">
            Discover unique tea experiences, share your favorites, and see what the community thinks. 
            Browse our collection of tea houses, rate them, and find your next tea adventure.
          </p>
          <div className="flex justify-center">
            <Link to="/add">
              <Button className="bg-tea-leaf hover:bg-tea-leaf/90 text-white flex items-center">
                <PlusCircle size={16} className="mr-2" />
                Add a Tea Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-tea-earl dark:text-tea-cream">
            Top Rated Tea Shops
          </h2>
          <Link to="/tea-shops" className="text-tea-leaf dark:text-tea-matcha hover:underline">
            View All &rarr;
          </Link>
        </div>
        
        <SortOptions onSortChange={handleSortChange} currentSort={sortBy} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedShops.slice(0, 6).map((shop) => (
            <TeaShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </div>
      
      <div className="text-center mt-12">
        <Link to="/tea-shops">
          <Button variant="outline" className="border-tea-leaf text-tea-leaf hover:bg-tea-leaf/10 dark:border-tea-matcha dark:text-tea-matcha dark:hover:bg-tea-matcha/10">
            Browse All Tea Shops
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
