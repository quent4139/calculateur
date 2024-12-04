import React from 'react';
import * as THREE from 'three';

interface BikeProps {
  position: [number, number, number];
  rotation?: number;
  color?: string;
}

const Bike: React.FC<BikeProps> = ({ 
  position, 
  rotation = 0,
  color = '#4b5563'
}) => {
  // Dimensions du vélo
  const BIKE_LENGTH = 1.7;  // 1.7m de long
  const BIKE_HEIGHT = 1.0;  // 1m de haut
  const WHEEL_RADIUS = 0.3; // 60cm de diamètre
  const TUBE_RADIUS = 0.02; // 4cm de diamètre pour les tubes

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Cadre principal */}
      <mesh>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, WHEEL_RADIUS, 0),
            new THREE.Vector3(BIKE_LENGTH * 0.4, BIKE_HEIGHT * 0.8, 0),
            new THREE.Vector3(BIKE_LENGTH * 0.8, WHEEL_RADIUS, 0)
          ]),
          20,
          TUBE_RADIUS
        ]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Roue avant */}
      <mesh position={[BIKE_LENGTH * 0.8, WHEEL_RADIUS, 0]}>
        <torusGeometry args={[WHEEL_RADIUS, TUBE_RADIUS, 12, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Roue arrière */}
      <mesh position={[0, WHEEL_RADIUS, 0]}>
        <torusGeometry args={[WHEEL_RADIUS, TUBE_RADIUS, 12, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Guidon */}
      <mesh position={[BIKE_LENGTH * 0.8, BIKE_HEIGHT * 0.6, 0]}>
        <cylinderGeometry args={[TUBE_RADIUS, TUBE_RADIUS, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Selle */}
      <mesh position={[BIKE_LENGTH * 0.3, BIKE_HEIGHT * 0.7, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.25, 0.06, 0.15]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

export default Bike;