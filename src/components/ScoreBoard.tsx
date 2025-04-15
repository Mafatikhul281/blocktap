
import { useState, useEffect } from "react";

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore }) => {
  const [isScoreIncreasing, setIsScoreIncreasing] = useState(false);
  
  useEffect(() => {
    if (score > 0) {
      setIsScoreIncreasing(true);
      const timer = setTimeout(() => setIsScoreIncreasing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [score]);
  
  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg p-3 text-center mb-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-md p-2">
          <h3 className="text-gray-300 text-sm font-bold mb-1">SCORE</h3>
          <p className={`text-white text-2xl font-bold ${isScoreIncreasing ? 'pop-animation text-gameYellow' : ''}`}>
            {score}
          </p>
        </div>
        <div className="bg-gray-700 rounded-md p-2">
          <h3 className="text-gray-300 text-sm font-bold mb-1">BEST</h3>
          <p className="text-white text-2xl font-bold">
            {highScore}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
