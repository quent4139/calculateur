import React from 'react';
import { useConfigurationStore } from '../../../store/configurationStore';
import Ground from './Ground';
import Walls from './Walls';
import BikeRacks from './BikeRacks';
import Shelters from './Shelters';
import Measurements from '../Measurements';
import CustomMeasurements from '../CustomMeasurements';
import MeasurementPreview from './MeasurementPreview';
import { Point } from '../../../types';
import { calculateMeasurements } from '../../../utils/measurements';

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
    isMeasuring,
    measureStartPoint,
    measurePreviewPoint,
    customMeasurements,
    setPreviewPoint,
    setMeasurePreviewPoint,
    handleMeasureClick,
    handleWallClick,
    handleBikeRackPlacement,
    removeMeasurement
  } = useConfigurationStore();

  const handlePointerMove = React.useCallback((point: Point) => {
    if (isMeasuring) {
      setMeasurePreviewPoint(point);
    } else if (isBuilding) {
      setPreviewPoint(point);
    }
  }, [isMeasuring, isBuilding, setMeasurePreviewPoint, setPreviewPoint]);

  const handlePointerClick = React.useCallback((point: Point) => {
    if (isMeasuring) {
      handleMeasureClick(point);
    } else if (isBuilding) {
      if (buildingMode === 'bikeRack') {
        handleBikeRackPlacement(point);
      } else {
        handleWallClick(point);
      }
    }
  }, [isMeasuring, isBuilding, buildingMode, handleMeasureClick, handleBikeRackPlacement, handleWallClick]);

  const measurements = React.useMemo(() => {
    if (!settings.showMeasurements) return [];
    return calculateMeasurements(walls, bikeRacks);
  }, [walls, bikeRacks, settings.showMeasurements]);

  return (
    <group>
      <gridHelper args={[20, 1000]} />
      
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
      />
      
      <BikeRacks 
        bikeRacks={bikeRacks}
        showBikes={settings.showBikes}
      />
      
      <Shelters shelters={shelters} />

      {settings.showMeasurements && (
        <Measurements measurements={measurements} />
      )}

      <CustomMeasurements 
        measurements={customMeasurements}
        onRemove={removeMeasurement}
      />

      {isMeasuring && measureStartPoint && measurePreviewPoint && (
        <MeasurementPreview 
          start={measureStartPoint}
          end={measurePreviewPoint}
        />
      )}
    </group>
  );
};

export default Scene2D;