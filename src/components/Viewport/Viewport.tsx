import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useConfigurationStore } from '../../store/configurationStore';
import Scene2D from './Scene2D';
import Scene3D from './Scene3D';
import CameraController from './CameraController';
import SettingsMenu from './SettingsMenu';
import ProjectStats from '../Stats/ProjectStats';
import ResetButton from './ResetButton';
import StopEditingButton from './StopEditingButton';
import ValidationMessage from './ValidationMessage';
import ConstructionMessage from './ConstructionMessage';

const Viewport: React.FC = () => {
  const viewMode = useConfigurationStore((state) => state.viewMode);
  const isTransitioning = useConfigurationStore((state) => state.isTransitioning);

  return (
    <div className="flex-1 bg-gray-100 relative">
      <ResetButton />
      <ValidationMessage />
      <ConstructionMessage />
      
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <SettingsMenu />
        <button
          className="bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 disabled:opacity-50"
          onClick={() => useConfigurationStore.getState().setViewMode(viewMode === '2d' ? '3d' : '2d')}
          disabled={isTransitioning}
        >
          Passer en {viewMode === '2d' ? '3D' : '2D'}
        </button>
      </div>
      
      <Canvas camera={{ position: [0, 15, 0], up: [0, 0, -1] }}>
        <CameraController />
        
        <OrbitControls
          enableRotate={viewMode === '3d' && !isTransitioning}
          enablePan={!isTransitioning}
          enableZoom={!isTransitioning}
          minPolarAngle={viewMode === '2d' ? Math.PI / 2 : 0}
          maxPolarAngle={viewMode === '2d' ? Math.PI / 2 : Math.PI}
          maxDistance={20}
          minDistance={2}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <hemisphereLight intensity={0.3} />
        
        {viewMode === '2d' ? <Scene2D /> : <Scene3D />}
      </Canvas>

      <StopEditingButton />
      <ProjectStats />
    </div>
  );
};

export default Viewport;