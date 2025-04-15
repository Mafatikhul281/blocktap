
export type BlockColor = 'gameBlue' | 'gameRed' | 'gameGreen' | 'gameYellow' | 'gamePurple' | 'gameOrange';

export type BlockState = {
  id: string;
  color: BlockColor;
  isMatched: boolean;
};

export type Point = {
  row: number;
  col: number;
};

export type GameState = {
  grid: BlockState[][];
  score: number;
  isGameOver: boolean;
};
