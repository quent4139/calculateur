import React from 'react';
import { Square, Warehouse, ParkingCircle } from 'lucide-react';
import { useConfigurationStore } from '../../store/configurationStore';
import CategorySection from './CategorySection';
import WallMenu from './WallMenu';
import BikeRackMenu from './BikeRackMenu';
import ShelterMenu from './ShelterMenu';

const Sidebar: React.FC = () => {
  const [openCategory, setOpenCategory] = React.useState<'walls' | 'shelters' | 'racks' | null>(null);

  const handleCategoryToggle = (category: 'walls' | 'shelters' | 'racks') => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="w-80 bg-gray-50/80 backdrop-blur-sm h-screen shadow-lg overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">Configuration</h2>
          <p className="text-gray-500">Sélectionnez un élément pour commencer</p>
        </div>
        
        <div className="space-y-4">
          <CategorySection
            icon={Square}
            title="Murs et Espaces"
            description="Définissez votre espace de stationnement"
            isOpen={openCategory === 'walls'}
            onToggle={() => handleCategoryToggle('walls')}
          >
            <WallMenu />
          </CategorySection>

          <CategorySection
            icon={Warehouse}
            title="Abris Vélos"
            description="Protection et sécurité pour les vélos"
            isOpen={openCategory === 'shelters'}
            onToggle={() => handleCategoryToggle('shelters')}
          >
            <ShelterMenu />
          </CategorySection>

          <CategorySection
            icon={ParkingCircle}
            title="Arceaux et Racks"
            description="Solutions de stationnement optimisées"
            isOpen={openCategory === 'racks'}
            onToggle={() => handleCategoryToggle('racks')}
          >
            <BikeRackMenu />
          </CategorySection>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;