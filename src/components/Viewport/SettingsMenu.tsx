import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useConfigurationStore } from '../../store/configurationStore';

interface SettingsMenuProps {
  className?: string;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const settings = useConfigurationStore((state) => state.settings);
  const toggleSetting = useConfigurationStore((state) => state.toggleSetting);

  const settingsConfig = [
    {
      id: 'showMeasurements',
      label: 'Afficher les mesures',
      description: 'Affiche les mesures importantes de l\'espace',
      disabled: false
    },
    {
      id: 'showBikes',
      label: 'Afficher des vélos',
      description: 'Ajoute des vélos sur les arceaux',
      disabled: false
    },
    {
      id: 'hideBackground',
      label: 'Retirer le fond',
      description: 'Masque la grille et le fond',
      disabled: true
    }
  ] as const;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        title="Paramètres"
      >
        <Settings className="w-5 h-5 text-gray-700" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[999]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-[1000] py-2">
            {settingsConfig.map(setting => (
              <div
                key={setting.id}
                className={`px-4 py-2 ${
                  setting.disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50 cursor-pointer'
                }`}
                onClick={() => {
                  if (!setting.disabled) {
                    toggleSetting(setting.id);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{setting.label}</span>
                  <div className={`w-8 h-4 rounded-full ${
                    settings[setting.id] && !setting.disabled ? 'bg-blue-500' : 'bg-gray-300'
                  } relative transition-colors`}>
                    <div className={`absolute w-3 h-3 rounded-full bg-white top-0.5 ${
                      settings[setting.id] && !setting.disabled ? 'left-[18px]' : 'left-0.5'
                    } transition-all shadow-sm`} />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{setting.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsMenu;