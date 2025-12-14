export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export interface Cell {
  row: number;
  col: number;
  value: number; // 0 for empty
  isFixed: boolean; // Part of the initial puzzle
  notes: number[]; // Pencil marks
  isValid: boolean; // For visual error indication
}

export type Grid = Cell[][];

export interface LevelConfig {
  id: number;
  difficulty: Difficulty;
  minRemovals: number;
  maxRemovals: number;
}

export enum GameStatus {
  IDLE,
  PLAYING,
  WON,
}

export interface Move {
  row: number;
  col: number;
  oldValue: number;
  newValue: number;
  wasNote: boolean;
}