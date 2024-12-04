import React from 'react';
import { useConfigurationStore } from '../../store/configurationStore';
import { SHELTER_TYPES } from '../../config/shelterTypes';
import { ExternalLink } from 'lucide-react';
import QuoteButton from './QuoteButton';

const PRODUCT_LINKS = {
  bosquet: 'https://bycommute.fr/produit/abri-bosquet/',
  refuge: 'https://bycommute.fr/produit/abri-refuge/',
  maritime: 'https://bycommute.fr/produit/abri-maritime/',
  escale: 'https://bycommute.fr/produit/abri-escale/',
  arceaux: 'https://bycommute.fr/produit/arceaux-velos-oura/',
  duo: 'https://bycommute.fr/produit/rack-velo-double-etage-duo/'
};

const ProjectStats: React.FC = () => {
  const { bikeRacks, shelters } = useConfigurationStore();

  // Group bike racks by type and variant
  const racksByType = bikeRacks.reduce((acc, rack) => {
    if (rack.type === 'duo' && rack.variant) {
      const key = `duo-${rack.variant}`;
      if (!acc[key]) {
        acc[key] = {
          type: 'duo',
          variant: rack.variant,
          count: 0,
          spots: 0
        };
      }
      acc[key].count++;
      acc[key].spots += parseInt(rack.variant.split('+')[0]) * 2;
    } else if (rack.type === 'oura') {
      if (!acc['oura']) {
        acc['oura'] = {
          type: 'oura',
          count: 0,
          spots: 0
        };
      }
      acc['oura'].count++;
      acc['oura'].spots += 2;
    }
    return acc;
  }, {} as Record<string, { type: string; variant?: string; count: number; spots: number; }>);

  // Calculate total bike spots
  const totalBikeSpots = Object.values(racksByType).reduce((total, { spots }) => total + spots, 0);

  // Group shelters by type and dimensions
  const sheltersByType = shelters.reduce((acc, shelter) => {
    const key = `${shelter.type}-${shelter.dimensions.width}`;
    if (!acc[key]) {
      acc[key] = {
        type: shelter.type,
        width: shelter.dimensions.width,
        count: 0
      };
    }
    acc[key].count++;
    return acc;
  }, {} as Record<string, { type: string; width: number; count: number; }>);

  // Check if there are any items to display
  const hasItems = Object.keys(racksByType).length > 0 || Object.keys(sheltersByType).length > 0;

  if (!hasItems) return null;

  return (
    <div className="absolute left-4 bottom-4 bg-white/90 rounded-lg shadow-lg p-3 text-sm">
      <h3 className="font-medium text-gray-800 mb-2">
        Composition {totalBikeSpots > 0 && (
          <span className="text-gray-500">
            ({totalBikeSpots} vélos au total)
          </span>
        )}
      </h3>
      <div className="space-y-1.5">
        {Object.values(sheltersByType).map(({ type, width, count }) => (
          <a
            key={`${type}-${width}`}
            href={PRODUCT_LINKS[type as keyof typeof PRODUCT_LINKS]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 flex items-center gap-1 hover:text-blue-600 group"
          >
            {SHELTER_TYPES[type].name} {Math.round(width)}m
            <span className="font-medium text-gray-800 group-hover:text-blue-600">
              ({count})
            </span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}

        {Object.entries(racksByType).map(([key, { type, variant, count, spots }]) => {
          const productLink = PRODUCT_LINKS[type as keyof typeof PRODUCT_LINKS];
          const displayName = type === 'duo' ? `Rack Duo ${variant}` : 'Arceau Oura';

          return (
            <a
              key={key}
              href={productLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 flex items-center gap-1 hover:text-blue-600 group"
            >
              {displayName}
              <span className="font-medium text-gray-800 group-hover:text-blue-600">
                ({count})
              </span>
              <span className="text-gray-500 text-xs">
                ({spots} vélos)
              </span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          );
        })}
      </div>

      <QuoteButton />
    </div>
  );
};

export default ProjectStats;