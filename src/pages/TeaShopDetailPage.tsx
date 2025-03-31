
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ThumbsUp, ThumbsDown, MapPin, Clock } from 'lucide-react';
import { useTeaShops } from '@/context/TeaShopContext';
import Rating from '@/components/Rating';

const TeaShopDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTeaShopById, upvoteTeaShop, downvoteTeaShop } = useTeaShops();
  
  const shop = getTeaShopById(id || '');
  
  useEffect(() => {
    if (!shop) {
      navigate('/tea-shops', { replace: true });
    }
  }, [shop, navigate]);
  
  if (!shop) {
    return null;
  }
  
  return (
    <div className="animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-6 text-tea-leaf dark:text-tea-matcha"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </Button>
      
      <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg mb-8">
        <img 
          src={shop.image} 
          alt={shop.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 w-full p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {shop.name}
          </h1>
          <div className="flex items-center mb-2">
            <Rating value={shop.rating} className="mr-4" />
            <Badge className="bg-tea-leaf text-white">
              {shop.specialty}
            </Badge>
          </div>
          <div className="flex items-center text-white/80">
            <MapPin size={16} className="mr-1" />
            <span>{shop.address}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="mb-8 bg-white dark:bg-gray-800">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-tea-earl dark:text-tea-cream">
                About
              </h2>
              <p className="mb-6 text-muted-foreground">
                {shop.description}
              </p>
              
              <div className="flex items-center mb-4">
                <Clock size={16} className="mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Hours: {shop.hours.open} - {shop.hours.close}
                </span>
              </div>
              
              <h3 className="text-lg font-medium mb-2 text-tea-earl dark:text-tea-cream">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {shop.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-tea-oolong/10 text-tea-earl dark:bg-tea-oolong/20 dark:text-tea-cream">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-tea-earl dark:text-tea-cream">
                Votes
              </h2>
              
              <div className="flex justify-between items-center mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-tea-leaf dark:text-tea-matcha mb-1">
                    {shop.votes.upvotes}
                  </div>
                  <div className="text-sm text-muted-foreground">Upvotes</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500 mb-1">
                    {shop.votes.downvotes}
                  </div>
                  <div className="text-sm text-muted-foreground">Downvotes</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {shop.votes.upvotes - shop.votes.downvotes}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => upvoteTeaShop(shop.id)}
                  className="bg-tea-leaf hover:bg-tea-leaf/90 text-white flex items-center justify-center"
                >
                  <ThumbsUp size={16} className="mr-2" />
                  Upvote
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => downvoteTeaShop(shop.id)}
                  className="border-red-500 text-red-500 hover:bg-red-500/10 flex items-center justify-center"
                >
                  <ThumbsDown size={16} className="mr-2" />
                  Downvote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeaShopDetailPage;
