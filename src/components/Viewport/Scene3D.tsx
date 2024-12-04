import React from 'react';
import * as THREE from 'three';
import { useConfigurationStore } from '../../store/configurationStore';
import BikeRackWithBikes from './Scene3D/BikeRackWithBikes';
import { generateBikeDistribution } from '../../utils/bikeDistribution';
import { shelterMaterials } from './Scene3D/materials';
import BosquetShelter from './Scene3D/shelters/BosquetShelter';
import MaritimeShelter from './Scene3D/shelters/MaritimeShelter';
import RefugeShelter from './Scene3D/shelters/RefugeShelter';
import EscaleShelter from './Scene3D/shelters/EscaleShelter';

const Scene3D: React.FC = () => {
  const { walls, bikeRacks, shelters, settings } = useConfigurationStore();
  
  const bikeRacksWithBikes = React.useMemo(() => {
    if (!settings.showBikes) return bikeRacks;
    return generateBikeDistribution(bikeRacks);
  }, [bikeRacks, settings.showBikes]);

  return (
    <group>
      <gridHelper args={[20, 20]} rotation={[0, 0, 0]} />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Regular walls */}
      {walls.map((wall) => {
        const direction = new THREE.Vector2(
          wall.end.x - wall.start.x,
          wall.end.y - wall.start.y
        );
        const length = direction.length();
        const angle = Math.atan2(direction.y, direction.x);
        const center = {
          x: (wall.start.x + wall.end.x) / 2,
          y: (wall.start.y + wall.end.y) / 2,
        };

        return (
          <mesh
            key={wall.id}
            position={[center.x, 1.5, center.y]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[length, 3, 0.1]} />
            <meshStandardMaterial 
              color="#94a3b8" 
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      {bikeRacksWithBikes.map((rack) => (
        <BikeRackWithBikes key={rack.id} rack={rack} />
      ))}

      {/* Shelters */}
      {shelters.map((shelter) => {
        switch (shelter.type) {
          case 'maritime':
            return (
              <MaritimeShelter 
                key={shelter.id}
                shelter={shelter}
                materials={shelterMaterials.maritime}
              />
            );
          case 'bosquet':
            return (
              <BosquetShelter
                key={shelter.id}
                shelter={shelter}
                materials={shelterMaterials.bosquet}
              />
            );
          case 'refuge':
            return (
              <RefugeShelter
                key={shelter.id}
                shelter={shelter}
                materials={shelterMaterials.bosquet} // Même matériaux que Bosquet
              />
            );
          case 'escale':
            return (
              <EscaleShelter
                key={shelter.id}
                shelter={shelter}
                materials={shelterMaterials.maritime} // Même matériaux que Maritime
              />
            );
          default:
            return null;
        }
      })}
    </group>
  );
};

export default Scene3D;