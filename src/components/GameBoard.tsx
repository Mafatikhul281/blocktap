
import { useState, useEffect } from "react";
import { BlockState, BlockColor, Point, GameState } from "@/types/gameTypes";
import Block from "./Block";
import { v4 as uuidv4 } from "uuid";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const COLORS: BlockColor[] = [
  "gameBlue", 
  "gameRed", 
  "gameGreen", 
  "gameYellow", 
  "gamePurple",
  "gameOrange"
];

const ROWS = 9;
const COLS = 7;

interface GameBoardProps {
  onScoreUpdate: (points: number) => void;
  onGameOver: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ onScoreUpdate, onGameOver }) => {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    score: 0,
    isGameOver: false
  });
  
  const [selectedBlock, setSelectedBlock] = useState<Point | null>(null);
  const [matchedBlocks, setMatchedBlocks] = useState<Point[]>([]);
  const { initSounds, playSound } = useSoundEffects();

  // Initialize the game board
  useEffect(() => {
    initializeGame();
    initSounds();
  }, []);

  // Initialize the game with random blocks
  const initializeGame = () => {
    const newGrid: BlockState[][] = [];
    
    for (let row = 0; row < ROWS; row++) {
      const newRow: BlockState[] = [];
      for (let col = 0; col < COLS; col++) {
        newRow.push({
          id: uuidv4(),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          isMatched: false
        });
      }
      newGrid.push(newRow);
    }
    
    setGameState({
      grid: newGrid,
      score: 0,
      isGameOver: false
    });
  };

  // Check if two blocks are adjacent
  const isAdjacent = (pos1: Point, pos2: Point): boolean => {
    return (
      (pos1.row === pos2.row && Math.abs(pos1.col - pos2.col) === 1) ||
      (pos1.col === pos2.col && Math.abs(pos1.row - pos2.row) === 1)
    );
  };

  // Find all connected blocks of the same color using BFS
  const findConnectedBlocks = (startPos: Point): Point[] => {
    const { grid } = gameState;
    const color = grid[startPos.row][startPos.col].color;
    const visited: boolean[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    const connected: Point[] = [];
    const queue: Point[] = [startPos];
    
    visited[startPos.row][startPos.col] = true;
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      connected.push(current);
      
      // Check all 4 directions
      const directions = [
        { row: -1, col: 0 }, // up
        { row: 1, col: 0 },  // down
        { row: 0, col: -1 }, // left
        { row: 0, col: 1 }   // right
      ];
      
      for (const dir of directions) {
        const newRow = current.row + dir.row;
        const newCol = current.col + dir.col;
        
        // Check if the new position is valid
        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS &&
          !visited[newRow][newCol] &&
          grid[newRow][newCol].color === color
        ) {
          visited[newRow][newCol] = true;
          queue.push({ row: newRow, col: newCol });
        }
      }
    }
    
    return connected;
  };

  // Handle block click
  const handleBlockClick = (position: Point) => {
    if (gameState.isGameOver) return;
    
    const connectedBlocks = findConnectedBlocks(position);
    
    // Need at least 2 connected blocks to be valid
    if (connectedBlocks.length < 2) {
      return;
    }
    
    setSelectedBlock(position);
    setMatchedBlocks(connectedBlocks);
    
    // Play match sound
    playSound('match');
    
    // Mark matched blocks
    const newGrid = [...gameState.grid];
    connectedBlocks.forEach(pos => {
      newGrid[pos.row][pos.col] = {
        ...newGrid[pos.row][pos.col],
        isMatched: true
      };
    });
    
    setGameState(prev => ({
      ...prev,
      grid: newGrid
    }));
    
    // Clear blocks and update score after a delay
    setTimeout(() => {
      clearMatchedBlocks(connectedBlocks);
    }, 300);
  };

  // Clear matched blocks and update score
  const clearMatchedBlocks = (connectedBlocks: Point[]) => {
    const newScore = gameState.score + calculateScore(connectedBlocks.length);
    onScoreUpdate(newScore);
    
    const newGrid = [...gameState.grid];
    
    // Remove matched blocks
    connectedBlocks.forEach(pos => {
      // Shift blocks down
      for (let row = pos.row; row > 0; row--) {
        newGrid[row][pos.col] = { ...newGrid[row - 1][pos.col], isMatched: false };
      }
      
      // Create new block at the top
      newGrid[0][pos.col] = {
        id: uuidv4(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        isMatched: false
      };
    });
    
    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      score: newScore
    }));
    
    // Reset selections
    setSelectedBlock(null);
    setMatchedBlocks([]);
    
    // Check if game is over
    if (isGameOver(newGrid)) {
      setGameState(prev => ({
        ...prev,
        isGameOver: true
      }));
      playSound('gameOver');
      onGameOver();
    }
  };

  // Calculate score based on number of blocks cleared
  const calculateScore = (numBlocks: number): number => {
    return numBlocks * numBlocks * 5;
  };

  // Check if there are any valid moves left
  const isGameOver = (grid: BlockState[][]): boolean => {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const connected = findConnectedBlocksForGrid(grid, { row, col });
        if (connected.length >= 2) {
          return false;
        }
      }
    }
    return true;
  };

  // Helper function to find connected blocks for a specific grid
  const findConnectedBlocksForGrid = (grid: BlockState[][], startPos: Point): Point[] => {
    const color = grid[startPos.row][startPos.col].color;
    const visited: boolean[][] = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    const connected: Point[] = [];
    const queue: Point[] = [startPos];
    
    visited[startPos.row][startPos.col] = true;
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      connected.push(current);
      
      // Check all 4 directions
      const directions = [
        { row: -1, col: 0 }, // up
        { row: 1, col: 0 },  // down
        { row: 0, col: -1 }, // left
        { row: 0, col: 1 }   // right
      ];
      
      for (const dir of directions) {
        const newRow = current.row + dir.row;
        const newCol = current.col + dir.col;
        
        // Check if the new position is valid
        if (
          newRow >= 0 && newRow < ROWS &&
          newCol >= 0 && newCol < COLS &&
          !visited[newRow][newCol] &&
          grid[newRow][newCol].color === color
        ) {
          visited[newRow][newCol] = true;
          queue.push({ row: newRow, col: newCol });
        }
      }
    }
    
    return connected;
  };

  // Check if a block is adjacent to the selected block
  const isBlockAdjacent = (pos: Point): boolean => {
    if (!selectedBlock) return false;
    return isAdjacent(pos, selectedBlock);
  };

  // Restart the game
  const restartGame = () => {
    initializeGame();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-7 gap-1 bg-gray-800 p-2 rounded-lg">
        {gameState.grid.map((row, rowIndex) => (
          row.map((block, colIndex) => (
            <div 
              key={block.id} 
              className="aspect-square"
              style={{ animation: block.isMatched ? "" : "fall 0.3s ease-in-out" }}
            >
              <Block 
                block={block}
                position={{ row: rowIndex, col: colIndex }}
                onClick={handleBlockClick}
                isSelected={
                  selectedBlock?.row === rowIndex && 
                  selectedBlock?.col === colIndex
                }
                isAdjacent={
                  isBlockAdjacent({ row: rowIndex, col: colIndex })
                }
              />
            </div>
          ))
        ))}
      </div>
      {gameState.isGameOver && (
        <div className="mt-4 flex justify-center">
          <button 
            onClick={restartGame}
            className="bg-gameBlue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
