
import { useState, useEffect } from 'react';

const useWidth = () => {
  // State for storing the current width
  const [width, setWidth] = useState<number | null>(null);


  

  useEffect(() => {
    // Ensure window is defined (this means we're on the client side)
    if (typeof window !== 'undefined') {
      // Function to update the width
      const updateWidth = () => {
        setWidth(window.innerWidth);
      };

      // Set the initial width
      updateWidth();

      // Add event listener for window resize
      window.addEventListener('resize', updateWidth);

      // Cleanup listener on unmount
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, []);

  return width;
};

export default useWidth;