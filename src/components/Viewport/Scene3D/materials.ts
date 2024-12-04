import * as THREE from 'three';

export const shelterMaterials = {
  bosquet: {
    frame: new THREE.MeshStandardMaterial({ 
      color: '#71717a', // Acier galvanisé
      metalness: 0.8,
      roughness: 0.2
    }),
    walls: new THREE.MeshStandardMaterial({ 
      color: '#854d0e', // Bois thermowood
      metalness: 0.1,
      roughness: 0.8,
      side: THREE.DoubleSide
    }),
    roof: new THREE.MeshStandardMaterial({ 
      color: '#71717a', // Acier galvanisé
      metalness: 0.8,
      roughness: 0.2,
      side: THREE.DoubleSide
    })
  },
  maritime: {
    container: new THREE.MeshStandardMaterial({
      color: '#2563eb', // Bleu container
      metalness: 0.6,
      roughness: 0.4,
      side: THREE.DoubleSide
    }),
    interior: new THREE.MeshStandardMaterial({
      color: '#f1f5f9', // Blanc cassé
      metalness: 0.3,
      roughness: 0.7,
      side: THREE.DoubleSide
    }),
    floor: new THREE.MeshStandardMaterial({
      color: '#475569', // Gris foncé
      metalness: 0.4,
      roughness: 0.6
    })
  }
};