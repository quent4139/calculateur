import React from 'react';
import { useConfigurationStore } from '../../store/configurationStore';
import { validateBikeRackPlacement } from '../../utils/bikeRackValidation';

const ValidationMessage: React.FC = () => {
  const { 
    isBuilding, 
    buildingMode, 
    previewEndPoint,
    walls,
    bikeRacks,
    currentBikeRackType,
    currentDuoVariant
  } = useConfigurationStore();

  if (!isBuilding || buildingMode !== 'bikeRack' || !previewEndPoint) {
    return null;
  }

  const validations = validateBikeRackPlacement(
    previewEndPoint, 
    walls, 
    bikeRacks, 
    currentBikeRackType,
    currentDuoVariant
  );

  const isValid = validations.every(v => v.isValid);
  const relevantValidations = isValid ? 
    validations.filter(v => v.isValid) : 
    validations.filter(v => !v.isValid);

  if (relevantValidations.length === 0) return null;

  return (
    <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 ${
      isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
    } rounded-lg shadow-lg`}>
      <div className="px-4 py-3">
        <div className="space-y-1">
          {relevantValidations.map((validation, index) => (
            <div 
              key={index} 
              className={isValid ? 'text-green-600' : 'text-red-600'}
            >
              {validation.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValidationMessage;