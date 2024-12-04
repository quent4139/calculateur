import { Point, Wall, BikeRack } from '../types';
import { SPACING_RULES } from '../config/constants';

export interface Measurement {
  start: Point;
  end: Point;
  value: number;
  label: string;
  type: 'wall-to-rack' | 'rack-to-rack' | 'wall';
}

export function calculateMeasurements(
  walls: Wall[],
  bikeRacks: BikeRack[]
): Measurement[] {
  const measurements: Measurement[] = [];
  const processedPairs = new Set<string>();

  // Regrouper les arceaux par lignes
  const rackLines = groupRacksByLines(bikeRacks);

  // Pour chaque ligne horizontale
  rackLines.filter(line => line.isHorizontal).forEach(line => {
    const sortedRacks = line.racks.sort((a, b) => a.position.x - b.position.x);
    
    // Ne montrer que les distances entre arceaux adjacents
    for (let i = 0; i < sortedRacks.length - 1; i++) {
      const rack1 = sortedRacks[i];
      const rack2 = sortedRacks[i + 1];
      const distance = Math.abs(rack2.position.x - rack1.position.x);

      measurements.push({
        start: rack1.position,
        end: rack2.position,
        value: distance,
        label: `${distance.toFixed(2)}m`,
        type: 'rack-to-rack'
      });
    }

    // Pour chaque ligne, ne montrer qu'une seule mesure avec le mur du haut et du bas
    const topRack = sortedRacks[Math.floor(sortedRacks.length / 2)];
    const nearestWalls = findNearestVerticalWalls(topRack, walls);
    
    nearestWalls.forEach(({ wall, distance }) => {
      const perpPoint = getPerpendicularPoint(topRack.position, wall);
      measurements.push({
        start: topRack.position,
        end: perpPoint,
        value: distance,
        label: `${distance.toFixed(2)}m`,
        type: 'wall-to-rack'
      });
    });
  });

  // Pour chaque ligne verticale, montrer une seule distance entre les lignes
  const verticalLines = rackLines.filter(line => !line.isHorizontal);
  for (let i = 0; i < verticalLines.length - 1; i++) {
    const line1 = verticalLines[i];
    const line2 = verticalLines[i + 1];
    
    if (line1.racks.length > 0 && line2.racks.length > 0) {
      const rack1 = line1.racks[Math.floor(line1.racks.length / 2)];
      const rack2 = line2.racks[Math.floor(line2.racks.length / 2)];
      const distance = Math.abs(rack2.position.y - rack1.position.y);

      const key = `${Math.min(rack1.position.y, rack2.position.y)}-${Math.max(rack1.position.y, rack2.position.y)}`;
      if (!processedPairs.has(key)) {
        measurements.push({
          start: rack1.position,
          end: rack2.position,
          value: distance,
          label: `${distance.toFixed(2)}m`,
          type: 'rack-to-rack'
        });
        processedPairs.add(key);
      }
    }
  }

  return measurements;
}

interface RackLine {
  racks: BikeRack[];
  isHorizontal: boolean;
}

function groupRacksByLines(bikeRacks: BikeRack[]): RackLine[] {
  const lines: RackLine[] = [];
  const processedRacks = new Set<string>();

  bikeRacks.forEach(rack => {
    if (processedRacks.has(rack.id)) return;

    // Chercher les arceaux alignés horizontalement
    const horizontalLine = bikeRacks.filter(r => 
      Math.abs(r.position.y - rack.position.y) < 0.1
    );

    if (horizontalLine.length > 1) {
      lines.push({ racks: horizontalLine, isHorizontal: true });
      horizontalLine.forEach(r => processedRacks.add(r.id));
    }

    // Chercher les arceaux alignés verticalement
    const verticalLine = bikeRacks.filter(r => 
      Math.abs(r.position.x - rack.position.x) < 0.1
    );

    if (verticalLine.length > 1) {
      lines.push({ racks: verticalLine, isHorizontal: false });
      verticalLine.forEach(r => processedRacks.add(r.id));
    }
  });

  return lines;
}

function findNearestVerticalWalls(rack: BikeRack, walls: Wall[]): Array<{ wall: Wall; distance: number }> {
  // Ne considérer que les murs horizontaux
  const horizontalWalls = walls.filter(wall => 
    Math.abs(wall.start.y - wall.end.y) < 0.1
  );

  const wallDistances = horizontalWalls.map(wall => ({
    wall,
    distance: Math.abs(wall.start.y - rack.position.y)
  }));

  // Trier par distance
  wallDistances.sort((a, b) => a.distance - b.distance);

  // Ne retourner que les deux murs les plus proches (haut et bas)
  return wallDistances.slice(0, 2);
}

function getPerpendicularPoint(point: Point, wall: Wall): Point {
  return {
    x: point.x,
    y: wall.start.y
  };
}