import React from 'react';
import * as THREE from 'three';
import { Shelter } from '../../../../types';

interface BosquetShelterProps {
  shelter: Shelter;
  materials: {
    frame: THREE.Material;
    walls: THREE.Material;
    roof: THREE.Material;
  };
}

const BosquetShelter: React.FC<BosquetShelterProps> = ({ shelter, materials }) => {
  const wallHeight = 2.5;
  const wallThickness = 0.1;

  return (
    <group 
      position={[shelter.position.x, 0, shelter.position.y]} 
      rotation={[0, shelter.rotation, 0]}
    >
      {/* Poteaux verticaux */}
      {[
        [-shelter.dimensions.width/2, 0],
        [shelter.dimensions.width/2, 0],
        [-shelter.dimensions.width/2, -shelter.dimensions.depth],
        [shelter.dimensions.width/2, -shelter.dimensions.depth]
      ].map(([x, z], i) => (
        <mesh key={`post-${i}`} position={[x, wallHeight/2, z]}>
          <boxGeometry args={[0.1, wallHeight, 0.1]} />
          <primitive object={materials.frame} />
        </mesh>
      ))}

      {/* Parois en bois thermowood */}
      <mesh position={[-shelter.dimensions.width/2, wallHeight/2, -shelter.dimensions.depth/2]}>
        <boxGeometry args={[wallThickness, wallHeight, shelter.dimensions.depth]} />
        <primitive object={materials.walls} />
      </mesh>

      <mesh position={[shelter.dimensions.width/2, wallHeight/2, -shelter.dimensions.depth/2]}>
        <boxGeometry args={[wallThickness, wallHeight, shelter.dimensions.depth]} />
        <primitive object={materials.walls} />
      </mesh>

      <mesh position={[0, wallHeight/2, -shelter.dimensions.depth]}>
        <boxGeometry args={[shelter.dimensions.width, wallHeight, wallThickness]} />
        <primitive object={materials.walls} />
      </mesh>

      {/* Toit */}
      <mesh position={[0, wallHeight + 0.05, -shelter.dimensions.depth/2]} rotation={[-Math.PI/2, 0, 0]}>
        <boxGeometry args={[shelter.dimensions.width + 0.2, shelter.dimensions.depth + 0.2, 0.1]} />
        <primitive object={materials.roof} />
      </mesh>

      {/* Sol */}
      <mesh position={[0, 0.01, -shelter.dimensions.depth/2]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[shelter.dimensions.width, shelter.dimensions.depth]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

export default BosquetShelter;