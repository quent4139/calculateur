import { Wall, Point, Shelter } from '../types';
import { BIKE_RACK_RULES } from './bikeRackRules';

interface Rectangle {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  walls: Wall[];
  isOpen?: boolean;
}

// Function to detect usable spaces for bike racks
export function detectEnclosedSpaces(walls: Wall[], shelters: Shelter[]): Rectangle[] {
  const spaces: Rectangle[] = [];
  const usedWalls = new Set<string>();

  // First, detect spaces from walls
  walls.forEach(startWall => {
    if (usedWalls.has(startWall.id)) return;

    const connectedWalls = findConnectedWalls(startWall, walls);
    if (connectedWalls.length >= 3) {
      const bounds = calculateBounds(connectedWalls);
      if (isValidSpace(bounds, connectedWalls)) {
        spaces.push({
          ...bounds,
          walls: connectedWalls,
          isOpen: connectedWalls.length === 3
        });
        
        // Mark walls as used
        connectedWalls.forEach(wall => usedWalls.add(wall.id));
      }
    }
  });

  // Then, add spaces from shelters
  shelters.forEach(shelter => {
    const shelterSpace = {
      minX: shelter.position.x - shelter.dimensions.width / 2,
      maxX: shelter.position.x + shelter.dimensions.width / 2,
      minY: shelter.position.y - shelter.dimensions.depth / 2,
      maxY: shelter.position.y + shelter.dimensions.depth / 2,
      walls: [], // Shelter walls are handled differently
      isOpen: shelter.isOpen
    };

    if (isValidShelterSpace(shelterSpace, shelter.isOpen)) {
      spaces.push(shelterSpace);
    }
  });

  return spaces;
}

// Function to find connected walls forming a space
function findConnectedWalls(startWall: Wall, allWalls: Wall[]): Wall[] {
  const connectedWalls: Wall[] = [startWall];
  const tolerance = BIKE_RACK_RULES.GRID.WALL;

  function arePointsConnected(p1: Point, p2: Point): boolean {
    return Math.abs(p1.x - p2.x) < tolerance && Math.abs(p1.y - p2.y) < tolerance;
  }

  function findNextWall(currentEnd: Point, excludeWallIds: Set<string>): Wall | null {
    return allWalls.find(wall => 
      !excludeWallIds.has(wall.id) &&
      (arePointsConnected(currentEnd, wall.start) || arePointsConnected(currentEnd, wall.end))
    ) || null;
  }

  const usedWallIds = new Set([startWall.id]);
  let currentWall = startWall;
  let currentEnd = currentWall.end;

  while (true) {
    const nextWall = findNextWall(currentEnd, usedWallIds);
    if (!nextWall || usedWallIds.size > 4) break;

    connectedWalls.push(nextWall);
    usedWallIds.add(nextWall.id);
    currentWall = nextWall;
    currentEnd = currentWall.end;

    if (arePointsConnected(currentEnd, startWall.start)) {
      return connectedWalls;
    }
  }

  return connectedWalls;
}

function calculateBounds(walls: Wall[]): Rectangle {
  const points = walls.flatMap(wall => [wall.start, wall.end]);
  return {
    minX: Math.min(...points.map(p => p.x)),
    maxX: Math.max(...points.map(p => p.x)),
    minY: Math.min(...points.map(p => p.y)),
    maxY: Math.max(...points.map(p => p.y)),
    walls
  };
}

function isValidSpace(rect: Rectangle, walls: Wall[]): boolean {
  const width = rect.maxX - rect.minX;
  const height = rect.maxY - rect.minY;
  
  // For open spaces (3 walls), only check minimum width
  if (walls.length === 3) {
    return width >= BIKE_RACK_RULES.MIN_SPACE.WIDTH;
  }
  
  // For closed spaces, check both width and height
  if (width < BIKE_RACK_RULES.MIN_SPACE.WIDTH || 
      height < BIKE_RACK_RULES.MIN_SPACE.HEIGHT) {
    return false;
  }

  if (walls.length < 3) {
    return false;
  }

  const hasHorizontalWall = walls.some(wall => 
    Math.abs(wall.start.y - wall.end.y) < BIKE_RACK_RULES.GRID.WALL
  );

  return hasHorizontalWall;
}

function isValidShelterSpace(rect: Rectangle, isOpen: boolean): boolean {
  const width = rect.maxX - rect.minX;
  const height = rect.maxY - rect.minY;
  
  // For open shelters, only check minimum width
  if (isOpen) {
    return width >= BIKE_RACK_RULES.MIN_SPACE.WIDTH;
  }
  
  // For closed shelters, check both width and height
  return width >= BIKE_RACK_RULES.MIN_SPACE.WIDTH && 
         height >= BIKE_RACK_RULES.MIN_SPACE.HEIGHT;
}