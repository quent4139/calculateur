import { Wall, BikeRack, Point, Shelter } from '../types';
import { SPACING_RULES, DUO_RACK_DIMENSIONS } from '../config/constants';
import { detectEnclosedSpaces } from './spaceDetection';

export function autoPlaceBikeRacks(
  walls: Wall[], 
  existingRacks: BikeRack[], 
  shelters: Shelter[],
  type: 'oura' | 'duo' = 'oura'
): Point[] {
  const spaces = detectEnclosedSpaces(walls, shelters);
  if (spaces.length === 0) return [];

  return spaces.flatMap(space => {
    const width = space.maxX - space.minX;
    const height = space.maxY - space.minY;
    const isOpenSpace = space.isOpen || space.walls.length === 3;
    
    if (type === 'duo') {
      return calculateOptimalDuoPositions(
        space.minX,
        space.minY,
        width,
        height,
        existingRacks,
        isOpenSpace
      );
    }

    return calculateOptimalPositions(
      space.minX,
      space.minY,
      width,
      height,
      existingRacks,
      isOpenSpace
    );
  });
}

function calculateOptimalDuoPositions(
  startX: number,
  startY: number,
  width: number,
  height: number,
  existingRacks: BikeRack[],
  isOpenSpace: boolean
): Point[] {
  const positions: Point[] = [];
  const variants = ['8+8', '6+6', '4+4'] as const;
  
  // Calculate usable width accounting for wall margins
  const usableWidth = width - (2 * SPACING_RULES.RACK_TO_WALL_SIDE);
  let remainingWidth = usableWidth;
  let currentX = startX + SPACING_RULES.RACK_TO_WALL_SIDE;

  // Try to fit the largest possible variants
  while (remainingWidth > DUO_RACK_DIMENSIONS.VARIANTS['4+4'].width) {
    let selectedVariant = variants.find(variant => 
      DUO_RACK_DIMENSIONS.VARIANTS[variant].width <= remainingWidth
    );

    if (!selectedVariant) break;

    const variantWidth = DUO_RACK_DIMENSIONS.VARIANTS[selectedVariant].width;
    
    // Position for a single rack
    positions.push({
      x: currentX + variantWidth / 2,
      y: startY + DUO_RACK_DIMENSIONS.HEIGHT / 2 + SPACING_RULES.RACK_TO_WALL_END
    });

    currentX += variantWidth + DUO_RACK_DIMENSIONS.SPACING.BETWEEN_MODULES;
    remainingWidth -= variantWidth + DUO_RACK_DIMENSIONS.SPACING.BETWEEN_MODULES;
  }

  return positions;
}

function calculateOptimalPositions(
  startX: number,
  startY: number,
  width: number,
  height: number,
  existingRacks: BikeRack[],
  isOpenSpace: boolean
): Point[] {
  const positions: Point[] = [];
  const availableWidth = width - (2 * SPACING_RULES.RACK_TO_WALL_SIDE);
  
  // Calculate number of possible racks per row
  const maxRacksPerRow = Math.floor(
    (availableWidth + SPACING_RULES.RACK_TO_RACK_HORIZONTAL) / 
    SPACING_RULES.RACK_TO_RACK_HORIZONTAL
  );
  
  if (maxRacksPerRow <= 0) return positions;
  
  // Center racks horizontally
  const totalWidthUsed = (maxRacksPerRow - 1) * SPACING_RULES.RACK_TO_RACK_HORIZONTAL;
  const horizontalMargin = startX + (width - totalWidthUsed) / 2;

  if (isOpenSpace) {
    // For open shelters, always place a single row along the top wall
    const y = startY + SPACING_RULES.RACK_TO_WALL_END;
    for (let i = 0; i < maxRacksPerRow; i++) {
      positions.push({
        x: horizontalMargin + i * SPACING_RULES.RACK_TO_RACK_HORIZONTAL,
        y: y
      });
    }
  } else {
    // For closed shelters, maintain the original multi-row logic with height requirements
    if (height >= 3 && height < 5) {
      // Single row at the bottom
      const y = startY + SPACING_RULES.RACK_TO_WALL_END;
      for (let i = 0; i < maxRacksPerRow; i++) {
        positions.push({
          x: horizontalMargin + i * SPACING_RULES.RACK_TO_RACK_HORIZONTAL,
          y: y
        });
      }
    } else if (height >= 5 && height < 8) {
      // Two rows (top and bottom)
      const y1 = startY + SPACING_RULES.RACK_TO_WALL_END;
      const y2 = startY + height - SPACING_RULES.RACK_TO_WALL_END;
      
      for (let i = 0; i < maxRacksPerRow; i++) {
        const x = horizontalMargin + i * SPACING_RULES.RACK_TO_RACK_HORIZONTAL;
        positions.push({ x, y: y1 }, { x, y: y2 });
      }
    } else if (height >= 8) {
      // Three rows (top, middle, bottom)
      const y1 = startY + SPACING_RULES.RACK_TO_WALL_END;
      const y3 = startY + height - SPACING_RULES.RACK_TO_WALL_END;
      const y2 = (y1 + y3) / 2;
      
      for (let i = 0; i < maxRacksPerRow; i++) {
        const x = horizontalMargin + i * SPACING_RULES.RACK_TO_RACK_HORIZONTAL;
        positions.push({ x, y: y1 }, { x, y: y2 }, { x, y: y3 });
      }
    }
  }
  
  return positions;
}