import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeaShops } from '@/context/TeaShopContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageIcon, Upload } from 'lucide-react';

interface FormData {
  name: string;
  description: string;
  address: string;
  image: File | null;
  imagePreview: string;
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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
    image: null,
    imagePreview: '',
    specialty: '',
    hours: {
      open: '9:00 AM',
      close: '5:00 PM'
    },
    tags: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'hours') {
      const [open, close] = value.split('-').map(h => h.trim());
      setFormData(prev => ({
        ...prev,
        hours: { open, close }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      image: file,
      imagePreview: previewUrl
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('tea-shop-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tea-shop-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast({
        title: "Error",
        description: "Description is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.address.trim()) {
      toast({
        title: "Error",
        description: "Address is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.image) {
      toast({
        title: "Error",
        description: "Please select an image",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Upload image first
      const imageUrl = await uploadImage(formData.image!);

      // Create new shop with the uploaded image URL
      const newShop = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        image: imageUrl,
        specialty: formData.specialty,
        hours: formData.hours,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        rating: 0,
        votes: { upvotes: 0, downvotes: 0 }
      };

      await addTeaShop(newShop);
      
      toast({
        title: "Success",
        description: "Tea shop added successfully!",
      });
      
      navigate('/tea-shops');
    } catch (error) {
      console.error('Error adding tea shop:', error);
      toast({
        title: "Error",
        description: "Failed to add tea shop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Tea Shop</CardTitle>
          <CardDescription>
            Fill in the details to add a new tea shop to our collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Shop Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter the tea shop name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the tea shop"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter the shop's address"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Shop Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative w-32 h-32 border-2 border-dashed rounded-lg overflow-hidden">
                  {formData.imagePreview ? (
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Select Image"}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    Recommended size: 800x600px. Max size: 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="specialty" className="text-sm font-medium">
                Specialty
              </label>
              <Input
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="What is this shop known for?"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="hours" className="text-sm font-medium">
                Operating Hours
              </label>
              <Input
                id="hours"
                name="hours"
                value={`${formData.hours.open} - ${formData.hours.close}`}
                onChange={handleChange}
                placeholder="e.g., 9:00 AM - 5:00 PM"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (comma-separated)
              </label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., traditional, modern, organic"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tea-shops')}
                disabled={isLoading || isUploading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isUploading}>
                {isLoading ? "Adding..." : "Add Tea Shop"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTeaShopPage; 