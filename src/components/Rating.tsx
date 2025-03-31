
import React from 'react';

interface RatingProps {
  value: number;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ value, className = "" }) => {
  // Round to nearest half
  const roundedValue = Math.round(value * 2) / 2;
  
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        let starType;
        
        if (starValue <= roundedValue) {
          starType = 'full';
        } else if (starValue - 0.5 === roundedValue) {
          starType = 'half';
        } else {
          starType = 'empty';
        }
        
        return (
          <span key={i} className="relative text-xl mr-1">
            {starType === 'full' && (
              <span className="text-yellow-500">★</span>
            )}
            {starType === 'half' && (
              <span className="text-yellow-500 absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                ★
                <span className="text-gray-300 absolute inset-0">☆</span>
              </span>
            )}
            {starType === 'empty' && (
              <span className="text-gray-300">☆</span>
            )}
          </span>
        );
      })}
      <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        {value.toFixed(1)}
      </span>
    </div>
  );
};

export default Rating;
