import React from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { BikeRack } from '../../../types';
import { BIKE_RACK_DIMENSIONS, DUO_RACK_DIMENSIONS } from '../../../config/constants';
import Bike from './Bike';

interface BikeRackWithBikesProps {
  rack: BikeRack;
}

const DuoRackModel: React.FC<{ position: [number, number, number], rotation: number }> = ({ position, rotation }) => {
  const { scene } = useGLTF('https://quent4139.github.io/calculateur-espacement/test-abri.glb');
  
  return (
    <primitive 
      object={scene.clone()} 
      position={position}
      rotation={[0, rotation, 0]}
      scale={[1, 1, 1]} // Adjust scale if needed based on the model
    />
  );
};

const BikeRackWithBikes: React.FC<BikeRackWithBikesProps> = ({ rack }) => {
  if (rack.type === 'duo' && rack.variant) {
    return (
      <DuoRackModel 
        position={[rack.position.x, 0, rack.position.y]}
        rotation={rack.rotation}
      />
    );
  }

  // Regular Oura rack
  return (
    <group
      position={[rack.position.x, 0, rack.position.y]}
      rotation={[0, rack.rotation, 0]}
    >
      <mesh>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(-BIKE_RACK_DIMENSIONS.WIDTH / 2, 0, 0),
              new THREE.Vector3(-BIKE_RACK_DIMENSIONS.WIDTH / 2, BIKE_RACK_DIMENSIONS.HEIGHT, 0),
              new THREE.Vector3(BIKE_RACK_DIMENSIONS.WIDTH / 2, BIKE_RACK_DIMENSIONS.HEIGHT, 0),
              new THREE.Vector3(BIKE_RACK_DIMENSIONS.WIDTH / 2, 0, 0),
            ]),
            64,
            0.02,
          ]}
        />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </mesh>

      {rack.bikes?.left && (
        <Bike 
          position={[0, 0, -BIKE_RACK_DIMENSIONS.WIDTH / 2 - 0.85]} 
          rotation={Math.PI}
        />
      )}
      {rack.bikes?.right && (
        <Bike 
          position={[0, 0, BIKE_RACK_DIMENSIONS.WIDTH / 2 + 0.85]} 
          rotation={0}
        />
      )}
    </group>
  );
};

export default BikeRackWithBikes;

// Preload the GLB model
useGLTF.preload('https://quent4139.github.io/calculateur-espacement/test-abri.glb');