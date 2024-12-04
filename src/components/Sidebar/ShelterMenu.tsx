import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useConfigurationStore } from '../../store/configurationStore';
import { SHELTER_TYPES } from '../../config/shelterTypes';
import ProductCard from './ProductCard';

const ShelterMenu: React.FC = () => {
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [expandedType, setExpandedType] = React.useState<string | null>(null);
  const addShelter = useConfigurationStore((state) => state.addShelter);

  const handleShelterSelect = (typeId: string) => {
    setSelectedType(typeId);
    setExpandedType(expandedType === typeId ? null : typeId);
  };

  const handleDimensionSelect = (
    typeId: string, 
    width: number, 
    depth: number, 
    isOpen: boolean
  ) => {
    addShelter({
      type: typeId,
      dimensions: { width, depth },
      position: { x: 0, y: 0 },
      rotation: 0,
      isOpen
    });
    setExpandedType(null);
  };

  // Group shelters by type (open/closed)
  const openShelters = Object.entries(SHELTER_TYPES).filter(([_, type]) => type.isOpen);
  const closedShelters = Object.entries(SHELTER_TYPES).filter(([_, type]) => !type.isOpen);

  return (
    <div className="space-y-6">
      {/* Open Shelters */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500">Abris ouverts</h3>
        <div className="space-y-4">
          {openShelters.map(([typeId, type]) => (
            <div key={typeId} className="space-y-2">
              <ProductCard
                title={type.name}
                type={typeId}
                image={type.image}
                onClick={() => handleShelterSelect(typeId)}
                isSelected={selectedType === typeId}
              />
              
              {expandedType === typeId && (
                <div className="pl-2 space-y-2 border-l-2 border-blue-200">
                  <div className="text-sm font-medium text-gray-600 pl-2">
                    Dimensions disponibles :
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {type.dimensions?.map((dim, index) => (
                      <button
                        key={index}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          dim.inDevelopment
                            ? 'border-yellow-300 bg-yellow-50 text-yellow-700 cursor-not-allowed'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                        }`}
                        onClick={() => !dim.inDevelopment && handleDimensionSelect(
                          typeId,
                          dim.width,
                          dim.depth,
                          type.isOpen
                        )}
                        disabled={dim.inDevelopment}
                      >
                        <div className="font-medium">
                          {dim.name ? `${dim.name}` : `${dim.width}m × ${dim.depth}m`}
                        </div>
                        {dim.inDevelopment && (
                          <div className="text-xs">En développement</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Closed Shelters */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-500">Abris fermés</h3>
        <div className="space-y-4">
          {closedShelters.map(([typeId, type]) => (
            <div key={typeId} className="space-y-2">
              <ProductCard
                title={type.name}
                type={typeId}
                image={type.image}
                onClick={() => handleShelterSelect(typeId)}
                isSelected={selectedType === typeId}
              />
              
              {expandedType === typeId && type.categories && (
                <div className="pl-2 space-y-3 border-l-2 border-blue-200">
                  {type.categories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="text-sm font-medium text-gray-600 pl-2">
                        {category.name} :
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {category.dimensions.map((dim, index) => (
                          <button
                            key={index}
                            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                              dim.inDevelopment
                                ? 'border-yellow-300 bg-yellow-50 text-yellow-700 cursor-not-allowed'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                            }`}
                            onClick={() => !dim.inDevelopment && handleDimensionSelect(
                              typeId,
                              dim.width,
                              dim.depth,
                              type.isOpen
                            )}
                            disabled={dim.inDevelopment}
                          >
                            <div className="font-medium">{dim.width}m × {dim.depth}m</div>
                            {dim.inDevelopment && (
                              <div className="text-xs">En développement</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {expandedType === typeId && type.dimensions && (
                <div className="pl-2 space-y-2 border-l-2 border-blue-200">
                  <div className="text-sm font-medium text-gray-600 pl-2">
                    Dimensions disponibles :
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {type.dimensions.map((dim, index) => (
                      <button
                        key={index}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          dim.inDevelopment
                            ? 'border-yellow-300 bg-yellow-50 text-yellow-700 cursor-not-allowed'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                        }`}
                        onClick={() => !dim.inDevelopment && handleDimensionSelect(
                          typeId,
                          dim.width,
                          dim.depth,
                          type.isOpen
                        )}
                        disabled={dim.inDevelopment}
                      >
                        <div className="font-medium">
                          {dim.name ? `${dim.name}` : `${dim.width}m × ${dim.depth}m`}
                        </div>
                        {dim.inDevelopment && (
                          <div className="text-xs">En développement</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShelterMenu;