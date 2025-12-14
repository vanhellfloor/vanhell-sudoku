import React from 'react';
import { Eraser } from 'lucide-react';

interface ControlsProps {
  onNumberClick: (num: number) => void;
  onDelete: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  onNumberClick, 
  onDelete
}) => {
  return (
    <div className="w-full flex flex-col gap-2 px-4 pb-2">
      {/* Tools Row */}
      <div className="flex justify-end px-2 mb-1">
        <button 
          onClick={onDelete}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-red-500 transition-colors"
        >
          <div className="p-2.5 rounded-full bg-slate-100 hover:bg-red-50">
            <Eraser size={20} />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider">Effacer</span>
        </button>
      </div>

      {/* Numpad */}
      <div className="grid grid-cols-9 gap-1 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            className="aspect-[4/5] sm:aspect-square flex items-center justify-center text-xl font-medium text-primary bg-white rounded-lg shadow-sm border border-slate-200 active:scale-95 active:bg-slate-100 hover:bg-primary hover:text-white transition-all"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Controls;