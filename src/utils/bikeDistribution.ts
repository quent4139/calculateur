import { BikeRack } from '../types';

export function generateBikeDistribution(bikeRacks: BikeRack[]): BikeRack[] {
  const totalSpots = bikeRacks.length * 2;
  const targetBikeCount = Math.floor(totalSpots / 3); // Environ 1/3 des places occupées
  
  // Copier les arceaux pour ne pas modifier les originaux
  const updatedRacks = bikeRacks.map(rack => ({
    ...rack,
    bikes: { left: false, right: false }
  }));
  
  // Placer les vélos aléatoirement
  let remainingBikes = targetBikeCount;
  const availableSpots = new Set<string>();
  
  // Créer un ensemble de tous les emplacements disponibles
  updatedRacks.forEach((rack, rackIndex) => {
    availableSpots.add(`${rackIndex}-left`);
    availableSpots.add(`${rackIndex}-right`);
  });
  
  // Convertir en tableau pour faciliter la sélection aléatoire
  const spotsArray = Array.from(availableSpots);
  
  // Placer les vélos
  while (remainingBikes > 0 && spotsArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * spotsArray.length);
    const [rackIndex, side] = spotsArray[randomIndex].split('-');
    
    // Mettre à jour l'arceau correspondant
    updatedRacks[parseInt(rackIndex)].bikes![side as 'left' | 'right'] = true;
    
    // Retirer l'emplacement utilisé
    spotsArray.splice(randomIndex, 1);
    remainingBikes--;
  }
  
  return updatedRacks;
}