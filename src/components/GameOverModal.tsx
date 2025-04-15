
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ 
  isOpen, 
  score, 
  highScore, 
  onRestart 
}) => {
  if (!isOpen) return null;

  const isHighScore = score >= highScore;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10 p-4">
      <div className="bg-gray-800 rounded-xl text-white p-5 w-full max-w-sm animate-scale-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-1">Game Over!</h2>
          <p className="text-gray-300 mb-4">No more moves available</p>
          
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="mb-3">
              <h3 className="text-sm text-gray-400">YOUR SCORE</h3>
              <p className="text-3xl font-bold">{score}</p>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-400">BEST SCORE</h3>
              <p className="text-3xl font-bold">{highScore}</p>
            </div>
            
            {isHighScore && score > 0 && (
              <div className="mt-3 text-gameYellow">
                <p className="text-sm font-bold">NEW HIGH SCORE!</p>
              </div>
            )}
          </div>
          
          <Button 
            onClick={onRestart}
            className="bg-gameGreen hover:bg-green-600 text-white font-bold py-3 px-5 rounded-lg w-full"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
