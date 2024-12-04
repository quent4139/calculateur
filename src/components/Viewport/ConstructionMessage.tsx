import React from 'react';
import { Construction } from 'lucide-react';
import { useConfigurationStore } from '../../store/configurationStore';

const ConstructionMessage: React.FC = () => {
  const viewMode = useConfigurationStore((state) => state.viewMode);

  if (viewMode !== '3d') return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg">
      <div className="px-4 py-3 flex items-center gap-2">
        <Construction className="w-5 h-5 text-yellow-600" />
        <span className="text-yellow-800 font-medium">Vue 3D en construction</span>
      </div>
    </div>
  );
};

export default ConstructionMessage;