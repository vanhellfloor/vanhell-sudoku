import React from 'react';
import { Difficulty } from '../types';
import { Star, RotateCcw } from 'lucide-react';

interface LevelSelectProps {
  onLevelSelect: (level: number, diff: Difficulty) => void;
  onResetProgress: () => void;
  completedLevels: number[];
}

const LevelSelect: React.FC<LevelSelectProps> = ({ onLevelSelect, onResetProgress, completedLevels }) => {
  const levels = Array.from({ length: 100 }, (_, i) => i + 1);

  const getDifficulty = (level: number): Difficulty => {
    if (level <= 25) return 'Easy';
    if (level <= 50) return 'Medium';
    if (level <= 75) return 'Hard';
    return 'Expert';
  };

  const getDifficultyColor = (d: Difficulty) => {
    switch (d) {
      case 'Easy': return 'bg-emerald-500';
      case 'Medium': return 'bg-amber-500';
      case 'Hard': return 'bg-orange-500';
      case 'Expert': return 'bg-rose-500';
    }
  };

  const handleReset = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser toute votre progression ? Les étoiles seront effacées et de nouvelles grilles seront générées.")) {
      onResetProgress();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto p-6 overflow-hidden">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 uppercase tracking-wide">VANHELL SUDOKU</h1>
        <p className="text-slate-500">Choisissez votre niveau</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-4 pr-2">
        <div className="grid grid-cols-4 gap-3">
          {levels.map((level) => {
            const isCompleted = completedLevels.includes(level);
            // In a real app, we might lock future levels. For now, all open for demo fun.
            const isLocked = false; 
            const difficulty = getDifficulty(level);
            const colorClass = getDifficultyColor(difficulty);

            return (
              <button
                key={level}
                onClick={() => !isLocked && onLevelSelect(level, difficulty)}
                className={`
                  relative aspect-square rounded-2xl flex flex-col items-center justify-center shadow-sm transition-all
                  ${isCompleted ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 hover:shadow-md hover:-translate-y-1'}
                  ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isCompleted ? (
                   <Star size={20} className="fill-yellow-400 text-yellow-400 mb-1" />
                ) : (
                  <span className="text-lg font-bold">{level}</span>
                )}
                
                {/* Difficulty Dot */}
                {!isCompleted && (
                  <div className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${colorClass}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Footer Area: Legend + Reset Button */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center gap-4">
        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Facile</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Moyen</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Difficile</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Expert</div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 text-rose-500 bg-rose-50/50 hover:bg-rose-100 rounded-xl transition-all active:scale-95 group"
        >
          <RotateCcw size={16} className="group-hover:-rotate-180 transition-transform duration-500" />
          <span className="text-xs font-semibold uppercase tracking-wide">Réinitialiser la progression</span>
        </button>
      </div>
    </div>
  );
};

export default LevelSelect;