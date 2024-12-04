import React from 'react';
import { Html } from '@react-three/drei';
import { BikeRack } from '../../../../types';
import { DUO_RACK_DIMENSIONS } from '../../../../config/constants';

interface RackMeasurementsProps {
  rack: BikeRack;
}

const RackMeasurements: React.FC<RackMeasurementsProps> = ({ rack }) => {
  if (rack.type !== 'duo' || !rack.variant) return null;

  const width = DUO_RACK_DIMENSIONS.VARIANTS[rack.variant].width;
  const height = DUO_RACK_DIMENSIONS.HEIGHT;

  return (
    <group position={[rack.position.x, 0.2, rack.position.y]}>
      <Html center>
        <div className="px-2 py-1 bg-white/90 rounded shadow text-sm text-gray-700">
          {width.toFixed(2)}m × {height.toFixed(2)}m
        </div>
      </Html>
    </group>
  );
};

export default RackMeasurements;