import React from 'react';
import { Html } from '@react-three/drei';
import { ValidationResult } from '../../utils/bikeRackValidation';

interface PlacementRulesProps {
  position: [number, number, number];
  validations: ValidationResult[];
}

const PlacementRules: React.FC<PlacementRulesProps> = ({ position, validations }) => {
  const isValidPlacement = validations.every(v => v.isValid);

  return (
    <group position={position}>
      <Html center>
        <div className="bg-white/90 p-3 rounded-lg shadow-lg space-y-2 min-w-[300px]">
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
      </Html>
    </group>
  );
};

export default PlacementRules;