import React, { createContext, useContext, useState, useEffect } from 'react';
import { TeaShop, mockTeaShops } from '../data/mockTeaShops';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types'; // Import the Database type
import { useAuth } from './AuthContext';

interface TeaShopContextType {
  teaShops: TeaShop[];
  loading: boolean;
  error: string | null;
  addTeaShop: (shop: Omit<TeaShop, 'id' | 'votes'>) => Promise<void>;
  upvoteTeaShop: (id: string) => Promise<void>;
  downvoteTeaShop: (id: string) => Promise<void>;
  getTeaShopById: (id: string) => TeaShop | undefined;
  sortedTeaShops: (sortBy: 'rating' | 'newest' | 'alphabetical') => TeaShop[];
  deleteTeaShop: (id: string) => Promise<void>;
  updateTeaShop: (id: string, updates: Partial<TeaShop>) => Promise<void>;
  sortTeaShops: (sortBy: 'rating' | 'votes' | 'name') => void;
}

const TeaShopContext = createContext<TeaShopContextType | undefined>(undefined);

export const TeaShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teaShops, setTeaShops] = useState<TeaShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTeaShops();
  }, []);

  const fetchTeaShops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tea_shops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tea shops:', error);
        throw error;
      }

      if (!data) {
        console.log('No tea shops found');
        setTeaShops([]);
      } else {
        // Transform the data to match the TeaShop interface
        const transformedData = data.map(shop => ({
          ...shop,
          votes: typeof shop.votes === 'object' ? shop.votes : { upvotes: 0, downvotes: 0 },
          hours: typeof shop.hours === 'object' ? shop.hours : { open: "9:00 AM", close: "5:00 PM" }
        }));

        console.log('Fetched tea shops:', transformedData);
        setTeaShops(transformedData);
      }
    } catch (err) {
      console.error('Error in fetchTeaShops:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tea shops');
    } finally {
      setLoading(false);
    }
  };

  const updateVoteCounts = async (teaShopId: string) => {
    try {
      // Get upvotes count
      const { count: upvotes } = await supabase
        .from('user_votes')
        .select('*', { count: 'exact', head: true })
        .eq('tea_shop_id', teaShopId)
        .eq('vote_type', 'upvote');

      // Get downvotes count
      const { count: downvotes } = await supabase
        .from('user_votes')
        .select('*', { count: 'exact', head: true })
        .eq('tea_shop_id', teaShopId)
        .eq('vote_type', 'downvote');

      // Update tea shop with new vote counts
      const { error } = await supabase
        .from('tea_shops')
        .update({
          votes: {
            upvotes: upvotes || 0,
            downvotes: downvotes || 0
          },
          rating: calculateRating(upvotes || 0, downvotes || 0)
        })
        .eq('id', teaShopId);

      if (error) throw error;

      // Update local state
      setTeaShops(prevShops => 
        prevShops.map(shop => 
          shop.id === teaShopId 
            ? {
                ...shop,
                votes: {
                  upvotes: upvotes || 0,
                  downvotes: downvotes || 0
                },
                rating: calculateRating(upvotes || 0, downvotes || 0)
              }
            : shop
        )
      );
    } catch (err) {
      console.error('Error updating vote counts:', err);
      throw err;
    }
  };

  const upvoteTeaShop = async (id: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to vote on tea shops.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('user_votes')
        .select('vote_type')
        .eq('tea_shop_id', id)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === 'upvote') {
          // Remove upvote
          const { error } = await supabase
            .from('user_votes')
            .delete()
            .eq('tea_shop_id', id)
            .eq('user_id', user.id);
          
          if (error) throw error;
        } else {
          // Change downvote to upvote
          const { error } = await supabase
            .from('user_votes')
            .update({ vote_type: 'upvote' })
            .eq('tea_shop_id', id)
            .eq('user_id', user.id);
          
          if (error) throw error;
        }
      } else {
        // Add new upvote
        const { error } = await supabase
          .from('user_votes')
          .insert([
            {
              tea_shop_id: id,
              user_id: user.id,
              vote_type: 'upvote'
            }
          ]);
        
        if (error) throw error;
      }

      // Update vote counts and rating
      await updateVoteCounts(id);
      // Refresh tea shops data
      await fetchTeaShops();
    } catch (err) {
      console.error('Error upvoting tea shop:', err);
      toast({
        title: "Error",
        description: "Failed to update vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downvoteTeaShop = async (id: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to vote on tea shops.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('user_votes')
        .select('vote_type')
        .eq('tea_shop_id', id)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === 'downvote') {
          // Remove downvote
          const { error } = await supabase
            .from('user_votes')
            .delete()
            .eq('tea_shop_id', id)
            .eq('user_id', user.id);
          
          if (error) throw error;
        } else {
          // Change upvote to downvote
          const { error } = await supabase
            .from('user_votes')
            .update({ vote_type: 'downvote' })
            .eq('tea_shop_id', id)
            .eq('user_id', user.id);
          
          if (error) throw error;
        }
      } else {
        // Add new downvote
        const { error } = await supabase
          .from('user_votes')
          .insert([
            {
              tea_shop_id: id,
              user_id: user.id,
              vote_type: 'downvote'
            }
          ]);
        
        if (error) throw error;
      }

      // Update vote counts and rating
      await updateVoteCounts(id);
      // Refresh tea shops data
      await fetchTeaShops();
    } catch (err) {
      console.error('Error downvoting tea shop:', err);
      toast({
        title: "Error",
        description: "Failed to update vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const calculateRating = (upvotes: number, downvotes: number): number => {
    const total = upvotes + downvotes;
    if (total === 0) return 0;
    return Number(((upvotes / total) * 5).toFixed(1));
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

  const addTeaShop = async (shop: Omit<TeaShop, 'id' | 'votes'>) => {
    try {
      const { data, error } = await supabase
        .from('tea_shops')
        .insert([
          {
            ...shop,
            votes: { upvotes: 0, downvotes: 0 },
            rating: 0
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setTeaShops(prev => [data, ...prev]);
    } catch (err) {
      console.error('Error adding tea shop:', err);
      throw err;
    }
  };

  const deleteTeaShop = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tea_shops')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTeaShops(prev => prev.filter(shop => shop.id !== id));
    } catch (err) {
      console.error('Error deleting tea shop:', err);
      throw err;
    }
  };

  const updateTeaShop = async (id: string, updates: Partial<TeaShop>) => {
    try {
      const { data, error } = await supabase
        .from('tea_shops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTeaShops(prev => 
        prev.map(shop => shop.id === id ? data : shop)
      );
    } catch (err) {
      console.error('Error updating tea shop:', err);
      throw err;
    }
  };

  const sortTeaShops = (sortBy: 'rating' | 'votes' | 'name') => {
    setTeaShops(prev => {
      const sorted = [...prev];
      switch (sortBy) {
        case 'rating':
          sorted.sort((a, b) => b.rating - a.rating);
          break;
        case 'votes':
          sorted.sort((a, b) => 
            (b.votes.upvotes - b.votes.downvotes) - 
            (a.votes.upvotes - a.votes.downvotes)
          );
          break;
        case 'name':
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
      return sorted;
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading tea shops...</div>;
  }

  return (
    <TeaShopContext.Provider 
      value={{ 
        teaShops, 
        loading,
        error,
        addTeaShop, 
        upvoteTeaShop, 
        downvoteTeaShop, 
        getTeaShopById,
        sortedTeaShops,
        deleteTeaShop,
        updateTeaShop,
        sortTeaShops
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
