import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ThumbsUp, ThumbsDown, MapPin, Clock } from 'lucide-react';
import { useTeaShops } from '@/context/TeaShopContext';
import { useAuth } from '@/context/AuthContext';
import Rating from '@/components/Rating';
import { toast } from '@/components/ui/use-toast';

const TeaShopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTeaShopById, upvoteTeaShop, downvoteTeaShop } = useTeaShops();
  const { user } = useAuth();
  
  const shop = getTeaShopById(id || '');
  
  useEffect(() => {
    if (!shop) {
      navigate('/tea-shops', { replace: true });
    }
  }, [shop, navigate]);
  
  if (!shop) {
    return null;
  }

  const handleUpvote = async () => {
    try {
      await upvoteTeaShop(shop.id);
      toast({
        title: "Upvoted!",
        description: `You upvoted ${shop.name}`,
      });
    } catch (error) {
      // Error is already handled in TeaShopContext
      console.error('Error in handleUpvote:', error);
    }
  };

  const handleDownvote = async () => {
    try {
      await downvoteTeaShop(shop.id);
      toast({
        title: "Downvoted",
        description: `You downvoted ${shop.name}`,
      });
    } catch (error) {
      // Error is already handled in TeaShopContext
      console.error('Error in handleDownvote:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 text-tea-earl dark:text-tea-cream hover:text-tea-leaf dark:hover:text-tea-matcha"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-tea-earl dark:text-tea-cream mb-2">
              {shop.name}
            </h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{shop.address}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{shop.hours.open} - {shop.hours.close}</span>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 text-tea-earl dark:text-tea-cream">
              About
            </h2>
            <p className="text-muted-foreground">{shop.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 text-tea-earl dark:text-tea-cream">
              Specialty
            </h2>
            <Badge variant="outline" className="bg-tea-oolong/10 text-tea-earl dark:bg-tea-oolong/20 dark:text-tea-cream">
              {shop.specialty}
            </Badge>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 text-tea-earl dark:text-tea-cream">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {shop.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-tea-oolong/10 text-tea-earl dark:bg-tea-oolong/20 dark:text-tea-cream"
                >
                  {tag}
                </Badge>
              ))}
            </div>
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
                
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={handleUpvote}
                    className="bg-tea-leaf hover:bg-tea-leaf/90 text-white flex items-center justify-center"
                  >
                    <ThumbsUp size={16} className="mr-2" />
                    Upvote
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleDownvote}
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
    </div>
  );
};

export default TeaShopDetailPage;
