import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, AlertCircle, Award } from 'lucide-react';
import { Difficulty } from '../types';

interface GameHeaderProps {
  levelId: number;
  difficulty: Difficulty;
  mistakes: number;
  onBack: () => void;
  gameActive: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({ levelId, difficulty, mistakes, onBack, gameActive }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (gameActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (d: Difficulty) => {
    switch (d) {
      case 'Easy': return 'text-emerald-500 bg-emerald-50';
      case 'Medium': return 'text-amber-500 bg-amber-50';
      case 'Hard': return 'text-orange-500 bg-orange-50';
      case 'Expert': return 'text-rose-500 bg-rose-50';
    }
  };

  return (
    <header className="flex items-center justify-between w-full max-w-md px-4 py-4 mb-2">
      <button 
        onClick={onBack}
        className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-xl font-bold text-slate-800">Niveau {levelId}</h1>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </span>
      </div>

      <div className="flex items-center space-x-3 text-slate-600 text-sm font-medium">
        <div className="flex items-center space-x-1">
          <AlertCircle size={16} className={mistakes > 2 ? "text-red-500" : "text-slate-400"} />
          <span>{mistakes}/3</span>
        </div>
        <div className="flex items-center space-x-1 min-w-[50px]">
          <Clock size={16} className="text-slate-400" />
          <span>{formatTime(seconds)}</span>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;