import React from 'react';
import { Html } from '@react-three/drei';
import { CustomMeasurement } from '../../types';
import { X } from 'lucide-react';

interface CustomMeasurementsProps {
  measurements: CustomMeasurement[];
  onRemove: (id: string) => void;
}

const CustomMeasurements: React.FC<CustomMeasurementsProps> = ({ measurements, onRemove }) => {
  return (
    <group>
      {measurements.map((measurement) => (
        <group key={measurement.id}>
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
            <lineBasicMaterial color="#ef4444" />
          </line>
          <group position={[
            (measurement.start.x + measurement.end.x) / 2,
            0.2,
            (measurement.start.y + measurement.end.y) / 2
          ]}>
            <Html center>
              <div className="flex items-center gap-2 text-sm px-2 py-1 rounded bg-red-500 text-white shadow-md">
                <span>{measurement.value.toFixed(2)}m</span>
                <button
                  onClick={() => onRemove(measurement.id)}
                  className="hover:bg-red-600 rounded p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </Html>
          </group>
        </group>
      ))}
    </group>
  );
};

export default CustomMeasurements;