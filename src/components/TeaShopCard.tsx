
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { TeaShop } from '@/data/mockTeaShops';
import { useTeaShops } from '@/context/TeaShopContext';

interface TeaShopCardProps {
  shop: TeaShop;
}

const TeaShopCard: React.FC<TeaShopCardProps> = ({ shop }) => {
  const { upvoteTeaShop, downvoteTeaShop } = useTeaShops();
  
  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    upvoteTeaShop(shop.id);
  };
  
  const handleDownvote = (e: React.MouseEvent) => {
    e.preventDefault();
    downvoteTeaShop(shop.id);
  };
  
  const voteScore = shop.votes.upvotes - shop.votes.downvotes;
  
  return (
    <Link to={`/shop/${shop.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300 animate-fade-in bg-white dark:bg-gray-800">
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={shop.image} 
            alt={shop.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-tea-earl dark:text-tea-cream line-clamp-1">
              {shop.name}
            </h3>
            <Badge 
              variant={voteScore > 0 ? "default" : "destructive"}
              className={`${voteScore > 0 ? 'bg-tea-leaf text-white' : ''}`}
            >
              {voteScore > 0 ? '+' : ''}{voteScore}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{shop.address}</p>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center text-sm mb-2">
            <Clock size={14} className="mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">
              {shop.hours.open} - {shop.hours.close}
            </span>
          </div>
          <p className="text-sm mb-2 line-clamp-2">{shop.description}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {shop.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-tea-oolong/10 text-tea-earl dark:bg-tea-oolong/20 dark:text-tea-cream">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Specialty: {shop.specialty}</span>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleUpvote}
              className="text-tea-leaf hover:text-green-700 hover:bg-green-100 dark:text-tea-matcha dark:hover:bg-green-900/30"
            >
              <ThumbsUp size={16} className="mr-1" /> {shop.votes.upvotes}
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleDownvote}
              className="text-tea-earl hover:text-red-700 hover:bg-red-100 dark:text-tea-oolong dark:hover:bg-red-900/30"
            >
              <ThumbsDown size={16} className="mr-1" /> {shop.votes.downvotes}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default TeaShopCard;
