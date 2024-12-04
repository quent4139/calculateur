import React from 'react';
import { Html } from '@react-three/drei';
import { Measurement } from '../../utils/measurements';

interface MeasurementsProps {
  measurements: Measurement[];
}

const Measurements: React.FC<MeasurementsProps> = ({ measurements }) => {
  return (
    <group>
      {measurements.map((measurement, index) => (
        <group key={`${measurement.type}-${index}`}>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  measurement.start.x, 0.15, measurement.start.y,
                  measurement.end.x, 0.15, measurement.end.y
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={
              measurement.type === 'wall-to-rack' ? '#3b82f6' :
              measurement.type === 'rack-to-rack' ? '#8b5cf6' :
              '#64748b'
            } />
          </line>
          <group position={[
            (measurement.start.x + measurement.end.x) / 2,
            0.2,
            (measurement.start.y + measurement.end.y) / 2
          ]}>
            <Html center>
              <div className="text-xs px-1 py-0.5 rounded bg-white/90 shadow text-gray-700">
                {measurement.label}
              </div>
            </Html>
          </group>
        </group>
      ))}
    </group>
  );
};

export default Measurements;