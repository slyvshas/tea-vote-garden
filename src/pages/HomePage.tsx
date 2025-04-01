import React from 'react';
import { useTeaShops } from '@/context/TeaShopContext';
import TeaShopCard from '@/components/TeaShopCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { teaShops, loading, error } = useTeaShops();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg">Loading tea shops...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-tea-earl dark:text-tea-cream">
          Welcome to Tea Vote Garden
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover and vote on the best tea shops in your area. Share your experiences and help others find their perfect cup of tea.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teaShops.map((shop) => (
          <TeaShopCard key={shop.id} shop={shop} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
