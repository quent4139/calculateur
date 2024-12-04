import React from 'react';
import { FileQuestion } from 'lucide-react';
import { useConfigurationStore } from '../../store/configurationStore';
import { SHELTER_TYPES } from '../../config/shelterTypes';

const QuoteButton: React.FC = () => {
  const { bikeRacks, shelters } = useConfigurationStore();

  const handleQuoteRequest = () => {
    const compositionParts: string[] = [];

    // Add shelters to composition
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

    // Add shelters to composition string
    Object.values(sheltersByType).forEach(({ type, width, count }) => {
      compositionParts.push(`${SHELTER_TYPES[type].name} ${Math.round(width)}m : ${count}`);
    });

    // Add bike racks to composition
    const racksByType = bikeRacks.reduce((acc, rack) => {
      if (rack.type === 'duo' && rack.variant) {
        const key = `duo-${rack.variant}`;
        if (!acc[key]) {
          acc[key] = { count: 0, spots: 0 };
        }
        acc[key].count++;
        acc[key].spots += parseInt(rack.variant.split('+')[0]) * 2;
      } else if (rack.type === 'oura') {
        const key = 'oura';
        if (!acc[key]) {
          acc[key] = { count: 0, spots: 0 };
        }
        acc[key].count++;
        acc[key].spots += 2;
      }
      return acc;
    }, {} as Record<string, { count: number; spots: number }>);

    // Add bike racks to composition string
    Object.entries(racksByType).forEach(([key, { count, spots }]) => {
      if (key === 'oura') {
        compositionParts.push(`Arceau Oura : ${count} (${spots} vélos)`);
      } else {
        const variant = key.split('-')[1];
        compositionParts.push(`Rack Duo ${variant} : ${count} (${spots} vélos)`);
      }
    });

    // Build the URL with parameters
    const tallyUrl = new URL('https://tally.so/r/3jPp8x');
    tallyUrl.searchParams.set('Compo', compositionParts.join(', '));

    // Open in a new tab
    window.open(tallyUrl.toString(), '_blank');
  };

  return (
    <button
      onClick={handleQuoteRequest}
      className="mt-4 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow flex items-center justify-center gap-2 transition-colors"
    >
      <FileQuestion className="w-4 h-4" />
      <span>Demander un devis</span>
    </button>
  );
};

export default QuoteButton;