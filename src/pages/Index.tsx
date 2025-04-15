
import { useState, useEffect } from "react";
import GameBoard from "@/components/GameBoard";
import ScoreBoard from "@/components/ScoreBoard";
import GameOverModal from "@/components/GameOverModal";
import HowToPlay from "@/components/HowToPlay";
import { Button } from "@/components/ui/button";
import { Puzzle, Trophy, XCircle, HelpCircle } from "lucide-react";

const Index = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Load high score from localStorage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('blockBlastHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Update high score when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('blockBlastHighScore', score.toString());
    }
  }, [score, highScore]);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
  };

  const handleRestart = () => {
    setScore(0);
    setIsGameOver(false);
  };
  
  // Show help modal on first visit
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('blockBlastHasSeenHelp');
    if (!hasSeenHelp) {
      setShowHelp(true);
      localStorage.setItem('blockBlastHasSeenHelp', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="w-full max-w-md mx-auto pt-4 px-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold flex items-center">
            <Puzzle className="mr-2 text-gameYellow" />
            BlockTap
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600">
              <Trophy className="w-4 h-4 text-gameYellow" />
            </Button>
            <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600">
              <XCircle className="w-4 h-4 text-gameRed" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-md mx-auto p-4">
        {/* Score Board */}
        <ScoreBoard score={score} highScore={highScore} />
        
        {/* Game Board */}
        <GameBoard 
          onScoreUpdate={handleScoreUpdate} 
          onGameOver={handleGameOver}
        />
        
        {/* Game Controls */}
        <div className="mt-4 text-center">
          <Button 
            onClick={handleRestart}
            variant="outline"
            className="bg-gray-700 border-gray-600 hover:bg-gray-600"
          >
            New Game
          </Button>
        </div>
        
        {/* Game Over Modal */}
        <GameOverModal 
          isOpen={isGameOver}
          score={score}
          highScore={highScore}
          onRestart={handleRestart}
        />
        
        {/* How to Play Modal */}
        {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
      </main>
      
      <footer className="max-w-md w-full mx-auto p-4 text-center text-gray-400 text-xs">
        <p>HudaCihuyy - 2025</p>
      </footer>
    </div>
  );
};

export default Index;
