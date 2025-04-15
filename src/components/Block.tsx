
import { useState, useEffect } from "react";
import { BlockState, Point } from "@/types/gameTypes";
import { cn } from "@/lib/utils";

interface BlockProps {
  block: BlockState;
  position: Point;
  onClick: (position: Point) => void;
  isSelected: boolean;
  isAdjacent: boolean;
}

const Block: React.FC<BlockProps> = ({ 
  block, 
  position, 
  onClick, 
  isSelected,
  isAdjacent 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  useEffect(() => {
    if (isSelected) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isSelected]);

  useEffect(() => {
    if (block.isMatched) {
      setIsFadingOut(true);
    } else {
      setIsFadingOut(false);
    }
  }, [block.isMatched]);

  // Map color to Tailwind classes
  const getBlockStyle = () => {
    switch(block.color) {
      case 'gameBlue':
        return 'bg-gameBlue';
      case 'gameRed':
        return 'bg-gameRed';
      case 'gameGreen':
        return 'bg-gameGreen';
      case 'gameYellow':
        return 'bg-gameYellow';
      case 'gamePurple':
        return 'bg-gamePurple';
      case 'gameOrange':
        return 'bg-gameOrange';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full rounded-md flex items-center justify-center cursor-pointer transition-all shadow-md",
        getBlockStyle(),
        isAnimating ? "pop-animation" : "",
        isFadingOut ? "fade-out-animation" : "",
        isSelected ? "ring-4 ring-white ring-opacity-70" : "",
        isAdjacent ? "ring-2 ring-white ring-opacity-40" : ""
      )}
      onClick={() => onClick(position)}
    >
      <div className="w-1/3 h-1/3 bg-white opacity-30 rounded-full"></div>
    </div>
  );
};

export default Block;
