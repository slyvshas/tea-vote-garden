import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Clock, MapPin, Star, Coffee } from 'lucide-react';
import { TeaShop } from '@/data/mockTeaShops';
import { useTeaShops } from '@/context/TeaShopContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TeaShopCardProps {
  shop: TeaShop;
}

const TeaShopCard: React.FC<TeaShopCardProps> = ({ shop }) => {
  const { upvoteTeaShop, downvoteTeaShop } = useTeaShops();
  const { user } = useAuth();
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [voteAnimation, setVoteAnimation] = useState<'up' | 'down' | null>(null);
  
  useEffect(() => {
    if (user) {
      const fetchUserVote = async () => {
        const { data } = await supabase
          .from('user_votes')
          .select('vote_type')
          .eq('tea_shop_id', shop.id)
          .single();
        
        if (data) {
          setUserVote(data.vote_type);
        }
      };
      
      fetchUserVote();
    }
  }, [user, shop.id]);
  
  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      // Show login prompt or redirect to login
      return;
    }
    setVoteAnimation('up');
    try {
      await upvoteTeaShop(shop.id);
      // Update userVote state based on previous vote
      if (userVote === 'upvote') {
        setUserVote(null); // Remove upvote
      } else {
        setUserVote('upvote'); // Add upvote or change from downvote
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
    setTimeout(() => setVoteAnimation(null), 500);
  };
  
  const handleDownvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      // Show login prompt or redirect to login
      return;
    }
    setVoteAnimation('down');
    try {
      await downvoteTeaShop(shop.id);
      // Update userVote state based on previous vote
      if (userVote === 'downvote') {
        setUserVote(null); // Remove downvote
      } else {
        setUserVote('downvote'); // Add downvote or change from upvote
      }
    } catch (error) {
      console.error('Error downvoting:', error);
    }
    setTimeout(() => setVoteAnimation(null), 500);
  };
  
  const voteScore = shop.votes.upvotes - shop.votes.downvotes;
  
  return (
    <Link to={`/shop/${shop.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border-2 hover:border-tea-leaf/20 dark:hover:border-tea-matcha/20">
          <div className="relative w-full h-48 overflow-hidden group">
            <motion.img 
              src={shop.image} 
              alt={shop.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              whileHover={{ scale: 1.1 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-2 left-2 right-2">
              <Badge 
                variant={voteScore > 0 ? "default" : "destructive"}
                className={cn(
                  "transition-all duration-300",
                  voteScore > 0 
                    ? 'bg-tea-leaf text-white hover:bg-tea-leaf/90' 
                    : 'bg-red-500 hover:bg-red-600'
                )}
              >
                <Star className="w-4 h-4 mr-1" />
                {voteScore > 0 ? '+' : ''}{voteScore}
              </Badge>
            </div>
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-tea-earl dark:text-tea-cream line-clamp-1 group-hover:text-tea-leaf dark:group-hover:text-tea-matcha transition-colors">
                {shop.name}
              </h3>
              <Badge variant="outline" className="bg-tea-oolong/10 text-tea-earl dark:bg-tea-oolong/20 dark:text-tea-cream">
                <Coffee className="w-4 h-4 mr-1" />
                {shop.specialty}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground line-clamp-1">
              <MapPin className="w-4 h-4 mr-1" />
              {shop.address}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm mb-2 text-muted-foreground">
              <Clock size={14} className="mr-1" />
              <span>{shop.hours.open} - {shop.hours.close}</span>
            </div>
            <p className="text-sm mb-2 line-clamp-2 text-muted-foreground">{shop.description}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {shop.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-tea-oolong/10 text-tea-earl dark:bg-tea-oolong/20 dark:text-tea-cream hover:bg-tea-oolong/20 dark:hover:bg-tea-oolong/30 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <div className="flex items-center space-x-2">
              <AnimatePresence>
                {voteAnimation === 'up' && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-green-500"
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </motion.div>
                )}
                {voteAnimation === 'down' && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-red-500"
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleUpvote}
                  className={cn(
                    "text-tea-leaf hover:text-green-700 hover:bg-green-100 dark:text-tea-matcha dark:hover:bg-green-900/30 transition-all duration-200",
                    userVote === 'upvote' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''
                  )}
                >
                  <ThumbsUp size={16} className="mr-1" /> {shop.votes.upvotes}
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleDownvote}
                  className={cn(
                    "text-tea-earl hover:text-red-700 hover:bg-red-100 dark:text-tea-oolong dark:hover:bg-red-900/30 transition-all duration-200",
                    userVote === 'downvote' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : ''
                  )}
                >
                  <ThumbsDown size={16} className="mr-1" /> {shop.votes.downvotes}
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};

export default TeaShopCard;
