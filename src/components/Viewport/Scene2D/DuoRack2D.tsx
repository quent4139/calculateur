import React from 'react';
import { Html } from '@react-three/drei';
import { DUO_RACK_DIMENSIONS } from '../../../config/constants';
import { Point } from '../../../types';

interface DuoRack2DProps {
  position: Point;
  variant: '4+4' | '6+6' | '8+8';
  rotation?: number;
  isSelected?: boolean;
  onClick?: (event: any) => void;
}

const DuoRack2D: React.FC<DuoRack2DProps> = ({
  position,
  variant,
  rotation = 0,
  isSelected = false,
  onClick
}) => {
  const width = DUO_RACK_DIMENSIONS.VARIANTS[variant].width;
  const height = DUO_RACK_DIMENSIONS.HEIGHT;
  const rackCount = parseInt(variant.split('+')[0]);
  const spacing = width / (rackCount - 1);

  return (
    <group
      position={[position.x, 0.01, position.y]}
      rotation={[0, rotation, 0]}
      onClick={onClick}
    >
      {/* Base structure */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[width, 0.1, height]} />
        <meshStandardMaterial 
          color={isSelected ? '#3b82f6' : '#9333ea'} 
          transparent 
          opacity={0.8}
        />
      </mesh>

      {/* Individual racks */}
      {Array.from({ length: rackCount }).map((_, i) => {
        const xOffset = -width/2 + i * spacing;
        return (
          <group key={`rack-${i}`}>
            {/* Vertical support */}
            <mesh position={[xOffset, 0.1, 0]}>
              <boxGeometry args={[0.1, 0.1, height]} />
              <meshStandardMaterial 
                color={isSelected ? '#3b82f6' : '#9333ea'} 
                transparent 
                opacity={0.8}
              />
            </mesh>
          </group>
        );
      })}

      {/* Variant label */}
      <group position={[0, 0.2, -height/2 - 0.2]}>
        <Html center>
          <div className="px-2 py-1 bg-white/90 rounded shadow text-sm">
            Rack {variant}
          </div>
        </Html>
      </group>

      {/* Circulation space indicator */}
      <mesh
        position={[0, 0.001, DUO_RACK_DIMENSIONS.CIRCULATION_SPACE/2]}
        rotation={[-Math.PI/2, 0, 0]}
      >
        <planeGeometry args={[width, DUO_RACK_DIMENSIONS.CIRCULATION_SPACE]} />
        <meshBasicMaterial 
          color={isSelected ? '#3b82f6' : '#9333ea'} 
          transparent 
          opacity={0.1} 
        />
      </mesh>
    </group>
  );
};

export default DuoRack2D;