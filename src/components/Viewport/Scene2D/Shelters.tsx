import React from 'react';
import { Html } from '@react-three/drei';
import { Shelter } from '../../../types';

interface SheltersProps {
  shelters: Shelter[];
  onShelterClick?: (type: 'shelter', id: string, event: React.MouseEvent) => void;
  selectedId?: string | null;
  showMeasurements?: boolean;
}

const Shelters: React.FC<SheltersProps> = ({ 
  shelters, 
  onShelterClick, 
  selectedId,
  showMeasurements = false
}) => {
  return (
    <group>
      {shelters.map((shelter) => {
        // Create walls based on shelter dimensions and type
        const walls = shelter.isOpen ? [
          // For open shelters (like Bosquet), only create 3 walls (U shape)
          // Left wall
          <mesh
            key={`${shelter.id}-left`}
            position={[
              shelter.position.x - shelter.dimensions.width/2,
              0.1,
              shelter.position.y
            ]}
            rotation={[0, shelter.rotation, 0]}
          >
            <boxGeometry args={[0.1, 0.1, shelter.dimensions.depth]} />
            <meshStandardMaterial color={selectedId === shelter.id ? '#3b82f6' : '#1e293b'} />
          </mesh>,
          // Back wall (at the bottom)
          <mesh
            key={`${shelter.id}-back`}
            position={[
              shelter.position.x,
              0.1,
              shelter.position.y - shelter.dimensions.depth/2
            ]}
            rotation={[0, shelter.rotation + Math.PI/2, 0]}
          >
            <boxGeometry args={[0.1, 0.1, shelter.dimensions.width]} />
            <meshStandardMaterial color={selectedId === shelter.id ? '#3b82f6' : '#1e293b'} />
          </mesh>,
          // Right wall
          <mesh
            key={`${shelter.id}-right`}
            position={[
              shelter.position.x + shelter.dimensions.width/2,
              0.1,
              shelter.position.y
            ]}
            rotation={[0, shelter.rotation, 0]}
          >
            <boxGeometry args={[0.1, 0.1, shelter.dimensions.depth]} />
            <meshStandardMaterial color={selectedId === shelter.id ? '#3b82f6' : '#1e293b'} />
          </mesh>
        ] : [
          // For closed shelters (like Refuge), create all 4 walls
          // Left wall
          <mesh
            key={`${shelter.id}-left`}
            position={[
              shelter.position.x - shelter.dimensions.width/2,
              0.1,
              shelter.position.y
            ]}
            rotation={[0, shelter.rotation, 0]}
          >
            <boxGeometry args={[0.1, 0.1, shelter.dimensions.depth]} />
            <meshStandardMaterial color={selectedId === shelter.id ? '#3b82f6' : '#1e293b'} />
          </mesh>,
          // Back wall
          <mesh
            key={`${shelter.id}-back`}
            position={[
              shelter.position.x,
              0.1,
              shelter.position.y + shelter.dimensions.depth/2
            ]}
            rotation={[0, shelter.rotation + Math.PI/2, 0]}
          >
            <boxGeometry args={[0.1, 0.1, shelter.dimensions.width]} />
            <meshStandardMaterial color={selectedId === shelter.id ? '#3b82f6' : '#1e293b'} />
          </mesh>,
          // Right wall
          <mesh
            key={`${shelter.id}-right`}
            position={[
              shelter.position.x + shelter.dimensions.width/2,
              0.1,
              shelter.position.y
            ]}
            rotation={[0, shelter.rotation, 0]}
          >
            <boxGeometry args={[0.1, 0.1, shelter.dimensions.depth]} />
            <meshStandardMaterial color={selectedId === shelter.id ? '#3b82f6' : '#1e293b'} />
          </mesh>,
          // Front wall
          <mesh
            key={`${shelter.id}-front`}
            position={[
              shelter.position.x,
              0.1,
              shelter.position.y - shelter.dimensions.depth/2
            ]}
            rotation={[0, shelter.rotation + Math.PI/2, 0]}
          >
            <boxGeometry args={[0.1, 0.1, shelter.dimensions.width]} />
            <meshStandardMaterial color={selectedId === shelter.id ? '#3b82f6' : '#1e293b'} />
          </mesh>
        ];

        return (
          <group
            key={shelter.id}
            onClick={(e) => {
              e.stopPropagation();
              onShelterClick?.('shelter', shelter.id, e as unknown as React.MouseEvent);
            }}
          >
            {walls}
            {/* Floor indicator */}
            <mesh
              position={[shelter.position.x, 0.01, shelter.position.y]}
              rotation={[0, shelter.rotation, 0]}
            >
              <planeGeometry args={[shelter.dimensions.width, shelter.dimensions.depth]} />
              <meshBasicMaterial color={selectedId === shelter.id ? '#93c5fd' : '#bfdbfe'} transparent opacity={0.2} />
            </mesh>

            {/* Measurements */}
            {showMeasurements && (
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
            )}
          </group>
        );
      })}
    </group>
  );
};

export default Shelters;