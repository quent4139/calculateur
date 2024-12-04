import React from 'react';
import { X } from 'lucide-react';
import { useConfigurationStore } from '../../store/configurationStore';

const StopEditingButton: React.FC = () => {
  const isBuilding = useConfigurationStore((state) => state.isBuilding);
  const stopBuilding = useConfigurationStore((state) => state.stopBuilding);

  if (!isBuilding) return null;

  return (
    <button
      onClick={stopBuilding}
      className="absolute bottom-4 right-4 z-50 bg-red-500 p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors group"
      title="Arrêter l'édition"
    >
      <X className="w-5 h-5 text-white" />
    </button>
  );
};

export default StopEditingButton;