import { Point, BikeRack } from '../types';

const ALIGNMENT_THRESHOLD = 0.4; // 40cm pour la détection
const SNAP_THRESHOLD = 0.2; // 20cm pour le snap

export function findNearestAlignment(
  point: Point,
  bikeRacks: BikeRack[],
  excludeId?: string
): Point {
  let bestAlignment: { point: Point; distance: number } | null = null;
  
  bikeRacks.forEach(rack => {
    if (rack.id === excludeId) return;
    
    // Vérifier l'alignement sur l'axe X (même Y)
    const yDiff = Math.abs(rack.position.y - point.y);
    if (yDiff < ALIGNMENT_THRESHOLD) {
      const distance = Math.abs(rack.position.x - point.x);
      if (!bestAlignment || distance < bestAlignment.distance) {
        bestAlignment = {
          point: { x: point.x, y: rack.position.y },
          distance: yDiff
        };
      }
    }
    
    // Vérifier l'alignement sur l'axe Y (même X)
    const xDiff = Math.abs(rack.position.x - point.x);
    if (xDiff < ALIGNMENT_THRESHOLD) {
      const distance = Math.abs(rack.position.y - point.y);
      if (!bestAlignment || distance < bestAlignment.distance) {
        bestAlignment = {
          point: { x: rack.position.x, y: point.y },
          distance: xDiff
        };
      }
    }
  });
  
  if (bestAlignment && bestAlignment.distance < SNAP_THRESHOLD) {
    return bestAlignment.point;
  }
  
  return point;
}