
import React from 'react';
import Navbar from './Navbar';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-tea-cream/20 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-8 pb-6">
        {children}
      </main>
      <footer className="bg-white dark:bg-gray-900 py-4 text-center text-sm text-muted-foreground transition-colors duration-300">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} TeaRate - Rate Your Favorite Tea Shops</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
