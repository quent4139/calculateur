import React from 'react';
import { Html } from '@react-three/drei';
import { BikeRack } from '../../../types';
import { BIKE_RACK_DIMENSIONS } from '../../../config/constants';
import DuoRack2D from './DuoRack2D';

interface BikeRacksProps {
  bikeRacks: BikeRack[];
  showBikes?: boolean;
  onRackClick?: (type: 'bikeRack', id: string, event: React.MouseEvent) => void;
  selectedId?: string | null;
}

const BikeRacks: React.FC<BikeRacksProps> = ({ 
  bikeRacks, 
  showBikes = false,
  onRackClick,
  selectedId
}) => {
  return (
    <group>
      {bikeRacks.map((rack) => {
        if (rack.type === 'duo' && rack.variant) {
          return (
            <DuoRack2D
              key={rack.id}
              position={rack.position}
              variant={rack.variant}
              rotation={rack.rotation}
              isSelected={selectedId === rack.id}
              onClick={(e) => {
                e.stopPropagation();
                onRackClick?.('bikeRack', rack.id, e as unknown as React.MouseEvent);
              }}
            />
          );
        }

        // Regular Oura rack
        return (
          <group 
            key={rack.id}
            onClick={(e) => {
              e.stopPropagation();
              onRackClick?.('bikeRack', rack.id, e as unknown as React.MouseEvent);
            }}
          >
            <mesh
              position={[rack.position.x, 0.1, rack.position.y]}
              rotation={[0, rack.rotation, 0]}
            >
              <boxGeometry args={[BIKE_RACK_DIMENSIONS.WIDTH, 0.1, 0.1]} />
              <meshStandardMaterial color={selectedId === rack.id ? '#3b82f6' : '#9333ea'} />
            </mesh>

            {showBikes && rack.bikes?.left && (
              <mesh
                position={[
                  rack.position.x,
                  0.1,
                  rack.position.y - BIKE_RACK_DIMENSIONS.WIDTH / 2 - 0.85
                ]}
                rotation={[0, rack.rotation, 0]}
              >
                <boxGeometry args={[1.7, 0.1, 0.4]} />
                <meshStandardMaterial color="#4b5563" />
              </mesh>
            )}
            {showBikes && rack.bikes?.right && (
              <mesh
                position={[
                  rack.position.x,
                  0.1,
                  rack.position.y + BIKE_RACK_DIMENSIONS.WIDTH / 2 + 0.85
                ]}
                rotation={[0, rack.rotation, 0]}
              >
                <boxGeometry args={[1.7, 0.1, 0.4]} />
                <meshStandardMaterial color="#4b5563" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

export default BikeRacks;