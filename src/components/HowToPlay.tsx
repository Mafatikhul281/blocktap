
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface HowToPlayProps {
  onClose: () => void;
}

const HowToPlay: React.FC<HowToPlayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10 p-4">
      <div className="bg-gray-800 rounded-xl text-white p-5 w-full max-w-sm animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">How To Play</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <h3 className="font-bold mb-2 text-gameYellow">Match Blocks</h3>
            <p className="text-sm text-gray-300">
              Tap on groups of 2 or more adjacent blocks of the same color to remove them.
            </p>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h3 className="font-bold mb-2 text-gameYellow">Score Points</h3>
            <p className="text-sm text-gray-300">
              Clearing larger groups of blocks gives you more points. The formula is: 
              (number of blocks)² × 5
            </p>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h3 className="font-bold mb-2 text-gameYellow">Game Over</h3>
            <p className="text-sm text-gray-300">
              The game ends when there are no more valid matches on the board.
              Try to get the highest score!
            </p>
          </div>
        </div>
        
        <Button 
          onClick={onClose}
          className="w-full mt-6 bg-gameGreen hover:bg-green-600"
        >
          Got it!
        </Button>
      </div>
    </div>
  );
};

export default HowToPlay;
