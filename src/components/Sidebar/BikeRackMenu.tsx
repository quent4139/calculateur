import React from 'react';
import { useConfigurationStore } from '../../store/configurationStore';
import ProductCard from './ProductCard';

const BikeRackMenu: React.FC = () => {
  const [selectedType, setSelectedType] = React.useState<'oura' | 'duo'>('oura');
  const [selectedVariant, setSelectedVariant] = React.useState<'4+4' | '6+6' | '8+8'>();
  
  const { startPlacingBikeRack, startAutomaticPlacement } = useConfigurationStore();

  const handleTypeSelect = (type: 'oura' | 'duo') => {
    setSelectedType(type);
    if (type === 'oura') {
      startPlacingBikeRack('oura');
    }
  };

  const handleVariantSelect = (variant: '4+4' | '6+6' | '8+8') => {
    setSelectedVariant(variant);
    startPlacingBikeRack('duo', variant);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <ProductCard
          title="Arceau Oura"
          type="oura"
          image="https://bycommute.fr/wp-content/uploads/2024/06/arceaux-velos-oura-galvanise-sur-platine.jpg"
          onClick={() => handleTypeSelect('oura')}
          isSelected={selectedType === 'oura'}
          places={2}
        />

        <ProductCard
          title="Rack Duo"
          type="duo"
          image="https://bycommute.fr/wp-content/uploads/2024/05/Arceaux-velos-duo-bycommute.png"
          onClick={() => handleTypeSelect('duo')}
          isSelected={selectedType === 'duo'}
          places={16}
        />
      </div>

      {selectedType === 'duo' && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Choisir une configuration :</h4>
          <div className="grid grid-cols-3 gap-2">
            {(['4+4', '6+6', '8+8'] as const).map((variant) => (
              <button
                key={variant}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  selectedVariant === variant
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                }`}
                onClick={() => handleVariantSelect(variant)}
              >
                <div className="font-medium">{variant}</div>
                <div className="text-xs text-gray-500">
                  {parseInt(variant.split('+')[0]) * 2} places
                </div>
              </button>
            ))}
          </div>

          <button
            className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            onClick={() => startAutomaticPlacement('duo')}
          >
            Placement automatique
          </button>
        </div>
      )}

      {selectedType === 'oura' && (
        <button
          className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          onClick={() => startAutomaticPlacement('oura')}
        >
          Placement automatique
        </button>
      )}
    </div>
  );
};

export default BikeRackMenu;