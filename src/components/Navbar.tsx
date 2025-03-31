
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Home, PlusCircle, List } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center text-tea-leaf dark:text-tea-matcha font-bold text-xl"
            >
              <span className="ml-2 flex items-center">
                <span role="img" aria-label="tea" className="mr-2">🍵</span>
                {!isMobile && "TeaRate"}
              </span>
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link to="/">
              <Button variant="ghost" size={isMobile ? "icon" : "default"} className="text-tea-leaf dark:text-tea-matcha">
                <Home size={isMobile ? 20 : 18} />
                {!isMobile && <span className="ml-2">Home</span>}
              </Button>
            </Link>
            
            <Link to="/tea-shops">
              <Button variant="ghost" size={isMobile ? "icon" : "default"} className="text-tea-leaf dark:text-tea-matcha">
                <List size={isMobile ? 20 : 18} />
                {!isMobile && <span className="ml-2">All Shops</span>}
              </Button>
            </Link>
            
            <Link to="/add">
              <Button variant="ghost" size={isMobile ? "icon" : "default"} className="text-tea-leaf dark:text-tea-matcha">
                <PlusCircle size={isMobile ? 20 : 18} />
                {!isMobile && <span className="ml-2">Add Shop</span>}
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme} 
              className="text-tea-leaf dark:text-tea-matcha" 
            >
              {theme === 'dark' ? <Sun size={isMobile ? 20 : 18} /> : <Moon size={isMobile ? 20 : 18} />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
