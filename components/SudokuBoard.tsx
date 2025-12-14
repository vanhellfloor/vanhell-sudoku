import React from 'react';
import { Cell, Grid } from '../types';

interface SudokuBoardProps {
  grid: Grid;
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
  relatedCells: boolean[][]; 
  highlightNumber: number | null; 
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ 
  grid, 
  selectedCell, 
  onCellClick,
  relatedCells,
  highlightNumber
}) => {
  return (
    // Container that constrains the board to the smallest dimension (width or available height)
    <div className="aspect-square h-full max-h-full w-auto max-w-full bg-slate-800 p-1 rounded-2xl shadow-xl select-none flex-shrink-1">
      <div className="grid grid-cols-9 grid-rows-9 h-full w-full bg-slate-300 gap-[1px] border-2 border-slate-800 rounded-xl overflow-hidden">
        {grid.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((cell, colIndex) => {
              const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
              const isRelated = relatedCells[rowIndex][colIndex];
              const isHighlightedNumber = cell.value !== 0 && cell.value === highlightNumber;
              
              // Determine borders for 3x3 blocks
              const borderRight = (colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-2 border-r-slate-800' : '';
              const borderBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-2 border-b-slate-800' : '';

              let bgClass = 'bg-white';
              if (isSelected) bgClass = 'bg-primary text-white';
              else if (isHighlightedNumber) bgClass = 'bg-primary/20'; 
              else if (!cell.isValid) bgClass = 'bg-red-100 text-red-600'; 
              else if (isRelated) bgClass = 'bg-slate-100'; 
              
              const textClass = isSelected ? 'text-white' : (cell.isFixed ? 'text-slate-900 font-bold' : (cell.isValid ? 'text-primary font-medium' : 'text-red-500'));

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                  className={`
                    relative flex items-center justify-center text-[min(5vw,2.5vh)] md:text-2xl cursor-pointer transition-colors duration-75
                    ${borderRight} ${borderBottom}
                    ${bgClass}
                  `}
                >
                  {cell.value !== 0 && (
                    <span className={`${textClass} ${isSelected ? 'animate-pop' : ''}`}>
                      {cell.value}
                    </span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SudokuBoard;