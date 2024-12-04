import { Point } from '../types';

let counter = 0;

export function generateUniqueLineId(start: Point, end: Point, prefix: string): string {
  // Ajouter un compteur pour garantir l'unicité même avec les mêmes coordonnées
  counter++;
  
  // Toujours ordonner les points pour avoir une clé cohérente peu importe l'ordre
  const points = [
    [start.x, start.y],
    [end.x, end.y]
  ].sort((a, b) => {
    if (a[0] === b[0]) return a[1] - b[1];
    return a[0] - b[0];
  });
  
  // Utiliser une précision fixe pour éviter les problèmes de nombres flottants
  const x1 = points[0][0].toFixed(3);
  const y1 = points[0][1].toFixed(3);
  const x2 = points[1][0].toFixed(3);
  const y2 = points[1][1].toFixed(3);
  
  return `${prefix}-${x1}-${y1}-${x2}-${y2}-${counter}`;
}

export function snapToGrid(value: number, gridSize: number = 0.02): number {
  return Math.round(value / gridSize) * gridSize;
}

export function snapToWallGrid(value: number): number {
  return snapToGrid(value, 0.1); // 10cm grid for walls
}

export function snapToBikeRackGrid(value: number): number {
  return snapToGrid(value, 0.02); // 2cm grid for bike racks
}