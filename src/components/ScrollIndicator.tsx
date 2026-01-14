import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollIndicatorProps {
  variant?: 'classic' | 'modern';
}

export function ScrollIndicator({ variant = 'classic' }: ScrollIndicatorProps) {
  const [showScrollDown, setShowScrollDown] = useState(true);
  const [showScrollUp, setShowScrollUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      
      // Show scroll down if near top (within 100px)
      setShowScrollDown(scrollTop < 100);
      
      // Show scroll up if near bottom (within 200px of bottom)
      setShowScrollUp(scrollTop + clientHeight >= scrollHeight - 200);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  };

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isModern = variant === 'modern';

  if (!showScrollDown && !showScrollUp) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {showScrollDown && (
        <button
          onClick={scrollDown}
          className={cn(
            "group flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-bounce",
            isModern
              ? "bg-gradient-to-r from-qx-orange to-amber-500 text-white hover:shadow-qx-orange/40"
              : "bg-accent text-accent-foreground hover:shadow-gold"
          )}
          aria-label="Scroll down to see more content"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      )}
      
      {showScrollUp && (
        <button
          onClick={scrollUp}
          className={cn(
            "group flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
            isModern
              ? "bg-gradient-to-r from-qx-blue to-qx-blue-dark text-white hover:shadow-qx-blue/40"
              : "bg-primary text-primary-foreground hover:shadow-lg"
          )}
          aria-label="Scroll back to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
