
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TeaShop, mockTeaShops } from '../data/mockTeaShops';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types'; // Import the Database type

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
  const [loading, setLoading] = useState(true);

  // Fetch tea shops from Supabase
  const fetchTeaShops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tea_shops')
        .select('*');
      
      if (error) {
        console.error('Error fetching tea shops:', error);
        // Fall back to mock data if there's an error
        setTeaShops(mockTeaShops);
      } else if (data && data.length === 0) {
        // If no data in Supabase yet, seed with mock data
        console.log('No tea shops found in database, seeding with mock data');
        await seedInitialData();
      } else if (data) {
        // Transform the data to match the TeaShop interface
        const transformedData: TeaShop[] = data.map((shop: Database['public']['Tables']['tea_shops']['Row']) => ({
          id: shop.id,
          name: shop.name,
          description: shop.description,
          address: shop.address,
          image: shop.image,
          specialty: shop.specialty,
          rating: shop.rating ?? 0,
          votes: typeof shop.votes === 'object' ? shop.votes as TeaShop['votes'] : { upvotes: 0, downvotes: 0 },
          hours: typeof shop.hours === 'object' ? shop.hours as TeaShop['hours'] : { open: "9:00 AM", close: "5:00 PM" },
          tags: shop.tags,
          created_at: shop.created_at || undefined,
          updated_at: shop.updated_at || undefined
        }));
        setTeaShops(transformedData);
      }
    } catch (error) {
      console.error('Error in fetchTeaShops:', error);
      setTeaShops(mockTeaShops);
    } finally {
      setLoading(false);
    }
  };

  // Seed initial data with mock data
  const seedInitialData = async () => {
    try {
      // Insert mock data into Supabase
      const { error } = await supabase
        .from('tea_shops')
        .insert(mockTeaShops);
      
      if (error) {
        console.error('Error seeding data:', error);
        setTeaShops(mockTeaShops);
      } else {
        console.log('Successfully seeded tea shops data');
        // Fetch the newly inserted data
        await fetchTeaShops();
      }
    } catch (error) {
      console.error('Error in seedInitialData:', error);
      setTeaShops(mockTeaShops);
    }
  };

  useEffect(() => {
    fetchTeaShops();
  }, []);

  const addTeaShop = async (newShop: Omit<TeaShop, 'id' | 'votes'>) => {
    try {
      const shopData = {
        ...newShop,
        votes: {
          upvotes: 0,
          downvotes: 0
        }
      };
      
      const { data, error } = await supabase
        .from('tea_shops')
        .insert(shopData)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding tea shop:', error);
        toast({
          title: "Error",
          description: "Failed to add tea shop. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      if (data) {
        const newTeaShop: TeaShop = {
          id: data.id,
          name: data.name,
          description: data.description,
          address: data.address,
          image: data.image,
          specialty: data.specialty,
          rating: data.rating ?? 0,
          votes: typeof data.votes === 'object' ? data.votes as TeaShop['votes'] : { upvotes: 0, downvotes: 0 },
          hours: typeof data.hours === 'object' ? data.hours as TeaShop['hours'] : { open: "9:00 AM", close: "5:00 PM" },
          tags: data.tags,
          created_at: data.created_at || undefined,
          updated_at: data.updated_at || undefined
        };
        
        setTeaShops(prev => [...prev, newTeaShop]);
        
        toast({
          title: "Tea Shop Added",
          description: `${newShop.name} has been added to the directory.`,
        });
      }
    } catch (error) {
      console.error('Error in addTeaShop:', error);
      toast({
        title: "Error",
        description: "Failed to add tea shop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const upvoteTeaShop = async (id: string) => {
    try {
      // Get the current shop
      const shop = teaShops.find(s => s.id === id);
      if (!shop) return;
      
      // Calculate new values
      const newUpvotes = shop.votes.upvotes + 1;
      const newRating = calculateRating(newUpvotes, shop.votes.downvotes);
      
      // Update in Supabase
      const { error } = await supabase
        .from('tea_shops')
        .update({ 
          votes: { 
            upvotes: newUpvotes, 
            downvotes: shop.votes.downvotes 
          },
          rating: newRating
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error upvoting tea shop:', error);
        return;
      }
      
      // Update local state
      setTeaShops(prev => 
        prev.map(shop => 
          shop.id === id 
            ? { 
                ...shop, 
                votes: { 
                  ...shop.votes, 
                  upvotes: newUpvotes 
                },
                rating: newRating
              } 
            : shop
        )
      );
    } catch (error) {
      console.error('Error in upvoteTeaShop:', error);
    }
  };

  const downvoteTeaShop = async (id: string) => {
    try {
      // Get the current shop
      const shop = teaShops.find(s => s.id === id);
      if (!shop) return;
      
      // Calculate new values
      const newDownvotes = shop.votes.downvotes + 1;
      const newRating = calculateRating(shop.votes.upvotes, newDownvotes);
      
      // Update in Supabase
      const { error } = await supabase
        .from('tea_shops')
        .update({ 
          votes: { 
            upvotes: shop.votes.upvotes, 
            downvotes: newDownvotes 
          },
          rating: newRating
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error downvoting tea shop:', error);
        return;
      }
      
      // Update local state
      setTeaShops(prev => 
        prev.map(shop => 
          shop.id === id 
            ? { 
                ...shop, 
                votes: { 
                  ...shop.votes, 
                  downvotes: newDownvotes 
                },
                rating: newRating
              } 
            : shop
        )
      );
    } catch (error) {
      console.error('Error in downvoteTeaShop:', error);
    }
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
        return [...teaShops].sort((a, b) => {
          // For Supabase data, we can use the created_at timestamp
          const aDate = new Date(a.created_at || 0).getTime();
          const bDate = new Date(b.created_at || 0).getTime();
          return bDate - aDate;
        });
      case 'alphabetical':
        return [...teaShops].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return teaShops;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading tea shops...</div>;
  }

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
