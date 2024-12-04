import React from 'react';
import { Html } from '@react-three/drei';
import { Wall, Point } from '../../../../types';

interface WallMeasurementsProps {
  wall: Wall;
  isSelected?: boolean;
}

const WallMeasurements: React.FC<WallMeasurementsProps> = ({ wall, isSelected }) => {
  const center = {
    x: (wall.start.x + wall.end.x) / 2,
    y: (wall.start.y + wall.end.y) / 2
  };

  const length = Math.sqrt(
    Math.pow(wall.end.x - wall.start.x, 2) +
    Math.pow(wall.end.y - wall.start.y, 2)
  );

  return (
    <group position={[center.x, 0.2, center.y]}>
      <Html center>
        <div className="bg-white/90 px-2 py-1 rounded shadow text-sm">
          {length.toFixed(2)}m
        </div>
      </Html>
    </group>
  );
};

export default WallMeasurements;