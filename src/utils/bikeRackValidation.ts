import { Point, Wall, BikeRack, ValidationResult } from '../types';
import { SPACING_RULES, DUO_RACK_DIMENSIONS } from '../config/constants';

export function validateBikeRackPlacement(
  position: Point,
  walls: Wall[],
  bikeRacks: BikeRack[],
  type: 'oura' | 'duo' = 'oura',
  variant?: '4+4' | '6+6' | '8+8'
): ValidationResult[] {
  const validations: ValidationResult[] = [];

  if (type === 'duo' && variant) {
    return validateDuoRackPlacement(position, walls, bikeRacks, variant);
  }

  // Vérification des distances par rapport aux murs
  let hasValidWallDistance = false;
  for (const wall of walls) {
    const distance = distancePointToLineSegment(position, wall.start, wall.end);
    const isHorizontalWall = Math.abs(wall.start.y - wall.end.y) < 0.1;
    const minDistance = isHorizontalWall ? 
      SPACING_RULES.RACK_TO_WALL_END : 
      SPACING_RULES.RACK_TO_WALL_SIDE;
    
    if (distance <= minDistance * 1.5) { // On vérifie si on est assez proche d'un mur
      hasValidWallDistance = true;
      validations.push({
        isValid: distance >= minDistance,
        message: isHorizontalWall ?
          `Distance à l'entrée/sortie : ${distance.toFixed(2)}m (minimum ${minDistance}m requis)` :
          `Distance au mur : ${distance.toFixed(2)}m (minimum ${minDistance}m requis)`
      });
    }
  }

  // Si aucun mur n'est assez proche, c'est une erreur
  if (walls.length > 0 && !hasValidWallDistance) {
    validations.push({
      isValid: false,
      message: "L'arceau doit être placé à proximité d'un mur ou d'une structure"
    });
  }

  // Vérification des distances par rapport aux autres arceaux
  for (const rack of bikeRacks) {
    const dx = Math.abs(rack.position.x - position.x);
    const dy = Math.abs(rack.position.y - position.y);
    
    // Si les arceaux sont alignés horizontalement
    if (dy < 0.1) {
      validations.push({
        isValid: dx >= SPACING_RULES.RACK_TO_RACK_HORIZONTAL,
        message: `Distance entre arceaux : ${dx.toFixed(2)}m (minimum ${SPACING_RULES.RACK_TO_RACK_HORIZONTAL}m requis)`
      });
    }
    // Si les arceaux sont alignés verticalement
    else if (dx < 0.1) {
      validations.push({
        isValid: dy >= SPACING_RULES.RACK_TO_RACK_VERTICAL,
        message: `Espacement vertical : ${dy.toFixed(2)}m (minimum ${SPACING_RULES.RACK_TO_RACK_VERTICAL}m requis)`
      });
    }
  }

  return validations;
}

function validateDuoRackPlacement(
  position: Point,
  walls: Wall[],
  bikeRacks: BikeRack[],
  variant: '4+4' | '6+6' | '8+8'
): ValidationResult[] {
  const validations: ValidationResult[] = [];
  const rackWidth = DUO_RACK_DIMENSIONS.VARIANTS[variant].width;

  // Vérification des distances par rapport aux murs
  let hasValidWallDistance = false;
  for (const wall of walls) {
    const distance = distancePointToLineSegment(position, wall.start, wall.end);
    const isHorizontalWall = Math.abs(wall.start.y - wall.end.y) < 0.1;
    
    if (distance <= SPACING_RULES.RACK_TO_WALL_END * 1.5) {
      hasValidWallDistance = true;
      if (isHorizontalWall) {
        validations.push({
          isValid: distance >= DUO_RACK_DIMENSIONS.CIRCULATION_SPACE,
          message: `Espace de circulation : ${distance.toFixed(2)}m (minimum ${DUO_RACK_DIMENSIONS.CIRCULATION_SPACE}m requis)`
        });
      } else {
        validations.push({
          isValid: distance >= SPACING_RULES.RACK_TO_WALL_SIDE,
          message: `Distance au mur : ${distance.toFixed(2)}m (minimum ${SPACING_RULES.RACK_TO_WALL_SIDE}m requis)`
        });
      }
    }
  }

  // Si aucun mur n'est assez proche, c'est une erreur
  if (walls.length > 0 && !hasValidWallDistance) {
    validations.push({
      isValid: false,
      message: "Le rack doit être placé à proximité d'un mur ou d'une structure"
    });
  }

  // Vérification des distances avec les autres racks
  for (const rack of bikeRacks) {
    if (rack.type === 'duo') {
      const dx = Math.abs(rack.position.x - position.x);
      const dy = Math.abs(rack.position.y - position.y);

      // Si les racks sont alignés horizontalement
      if (dy < 0.1) {
        validations.push({
          isValid: dx >= DUO_RACK_DIMENSIONS.SPACING.BETWEEN_MODULES,
          message: `Distance entre modules : ${dx.toFixed(2)}m (minimum ${DUO_RACK_DIMENSIONS.SPACING.BETWEEN_MODULES}m requis)`
        });
      }
    }
  }

  return validations;
}

// Fonction utilitaire pour calculer la distance entre un point et un segment de ligne
export function distancePointToLineSegment(point: Point, lineStart: Point, lineEnd: Point): number {
  const A = lineEnd.x - lineStart.x;
  const B = lineEnd.y - lineStart.y;
  const C = point.x - lineStart.x;
  const D = point.y - lineStart.y;

  const wallLengthSq = A * A + B * B;

  if (wallLengthSq === 0) {
    return Math.sqrt(C * C + D * D);
  }

  const t = Math.max(0, Math.min(1, (A * C + B * D) / wallLengthSq));

  const projX = lineStart.x + t * A;
  const projY = lineStart.y + t * B;

  return Math.sqrt(
    Math.pow(point.x - projX, 2) + 
    Math.pow(point.y - projY, 2)
  );
}