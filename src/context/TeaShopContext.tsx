
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TeaShop, mockTeaShops } from '../data/mockTeaShops';
import { toast } from '@/components/ui/use-toast';

interface TeaShopContextType {
  teaShops: TeaShop[];
  addTeaShop: (newShop: Omit<TeaShop, 'id' | 'votes'>) => void;
  upvoteTeaShop: (id: string) => void;
  downvoteTeaShop: (id: string) => void;
  getTeaShopById: (id: string) => TeaShop | undefined;
  sortedTeaShops: (sortBy: 'rating' | 'newest' | 'alphabetical') => TeaShop[];
}

const TeaShopContext = createContext<TeaShopContextType | undefined>(undefined);

export const TeaShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teaShops, setTeaShops] = useState<TeaShop[]>([]);

  useEffect(() => {
    // Load from localStorage or use mock data
    const savedShops = localStorage.getItem('teaShops');
    if (savedShops) {
      setTeaShops(JSON.parse(savedShops));
    } else {
      setTeaShops(mockTeaShops);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever teaShops changes
    localStorage.setItem('teaShops', JSON.stringify(teaShops));
  }, [teaShops]);

  const addTeaShop = (newShop: Omit<TeaShop, 'id' | 'votes'>) => {
    const shop: TeaShop = {
      ...newShop,
      id: Date.now().toString(),
      votes: {
        upvotes: 0,
        downvotes: 0
      }
    };
    
    setTeaShops(prev => [...prev, shop]);
    toast({
      title: "Tea Shop Added",
      description: `${newShop.name} has been added to the directory.`,
    });
  };

  const upvoteTeaShop = (id: string) => {
    setTeaShops(prev => 
      prev.map(shop => 
        shop.id === id 
          ? { 
              ...shop, 
              votes: { 
                ...shop.votes, 
                upvotes: shop.votes.upvotes + 1 
              },
              rating: calculateRating(
                shop.votes.upvotes + 1,
                shop.votes.downvotes
              )
            } 
          : shop
      )
    );
  };

  const downvoteTeaShop = (id: string) => {
    setTeaShops(prev => 
      prev.map(shop => 
        shop.id === id 
          ? { 
              ...shop, 
              votes: { 
                ...shop.votes, 
                downvotes: shop.votes.downvotes + 1 
              },
              rating: calculateRating(
                shop.votes.upvotes,
                shop.votes.downvotes + 1
              )
            } 
          : shop
      )
    );
  };

  const calculateRating = (upvotes: number, downvotes: number): number => {
    const total = upvotes + downvotes;
    if (total === 0) return 0;
    
    // Calculate a score between 0-5 based on votes
    const percentage = upvotes / total;
    return Math.round(percentage * 5 * 10) / 10; // Round to 1 decimal place
  };

  const getTeaShopById = (id: string): TeaShop | undefined => {
    return teaShops.find(shop => shop.id === id);
  };

  const sortedTeaShops = (sortBy: 'rating' | 'newest' | 'alphabetical'): TeaShop[] => {
    switch (sortBy) {
      case 'rating':
        return [...teaShops].sort((a, b) => {
          const aScore = a.votes.upvotes - a.votes.downvotes;
          const bScore = b.votes.upvotes - b.votes.downvotes;
          return bScore - aScore;
        });
      case 'newest':
        return [...teaShops].sort((a, b) => parseInt(b.id) - parseInt(a.id));
      case 'alphabetical':
        return [...teaShops].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return teaShops;
    }
  };

  return (
    <TeaShopContext.Provider 
      value={{ 
        teaShops, 
        addTeaShop, 
        upvoteTeaShop, 
        downvoteTeaShop, 
        getTeaShopById,
        sortedTeaShops
      }}
    >
      {children}
    </TeaShopContext.Provider>
  );
};

export const useTeaShops = () => {
  const context = useContext(TeaShopContext);
  if (context === undefined) {
    throw new Error('useTeaShops must be used within a TeaShopProvider');
  }
  return context;
};
