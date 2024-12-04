import React from 'react';
import { useConfigurationStore } from '../../store/configurationStore';
import Ground from './Scene2D/Ground';
import Walls from './Scene2D/Walls';
import BikeRacks from './Scene2D/BikeRacks';
import BikeRackPreview from './Scene2D/BikeRackPreview';
import Shelters from './Scene2D/Shelters';
import ElementControls from './ElementControls';
import Measurements from './Measurements';
import { Point } from '../../types';
import { calculateMeasurements } from '../../utils/measurements';

const Scene2D: React.FC = () => {
  const { 
    walls, 
    bikeRacks, 
    shelters,
    isBuilding,
    buildingMode,
    buildingStartPoint,
    previewEndPoint,
    waitingForFirstClick,
    settings,
    selectedElement,
    isDragging,
    currentBikeRackType,
    currentDuoVariant,
    setPreviewPoint,
    handleWallClick,
    handleBikeRackPlacement,
    selectElement,
    deleteSelectedElement,
    startDragging,
    rotateElement,
    stopDragging
  } = useConfigurationStore();

  const handlePointerMove = React.useCallback((point: Point) => {
    setPreviewPoint(point);
  }, [setPreviewPoint]);

  const handlePointerClick = React.useCallback((point: Point) => {
    if (isDragging) {
      stopDragging();
      return;
    }

    if (!isBuilding) {
      selectElement(null);
      return;
    }

    if (buildingMode === 'bikeRack') {
      handleBikeRackPlacement(point);
    } else {
      handleWallClick(point);
    }
  }, [
    isBuilding,
    buildingMode,
    isDragging,
    stopDragging,
    handleBikeRackPlacement,
    handleWallClick,
    selectElement
  ]);

  const handleElementClick = React.useCallback((type: 'wall' | 'bikeRack' | 'shelter', id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isBuilding && !isDragging) {
      selectElement({ type, id });
    }
  }, [isBuilding, isDragging, selectElement]);

  const selectedPosition = React.useMemo(() => {
    if (!selectedElement) return null;

    switch (selectedElement.type) {
      case 'wall': {
        const wall = walls.find(w => w.id === selectedElement.id);
        return wall ? {
          x: (wall.start.x + wall.end.x) / 2,
          y: (wall.start.y + wall.end.y) / 2
        } : null;
      }
      case 'bikeRack': {
        const rack = bikeRacks.find(r => r.id === selectedElement.id);
        return rack ? rack.position : null;
      }
      case 'shelter': {
        const shelter = shelters.find(s => s.id === selectedElement.id);
        return shelter ? shelter.position : null;
      }
      default:
        return null;
    }
  }, [selectedElement, walls, bikeRacks, shelters]);

  const measurements = React.useMemo(() => {
    if (!settings.showMeasurements) return [];
    return calculateMeasurements(walls, bikeRacks);
  }, [walls, bikeRacks, settings.showMeasurements]);

  return (
    <group>
      <gridHelper args={[20, 200]} />
      
      <Ground 
        onPointerMove={handlePointerMove}
        onPointerClick={handlePointerClick}
      />

      <Walls
        walls={walls}
        buildingStartPoint={buildingStartPoint}
        previewEndPoint={previewEndPoint}
        buildingMode={buildingMode}
        isBuilding={isBuilding}
        waitingForFirstClick={waitingForFirstClick}
        onWallClick={handleElementClick}
        selectedId={selectedElement?.type === 'wall' ? selectedElement.id : null}
        showMeasurements={settings.showMeasurements}
      />
      
      <BikeRacks 
        bikeRacks={bikeRacks}
        showBikes={settings.showBikes}
        onRackClick={handleElementClick}
        selectedId={selectedElement?.type === 'bikeRack' ? selectedElement.id : null}
      />
      
      <Shelters 
        shelters={shelters}
        onShelterClick={handleElementClick}
        selectedId={selectedElement?.type === 'shelter' ? selectedElement.id : null}
        showMeasurements={settings.showMeasurements}
      />

      {settings.showMeasurements && (
        <Measurements measurements={measurements} />
      )}

      {isBuilding && buildingMode === 'bikeRack' && previewEndPoint && (
        <BikeRackPreview 
          position={previewEndPoint} 
          type={currentBikeRackType}
          variant={currentDuoVariant}
        />
      )}

      {selectedElement && selectedPosition && !isBuilding && !isDragging && (
        <ElementControls 
          position={selectedPosition}
          onDelete={deleteSelectedElement}
          onStartDrag={startDragging}
          onRotate={rotateElement}
          canRotate={selectedElement.type === 'bikeRack' || selectedElement.type === 'shelter'}
        />
      )}
    </group>
  );
};

export default Scene2D;