import React from 'react';
import { Html } from '@react-three/drei';
import { Shelter } from '../../../../types';

interface ShelterMeasurementsProps {
  shelter: Shelter;
}

const ShelterMeasurements: React.FC<ShelterMeasurementsProps> = ({ shelter }) => {
  return (
    <>
      {/* Width measurement */}
      <group position={[shelter.position.x, 0.2, shelter.position.y - shelter.dimensions.depth/2]}>
        <Html center>
          <div className="px-2 py-1 bg-white/90 rounded shadow text-sm text-gray-700">
            {shelter.dimensions.width.toFixed(2)}m
          </div>
        </Html>
      </group>

      {/* Depth measurement */}
      <group position={[shelter.position.x - shelter.dimensions.width/2, 0.2, shelter.position.y]}>
        <Html center>
          <div className="px-2 py-1 bg-white/90 rounded shadow text-sm text-gray-700">
            {shelter.dimensions.depth.toFixed(2)}m
          </div>
        </Html>
      </group>
    </>
  );
};

export default ShelterMeasurements;