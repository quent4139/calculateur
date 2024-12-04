import React from 'react';
import { Html } from '@react-three/drei';
import { Trash2, Move, RotateCcw } from 'lucide-react';
import { Point } from '../../types';

interface ElementControlsProps {
  position: Point;
  onDelete: () => void;
  onStartDrag: () => void;
  onRotate?: () => void;
  canRotate?: boolean;
}

const ElementControls: React.FC<ElementControlsProps> = ({ 
  position, 
  onDelete, 
  onStartDrag,
  onRotate,
  canRotate = false
}) => {
  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <group position={[position.x, 0.3, position.y]}>
      <Html center>
        <div 
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => handleClick(e, onStartDrag)}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg transition-colors"
            title="Déplacer"
          >
            <Move className="w-4 h-4" />
          </button>
          {canRotate && onRotate && (
            <button
              onClick={(e) => handleClick(e, onRotate)}
              className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 shadow-lg transition-colors"
              title="Pivoter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => handleClick(e, onDelete)}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </Html>
    </group>
  );
};

export default ElementControls;