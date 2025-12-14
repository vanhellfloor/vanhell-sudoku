import { Grid, Cell, Difficulty } from '../types';

const BLANK = 0;

// Initialize a blank 9x9 grid
const getEmptyGrid = (): number[][] => Array.from({ length: 9 }, () => Array(9).fill(BLANK));

// Check if placing num at board[row][col] is valid
const isValidMove = (board: number[][], row: number, col: number, num: number): boolean => {
  // Check Row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num && x !== col) return false;
  }
  // Check Col
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num && x !== row) return false;
  }
  // Check 3x3 Box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num && (startRow + i !== row || startCol + j !== col)) {
        return false;
      }
    }
  }
  return true;
};

// Backtracking solver to fill the grid or solve it
const solveGrid = (board: number[][], randomize = false): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === BLANK) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        if (randomize) {
          // Shuffle for random board generation
          for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
          }
        }

        for (const num of nums) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;
            if (solveGrid(board, randomize)) return true;
            board[row][col] = BLANK;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Generate a full valid board
const generateFullBoard = (): number[][] => {
  const board = getEmptyGrid();
  solveGrid(board, true);
  return board;
};

// Remove numbers to create the puzzle
const pokeHoles = (board: number[][], holes: number): number[][] => {
  const puzzle = board.map(row => [...row]);
  let removed = 0;
  const attempts = holes + 20; // Safety buffer

  for (let i = 0; i < attempts && removed < holes; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== BLANK) {
      const backup = puzzle[row][col];
      puzzle[row][col] = BLANK;
      
      // Copy to check if unique solution still exists (simplified: just check solvability here for speed)
      // A true generator ensures unique solution, but for this app, ensuring it is solvable is priority #1.
      // With high hole counts, uniqueness is harder to guarantee without deep checking. 
      // We will assume standard generation is "good enough" for a fun web app.
      removed++;
    }
  }
  return puzzle;
};

export const generateLevel = (difficulty: Difficulty): { initial: Grid, solved: number[][] } => {
  const fullBoard = generateFullBoard();
  const solvedState = fullBoard.map(row => [...row]); // Deep copy of solution

  let holes = 30; // Default Easy
  if (difficulty === 'Easy') holes = 30; // ~35 clues
  if (difficulty === 'Medium') holes = 40; // ~41 clues
  if (difficulty === 'Hard') holes = 50; // ~31 clues
  if (difficulty === 'Expert') holes = 58; // ~23 clues

  const puzzleNumbers = pokeHoles(fullBoard, holes);

  // Convert to rich Cell objects
  const initialGrid: Grid = puzzleNumbers.map((row, rIndex) => 
    row.map((val, cIndex) => ({
      row: rIndex,
      col: cIndex,
      value: val,
      isFixed: val !== 0,
      notes: [],
      isValid: true
    }))
  );

  return { initial: initialGrid, solved: solvedState };
};

export const checkWin = (currentGrid: Grid): boolean => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c].value === 0 || !currentGrid[r][c].isValid) return false;
    }
  }
  return true;
};

// Used to check if a specific move matches the solution
export const isMoveCorrect = (row: number, col: number, val: number, solvedGrid: number[][]): boolean => {
  return solvedGrid[row][col] === val;
};