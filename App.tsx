import React, { useState, useEffect } from 'react';
import { Difficulty, GameStatus, Grid } from './types';
import { generateLevel, isMoveCorrect, checkWin } from './services/sudokuLogic';
import LevelSelect from './components/LevelSelect';
import GameHeader from './components/GameHeader';
import SudokuBoard from './components/SudokuBoard';
import Controls from './components/Controls';
import { Trophy } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  
  // Initialize completedLevels from localStorage to persist progress
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('sudoku-completed-levels');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn("Could not load progress", e);
      return [];
    }
  });

  // Save progress automatically whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sudoku-completed-levels', JSON.stringify(completedLevels));
    } catch (e) {
      console.warn("Could not save progress", e);
    }
  }, [completedLevels]);

  // Game State
  const [grid, setGrid] = useState<Grid>([]);
  const [solvedGrid, setSolvedGrid] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [mistakes, setMistakes] = useState(0);
  const [relatedCells, setRelatedCells] = useState<boolean[][]>([]);
  
  // Initialize related cells array
  useEffect(() => {
    setRelatedCells(Array(9).fill(null).map(() => Array(9).fill(false)));
  }, []);

  // Update highlighting when selection changes
  useEffect(() => {
    if (!selectedCell) {
      setRelatedCells(Array(9).fill(null).map(() => Array(9).fill(false)));
      return;
    }

    const [r, c] = selectedCell;
    const newRelated = Array(9).fill(null).map(() => Array(9).fill(false));

    // Highlight Row & Col
    for (let i = 0; i < 9; i++) {
      newRelated[r][i] = true;
      newRelated[i][c] = true;
    }

    // Highlight Box
    const startRow = Math.floor(r / 3) * 3;
    const startCol = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        newRelated[startRow + i][startCol + j] = true;
      }
    }

    setRelatedCells(newRelated);
  }, [selectedCell]);

  const startGame = (level: number, diff: Difficulty) => {
    const { initial, solved } = generateLevel(diff);
    setGrid(initial);
    setSolvedGrid(solved);
    setCurrentLevel(level);
    setDifficulty(diff);
    setMistakes(0);
    setStatus(GameStatus.PLAYING);
    setSelectedCell(null);
  };

  const resetProgress = () => {
    setCompletedLevels([]);
    // LocalStorage will be cleared by the useEffect automatically
  };

  const handleCellClick = (row: number, col: number) => {
    if (status !== GameStatus.PLAYING) return;
    setSelectedCell([row, col]);
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell || status !== GameStatus.PLAYING) return;
    const [r, c] = selectedCell;
    const cell = grid[r][c];

    if (cell.isFixed) return;

    // Place Number directly (No notes mode anymore)
    if (cell.value === num) return; // No change

    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];

    const correct = isMoveCorrect(r, c, num, solvedGrid);
    
    if (correct) {
      newGrid[r][c] = { ...cell, value: num, isValid: true, notes: [] };
      setGrid(newGrid);

      // Check Win
      if (checkWin(newGrid)) {
        setStatus(GameStatus.WON);
        if (currentLevel && !completedLevels.includes(currentLevel)) {
          setCompletedLevels(prev => [...prev, currentLevel]);
        }
      }
    } else {
      // Mistake
      setMistakes(m => m + 1);
      newGrid[r][c] = { ...cell, value: num, isValid: false };
      setGrid(newGrid);
      
      // Auto-clear error after 1s for better UX
      setTimeout(() => {
           setGrid(currentGrid => {
               const g = [...currentGrid];
               g[r] = [...g[r]];
               // Only clear if it hasn't changed since
               if (g[r][c].value === num && !g[r][c].isValid) {
                   g[r][c] = { ...g[r][c], value: 0, isValid: true };
               }
               return g;
           });
      }, 800);
    }
  };

  const handleDelete = () => {
    if (!selectedCell || status !== GameStatus.PLAYING) return;
    const [r, c] = selectedCell;
    if (grid[r][c].isFixed) return;

    const newGrid = [...grid];
    newGrid[r][c] = { ...grid[r][c], value: 0, notes: [], isValid: true };
    setGrid(newGrid);
  };

  const getHighlightNumber = (): number | null => {
    if (selectedCell && grid[selectedCell[0]][selectedCell[1]].value !== 0) {
      return grid[selectedCell[0]][selectedCell[1]].value;
    }
    return null;
  };

  // Safe area handling is done via CSS environment variables
  
  if (!currentLevel) {
    return (
      <div className="h-[100dvh] w-full bg-slate-50 flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-hidden">
        <LevelSelect 
          onLevelSelect={startGame} 
          completedLevels={completedLevels} 
          onResetProgress={resetProgress}
        />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Win Modal Overlay */}
      {status === GameStatus.WON && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full animate-pop">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-500">
              <Trophy size={48} className="fill-current" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Niveau Réussi !</h2>
            <p className="text-slate-500 text-center mb-8">Incroyable ! Vous avez dominé ce niveau de difficulté {difficulty}.</p>
            <button 
              onClick={() => setCurrentLevel(null)}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-200"
            >
              Retour aux niveaux
            </button>
          </div>
        </div>
      )}

      {/* Header Section - Fixed Top */}
      <div className="flex-none pt-[env(safe-area-inset-top)] w-full max-w-md mx-auto z-10 bg-slate-50">
        <GameHeader 
          levelId={currentLevel} 
          difficulty={difficulty} 
          mistakes={mistakes} 
          onBack={() => setCurrentLevel(null)} 
          gameActive={status === GameStatus.PLAYING}
        />
      </div>

      {/* Main Game Area - Flexible Height */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center px-4 py-2">
        <SudokuBoard 
          grid={grid} 
          selectedCell={selectedCell} 
          onCellClick={handleCellClick}
          relatedCells={relatedCells}
          highlightNumber={getHighlightNumber()}
        />
      </div>

      {/* Controls Section - Fixed Bottom */}
      <div className="flex-none w-full max-w-md mx-auto bg-slate-50 pb-[env(safe-area-inset-bottom)] z-10">
        <Controls 
          onNumberClick={handleNumberInput}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default App;