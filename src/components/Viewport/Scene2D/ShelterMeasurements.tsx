import React from 'react';
import { Html } from '@react-three/drei';
import { Wall } from '../../../types';

interface ShelterMeasurementsProps {
  walls: Wall[];
}

const ShelterMeasurements: React.FC<ShelterMeasurementsProps> = ({ walls }) => {
  // Regrouper les murs par rectangles et formes en U
  const structures = React.useMemo(() => {
    const result: Wall[][] = [];
    const usedWalls = new Set<string>();

    walls.forEach(startWall => {
      if (usedWalls.has(startWall.id)) return;

      const connectedWalls = findConnectedWalls(startWall, walls);
      if (connectedWalls.length >= 3) {
        result.push(connectedWalls);
        connectedWalls.forEach(wall => usedWalls.add(wall.id));
      }
    });

    return result;
  }, [walls]);

  return (
    <group>
      {structures.map((structure, index) => {
        const dimensions = calculateStructureDimensions(structure);
        if (!dimensions) return null;

        const { width, depth, center } = dimensions;
        const isUShape = structure.length === 3;

        return (
          <group key={index}>
            {/* Mesure de la largeur (en haut) */}
            <group position={[center.x, 0.2, center.y - depth/2]}>
              <Html center>
                <div className="px-2 py-1 bg-white/90 rounded shadow text-sm text-gray-700">
                  {width.toFixed(2)}m
                </div>
              </Html>
            </group>

            {/* Mesure de la profondeur (à gauche) */}
            <group position={[center.x - width/2, 0.2, center.y]}>
              <Html center>
                <div className="px-2 py-1 bg-white/90 rounded shadow text-sm text-gray-700">
                  {depth.toFixed(2)}m
                </div>
              </Html>
            </group>
          </group>
        );
      })}
    </group>
  );
};

function findConnectedWalls(startWall: Wall, allWalls: Wall[]): Wall[] {
  const connectedWalls: Wall[] = [startWall];
  const tolerance = 0.1;

  function arePointsConnected(p1: { x: number; y: number }, p2: { x: number; y: number }): boolean {
    return Math.abs(p1.x - p2.x) < tolerance && Math.abs(p1.y - p2.y) < tolerance;
  }

  function findNextWall(currentEnd: { x: number; y: number }, excludeWallIds: Set<string>): Wall | null {
    return allWalls.find(wall => 
      !excludeWallIds.has(wall.id) &&
      (arePointsConnected(currentEnd, wall.start) || arePointsConnected(currentEnd, wall.end))
    ) || null;
  }

  const usedWallIds = new Set([startWall.id]);
  let currentWall = startWall;
  let currentEnd = currentWall.end;
  let wallCount = 1;

  while (wallCount < 4) {
    const nextWall = findNextWall(currentEnd, usedWallIds);
    if (!nextWall) break;

    connectedWalls.push(nextWall);
    usedWallIds.add(nextWall.id);
    currentWall = nextWall;
    currentEnd = currentWall.end;
    wallCount++;

    // Pour une forme en U, on s'arrête à 3 murs
    if (wallCount === 3 && !findNextWall(currentEnd, usedWallIds)) {
      return connectedWalls;
    }

    // Pour un rectangle, on vérifie si on revient au point de départ
    if (wallCount === 4 && arePointsConnected(currentEnd, startWall.start)) {
      return connectedWalls;
    }
  }

  return connectedWalls;
}

function calculateStructureDimensions(walls: Wall[]) {
  if (walls.length < 3) return null;

  const points = walls.flatMap(wall => [wall.start, wall.end]);
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  // Trouver le mur le plus long pour déterminer la largeur
  const wallLengths = walls.map(wall => {
    const dx = wall.end.x - wall.start.x;
    const dy = wall.end.y - wall.start.y;
    return Math.sqrt(dx * dx + dy * dy);
  });
  const maxLength = Math.max(...wallLengths);

  return {
    width: maxX - minX,
    depth: maxY - minY,
    center: {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2
    }
  };
}

export default ShelterMeasurements;