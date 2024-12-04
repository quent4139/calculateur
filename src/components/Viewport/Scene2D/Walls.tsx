import React from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { Wall, Point } from '../../../types';
import { generateUniqueLineId } from '../../../utils/geometry';

interface WallsProps {
  walls: Wall[];
  buildingStartPoint: Point | null;
  previewEndPoint: Point | null;
  buildingMode: 'custom' | 'rectangle' | 'openShelter' | 'bikeRack';
  isBuilding: boolean;
  waitingForFirstClick: boolean;
  onWallClick?: (type: 'wall', id: string, event: React.MouseEvent) => void;
  selectedId?: string | null;
  showMeasurements?: boolean;
}

const Walls: React.FC<WallsProps> = ({
  walls,
  buildingStartPoint,
  previewEndPoint,
  buildingMode,
  isBuilding,
  waitingForFirstClick,
  onWallClick,
  selectedId,
  showMeasurements = false
}) => {
  const createWallMesh = React.useCallback((start: Point, end: Point, id: string, color: string, showDimensions: boolean = false) => {
    const direction = new THREE.Vector2(
      end.x - start.x,
      end.y - start.y
    );
    const length = direction.length();
    const angle = Math.atan2(direction.y, direction.x);
    const center = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };

    return (
      <group 
        key={id}
        onClick={(e) => {
          e.stopPropagation();
          onWallClick?.('wall', id, e as unknown as React.MouseEvent);
        }}
      >
        <mesh
          position={[center.x, 0.1, center.y]}
          rotation={[0, -angle, 0]}
        >
          <boxGeometry args={[length, 0.1, 0.3]} />
          <meshStandardMaterial color={selectedId === id ? '#3b82f6' : color} />
        </mesh>
        {showMeasurements && (
          <group position={[center.x, 0.2, center.y]}>
            <Html center>
              <div className="bg-white/90 px-2 py-1 rounded shadow text-sm">
                {length.toFixed(2)}m
              </div>
            </Html>
          </group>
        )}
      </group>
    );
  }, [onWallClick, selectedId, showMeasurements]);

  const createRectanglePreview = React.useCallback((start: Point, end: Point) => {
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    const id = generateUniqueLineId(start, end, 'rectangle');

    const walls = [
      // Bottom wall (only for standard rectangle)
      ...(buildingMode === 'rectangle' ? [{
        start,
        end: { x: end.x, y: start.y },
        id: `${id}-bottom`
      }] : []),
      // Right wall
      {
        start: { x: end.x, y: start.y },
        end,
        id: `${id}-right`
      },
      // Top wall
      {
        start: end,
        end: { x: start.x, y: end.y },
        id: `${id}-top`
      },
      // Left wall
      {
        start: { x: start.x, y: end.y },
        end: start,
        id: `${id}-left`
      }
    ];

    return (
      <>
        {walls.map(wall => createWallMesh(wall.start, wall.end, wall.id, '#3b82f6'))}
        <group position={[(start.x + end.x) / 2, 0.3, (start.y + end.y) / 2]}>
          <Html center>
            <div className="bg-blue-500 text-white px-2 py-1 rounded shadow text-sm">
              {width.toFixed(2)}m × {height.toFixed(2)}m
            </div>
          </Html>
        </group>
      </>
    );
  }, [createWallMesh, buildingMode]);

  return (
    <group>
      {walls.map((wall) => (
        createWallMesh(wall.start, wall.end, wall.id, '#1e293b', showMeasurements)
      ))}

      {isBuilding && buildingStartPoint && previewEndPoint && !waitingForFirstClick && buildingMode !== 'bikeRack' && (
        buildingMode === 'rectangle' || buildingMode === 'openShelter'
          ? createRectanglePreview(buildingStartPoint, previewEndPoint)
          : createWallMesh(buildingStartPoint, previewEndPoint, 'preview', '#3b82f6', true)
      )}
    </group>
  );
};

export default Walls;