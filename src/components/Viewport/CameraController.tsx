import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useConfigurationStore } from '../../store/configurationStore';
import * as THREE from 'three';

const CameraController = () => {
  const { camera } = useThree();
  const viewMode = useConfigurationStore((state) => state.viewMode);
  const isTransitioning = useConfigurationStore((state) => state.isTransitioning);
  const setTransitioning = useConfigurationStore((state) => state.setTransitioning);
  
  const targetPosition = useRef(new THREE.Vector3());
  const targetRotation = useRef(new THREE.Euler());
  const startPosition = useRef(new THREE.Vector3());
  const startRotation = useRef(new THREE.Euler());
  const progress = useRef(0);
  
  useEffect(() => {
    startPosition.current.copy(camera.position);
    startRotation.current.copy(camera.rotation);
    
    if (viewMode === '2d') {
      targetPosition.current.set(0, 15, 0);
      targetRotation.current.set(-Math.PI / 2, 0, 0);
      camera.up.set(0, 0, -1);
    } else {
      targetPosition.current.set(5, 5, 5);
      targetRotation.current.set(-Math.PI / 4, Math.PI / 4, 0);
      camera.up.set(0, 1, 0);
    }
    
    progress.current = 0;
    setTransitioning(true);
  }, [viewMode, camera, setTransitioning]);
  
  useFrame(() => {
    if (isTransitioning) {
      progress.current += 0.02;
      
      if (progress.current >= 1) {
        progress.current = 1;
        setTransitioning(false);
      }
      
      const t = easeInOutCubic(progress.current);
      
      camera.position.lerpVectors(startPosition.current, targetPosition.current, t);
      
      camera.rotation.x = THREE.MathUtils.lerp(
        startRotation.current.x,
        targetRotation.current.x,
        t
      );
      camera.rotation.y = THREE.MathUtils.lerp(
        startRotation.current.y,
        targetRotation.current.y,
        t
      );
      camera.rotation.z = THREE.MathUtils.lerp(
        startRotation.current.z,
        targetRotation.current.z,
        t
      );
    }
  });
  
  return null;
};

const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export default CameraController;