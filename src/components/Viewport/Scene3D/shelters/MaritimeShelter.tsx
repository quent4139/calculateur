import React from 'react';
import * as THREE from 'three';
import { Shelter } from '../../../../types';

interface MaritimeShelterProps {
  shelter: Shelter;
  materials: {
    container: THREE.Material;
    interior: THREE.Material;
    floor: THREE.Material;
  };
}

const MaritimeShelter: React.FC<MaritimeShelterProps> = ({ shelter, materials }) => {
  const wallHeight = 2.5;
  const wallThickness = 0.1;

  return (
    <group 
      position={[shelter.position.x, 0, shelter.position.y]} 
      rotation={[0, shelter.rotation, 0]}
    >
      {/* Structure principale */}
      <group position={[0, wallHeight/2, -shelter.dimensions.depth/2]}>
        {/* Parois extérieures */}
        <mesh position={[-shelter.dimensions.width/2, 0, 0]}>
          <boxGeometry args={[wallThickness, wallHeight, shelter.dimensions.depth]} />
          <primitive object={materials.container} />
        </mesh>
        <mesh position={[shelter.dimensions.width/2, 0, 0]}>
          <boxGeometry args={[wallThickness, wallHeight, shelter.dimensions.depth]} />
          <primitive object={materials.container} />
        </mesh>
        <mesh position={[0, 0, -shelter.dimensions.depth/2]}>
          <boxGeometry args={[shelter.dimensions.width, wallHeight, wallThickness]} />
          <primitive object={materials.container} />
        </mesh>

        {/* Toit */}
        <mesh position={[0, wallHeight/2, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <boxGeometry args={[shelter.dimensions.width, shelter.dimensions.depth, wallThickness]} />
          <primitive object={materials.container} />
        </mesh>

        {/* Sol */}
        <mesh position={[0, -wallHeight/2 + 0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[shelter.dimensions.width - 2*wallThickness, shelter.dimensions.depth - wallThickness]} />
          <primitive object={materials.floor} />
        </mesh>
      </group>
    </group>
  );
};

export default MaritimeShelter;