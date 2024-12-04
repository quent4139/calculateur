import React from 'react';
import { Html } from '@react-three/drei';
import { Point } from '../../../types';

interface MeasurementPreviewProps {
  start: Point;
  end: Point;
}

const MeasurementPreview: React.FC<MeasurementPreviewProps> = ({ start, end }) => {
  const distance = Math.sqrt(
    Math.pow(end.x - start.x, 2) +
    Math.pow(end.y - start.y, 2)
  );

  return (
    <group>
      {/* Points de début et fin */}
      <mesh position={[start.x, 0.15, start.y]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      <mesh position={[end.x, 0.15, end.y]}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Ligne de mesure */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              start.x, 0.15, start.y,
              end.x, 0.15, end.y
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ef4444" />
      </line>

      {/* Étiquette de distance */}
      <group position={[
        (start.x + end.x) / 2,
        0.2,
        (start.y + end.y) / 2
      ]}>
        <Html center>
          <div className="text-sm px-2 py-1 rounded bg-red-500 text-white shadow-md">
            {distance.toFixed(2)}m
          </div>
        </Html>
      </group>
    </group>
  );
};

export default MeasurementPreview;