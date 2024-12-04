import React from 'react';
import { Square, Pencil, Warehouse } from 'lucide-react';
import { useConfigurationStore } from '../../store/configurationStore';
import { WallBuildingMode } from '../../types';

const WallMenu: React.FC = () => {
  const startBuilding = useConfigurationStore((state) => state.startBuilding);

  const options = [
    {
      mode: 'custom' as WallBuildingMode,
      title: 'Mur sur mesure',
      icon: Pencil,
    },
    {
      mode: 'rectangle' as WallBuildingMode,
      title: 'Abris vélos fermés',
      icon: Square,
    },
    {
      mode: 'openShelter' as WallBuildingMode,
      title: 'Abris vélos ouverts',
      icon: Warehouse,
    },
  ];

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option.mode}
          className="w-full px-4 py-3 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center gap-3"
          onClick={() => startBuilding(option.mode)}
        >
          <div className="bg-gray-100 p-2 rounded-lg">
            <option.icon className="w-5 h-5 text-gray-700" />
          </div>
          <span className="font-medium text-gray-800">{option.title}</span>
        </button>
      ))}
    </div>
  );
};

export default WallMenu;