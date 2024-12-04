import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useConfigurationStore } from '../../store/configurationStore';

const ResetButton: React.FC = () => {
  const resetProject = useConfigurationStore((state) => state.resetProject);

  return (
    <button
      onClick={resetProject}
      className="absolute top-4 left-4 z-50 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 flex items-center gap-2 text-gray-700"
      title="Réinitialiser le projet"
    >
      <RotateCcw className="w-4 h-4" />
      <span>Réinitialiser</span>
    </button>
  );
};

export default ResetButton;