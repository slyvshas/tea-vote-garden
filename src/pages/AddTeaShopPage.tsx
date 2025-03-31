
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useTeaShops } from '@/context/TeaShopContext';

interface FormData {
  name: string;
  description: string;
  address: string;
  image: string;
  specialty: string;
  hours: {
    open: string;
    close: string;
  };
  tags: string;
}

const AddTeaShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTeaShop } = useTeaShops();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
    image: '',
    specialty: '',
    hours: {
      open: '9:00 AM',
      close: '6:00 PM',
    },
    tags: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }
    
    if (!formData.specialty.trim()) {
      newErrors.specialty = 'Specialty is required';
    }
    
    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one tag is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }
    
    // Convert comma-separated tags to array
    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');
    
    addTeaShop({
      name: formData.name,
      description: formData.description,
      address: formData.address,
      image: formData.image,
      specialty: formData.specialty,
      hours: formData.hours,
      tags: tagsArray,
      rating: 0, // Initial rating is 0
    });
    
    navigate('/tea-shops');
  };
  
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-tea-earl dark:text-tea-cream">
        Add a New Tea Shop
      </h1>
      
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-tea-earl dark:text-tea-cream">
            Tea Shop Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tea shop name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the tea shop..."
                className={errors.description ? 'border-red-500' : ''}
                rows={4}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Tea St, Leaf City"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input 
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={errors.image ? 'border-red-500' : ''}
              />
              {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty Tea</Label>
              <Input 
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Matcha, Oolong, etc."
                className={errors.specialty ? 'border-red-500' : ''}
              />
              {errors.specialty && <p className="text-red-500 text-sm">{errors.specialty}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours.open">Opening Time</Label>
                <Input 
                  id="hours.open"
                  name="hours.open"
                  value={formData.hours.open}
                  onChange={handleChange}
                  placeholder="9:00 AM"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours.close">Closing Time</Label>
                <Input 
                  id="hours.close"
                  name="hours.close"
                  value={formData.hours.close}
                  onChange={handleChange}
                  placeholder="6:00 PM"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input 
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="cozy, traditional, bubble tea"
                className={errors.tags ? 'border-red-500' : ''}
              />
              {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
            </div>
            
            <div className="flex space-x-4 pt-4">
              <Button type="submit" className="bg-tea-leaf hover:bg-tea-leaf/90 text-white">
                Add Tea Shop
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTeaShopPage;
