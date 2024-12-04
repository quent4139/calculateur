import React from 'react';
import { Point } from '../../../types';
import { BIKE_RACK_DIMENSIONS, DUO_RACK_DIMENSIONS } from '../../../config/constants';
import { useConfigurationStore } from '../../../store/configurationStore';
import { validateBikeRackPlacement } from '../../../utils/bikeRackValidation';

interface BikeRackPreviewProps {
  position: Point;
  type?: 'oura' | 'duo';
  variant?: '4+4' | '6+6' | '8+8';
}

const BikeRackPreview: React.FC<BikeRackPreviewProps> = ({ 
  position, 
  type = 'oura',
  variant
}) => {
  const { walls, bikeRacks } = useConfigurationStore();
  const validations = validateBikeRackPlacement(position, walls, bikeRacks, type, variant);
  const isValid = validations.every(v => v.isValid);

  if (type === 'duo' && variant) {
    const width = DUO_RACK_DIMENSIONS.VARIANTS[variant].width;
    const depth = DUO_RACK_DIMENSIONS.HEIGHT;

    return (
      <group>
        <mesh
          position={[position.x, 0.1, position.y]}
          rotation={[0, 0, 0]}
        >
          <boxGeometry args={[width, 0.2, depth]} />
          <meshStandardMaterial 
            color={isValid ? '#22c55e' : '#ef4444'} 
            transparent 
            opacity={0.5} 
          />
        </mesh>

        <mesh
          position={[position.x, 0.01, position.y + DUO_RACK_DIMENSIONS.CIRCULATION_SPACE/2]}
          rotation={[-Math.PI/2, 0, 0]}
        >
          <planeGeometry args={[width, DUO_RACK_DIMENSIONS.CIRCULATION_SPACE]} />
          <meshBasicMaterial 
            color={isValid ? '#22c55e' : '#ef4444'} 
            transparent 
            opacity={0.1} 
          />
        </mesh>
      </group>
    );
  }

  return (
    <mesh
      position={[position.x, 0.1, position.y]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <boxGeometry args={[BIKE_RACK_DIMENSIONS.WIDTH, 0.1, 0.1]} />
      <meshStandardMaterial 
        color={isValid ? '#22c55e' : '#ef4444'} 
        transparent 
        opacity={0.5} 
      />
    </mesh>
  );
};

export default BikeRackPreview;