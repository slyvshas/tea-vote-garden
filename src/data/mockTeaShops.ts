
export interface TeaShop {
  id: string;
  name: string;
  description: string;
  address: string;
  image: string;
  specialty: string;
  rating: number;
  votes: {
    upvotes: number;
    downvotes: number;
  };
  hours: {
    open: string;
    close: string;
  };
  tags: string[];
  created_at?: string; // Added this field to match database schema
  updated_at?: string; // Added this field to match database schema
}

export const mockTeaShops: TeaShop[] = [
  {
    id: "1",
    name: "Serene Leaf",
    description: "A tranquil tea house specializing in traditional Chinese tea ceremonies and rare oolong varieties.",
    address: "123 Jasmine St, Portland, OR",
    image: "https://images.unsplash.com/photo-1525518392674-39ba1fca2ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    specialty: "Oolong Tea",
    rating: 4.7,
    votes: {
      upvotes: 42,
      downvotes: 5,
    },
    hours: {
      open: "9:00 AM",
      close: "8:00 PM",
    },
    tags: ["Traditional", "Quiet", "Ceremony"],
  },
  {
    id: "2",
    name: "Matcha Maiden",
    description: "Modern café with specialty matcha drinks and Japanese-inspired pastries.",
    address: "456 Green Ave, Seattle, WA",
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    specialty: "Matcha Latte",
    rating: 4.5,
    votes: {
      upvotes: 38,
      downvotes: 7,
    },
    hours: {
      open: "7:00 AM",
      close: "6:00 PM",
    },
    tags: ["Modern", "Japanese", "Pastries"],
  },
  {
    id: "3",
    name: "Earl's Parlor",
    description: "Victorian-inspired tea room offering classic British tea service and scones.",
    address: "789 Bergamot Blvd, Boston, MA",
    image: "https://images.unsplash.com/photo-1559622214-f8a9850965bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    specialty: "Earl Grey",
    rating: 4.8,
    votes: {
      upvotes: 56,
      downvotes: 3,
    },
    hours: {
      open: "10:00 AM",
      close: "5:00 PM",
    },
    tags: ["British", "Victorian", "Elegant"],
  },
  {
    id: "4",
    name: "Chai Lounge",
    description: "Cozy spot known for spiced chai blends and Indian-inspired snacks.",
    address: "101 Cardamom Court, Austin, TX",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    specialty: "Masala Chai",
    rating: 4.6,
    votes: {
      upvotes: 45,
      downvotes: 8,
    },
    hours: {
      open: "8:00 AM",
      close: "10:00 PM",
    },
    tags: ["Spicy", "Cozy", "Indian"],
  },
  {
    id: "5",
    name: "Bubble Brew",
    description: "Trendy bubble tea shop with innovative fruit and tea combinations.",
    address: "222 Tapioca Terrace, San Francisco, CA",
    image: "https://images.unsplash.com/photo-1558857563-c0c3b5f85ce0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    specialty: "Boba Tea",
    rating: 4.3,
    votes: {
      upvotes: 36,
      downvotes: 12,
    },
    hours: {
      open: "11:00 AM",
      close: "11:00 PM",
    },
    tags: ["Trendy", "Sweet", "Bubble Tea"],
  },
  {
    id: "6",
    name: "Herbal Haven",
    description: "Wellness-focused café featuring herbal tea blends and organic light fare.",
    address: "333 Lavender Lane, Denver, CO",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    specialty: "Herbal Infusions",
    rating: 4.4,
    votes: {
      upvotes: 32,
      downvotes: 6,
    },
    hours: {
      open: "7:30 AM",
      close: "7:30 PM",
    },
    tags: ["Wellness", "Organic", "Calming"],
  },
];
