import React from 'react';
import { ValidationResult } from '../../types';

interface PlacementValidationProps {
  validations: ValidationResult[];
}

const PlacementValidation: React.FC<PlacementValidationProps> = ({ validations }) => {
  if (validations.length === 0) return null;

  const isValidPlacement = validations.every(v => v.isValid);

  return (
    <div className="mt-4 bg-white/90 p-3 rounded-lg shadow-lg space-y-2">
      <h3 className={`text-lg font-semibold ${isValidPlacement ? 'text-green-600' : 'text-red-600'}`}>
        {isValidPlacement ? 'Placement valide' : 'Placement invalide'}
      </h3>
      <div className="space-y-1">
        {validations.map((validation, index) => (
          <div
            key={index}
            className={`text-sm ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}
          >
            {validation.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacementValidation;