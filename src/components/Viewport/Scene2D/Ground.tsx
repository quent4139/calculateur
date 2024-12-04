import React from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Point } from '../../../types';
import { snapToBikeRackGrid, snapToWallGrid } from '../../../utils/geometry';
import { useConfigurationStore } from '../../../store/configurationStore';
import { findNearestAlignment } from '../../../utils/alignmentGuides';

interface GroundProps {
  onPointerMove: (point: Point) => void;
  onPointerClick: (point: Point) => void;
}

const Ground: React.FC<GroundProps> = ({ onPointerMove, onPointerClick }) => {
  const { camera, raycaster, pointer } = useThree();
  const { 
    buildingMode,
    isBuilding,
    isDragging,
    selectedElement,
    bikeRacks,
    moveElement,
    stopDragging
  } = useConfigurationStore();

  const handlePointerMove = React.useCallback((event: any) => {
    event.stopPropagation();
    
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(event.object);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      const x = buildingMode === 'bikeRack' || selectedElement?.type === 'bikeRack' ? 
        snapToBikeRackGrid(point.x) : 
        snapToWallGrid(point.x);
      const z = buildingMode === 'bikeRack' || selectedElement?.type === 'bikeRack' ? 
        snapToBikeRackGrid(point.z) : 
        snapToWallGrid(point.z);

      let finalPoint = { x, y: z };

      // Apply alignment only for bike racks
      if ((buildingMode === 'bikeRack' || selectedElement?.type === 'bikeRack') && !isDragging) {
        finalPoint = findNearestAlignment(
          finalPoint, 
          bikeRacks,
          selectedElement?.type === 'bikeRack' ? selectedElement.id : undefined
        );
      }

      if (isDragging) {
        moveElement(finalPoint);
      } else {
        onPointerMove(finalPoint);
      }
    }
  }, [
    camera, 
    raycaster, 
    pointer, 
    buildingMode,
    isDragging,
    selectedElement,
    bikeRacks,
    moveElement,
    onPointerMove
  ]);

  const handleClick = React.useCallback((event: any) => {
    event.stopPropagation();
    
    if (isDragging) {
      stopDragging();
      return;
    }
    
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(event.object);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      const x = buildingMode === 'bikeRack' ? 
        snapToBikeRackGrid(point.x) : 
        snapToWallGrid(point.x);
      const z = buildingMode === 'bikeRack' ? 
        snapToBikeRackGrid(point.z) : 
        snapToWallGrid(point.z);

      let finalPoint = { x, y: z };

      if (buildingMode === 'bikeRack') {
        finalPoint = findNearestAlignment(finalPoint, bikeRacks);
      }

      onPointerClick(finalPoint);
    }
  }, [
    camera, 
    raycaster, 
    pointer, 
    buildingMode,
    isDragging,
    bikeRacks,
    stopDragging,
    onPointerClick
  ]);

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.01, 0]}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial 
        color={isBuilding ? '#e5e7eb' : '#f3f4f6'} 
        transparent 
        opacity={0.1} 
      />
    </mesh>
  );
};

export default Ground;