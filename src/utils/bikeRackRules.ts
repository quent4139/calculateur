// Constantes pour les règles de placement des arceaux vélos
export const BIKE_RACK_RULES = {
  // Distances minimales par rapport aux murs
  WALL_SPACING: {
    SIDE: 0.75,    // 75cm entre le côté d'un arceau et un mur
    END: 0.70,     // 70cm entre le haut/bas d'un arceau et un mur
  },
  
  // Distances minimales entre arceaux
  RACK_SPACING: {
    HORIZONTAL: 0.82,  // 82cm entre les côtés de deux arceaux
    VERTICAL: 1.35,    // 1.35m entre le haut/bas de deux arceaux
  },
  
  // Dimensions d'un arceau
  DIMENSIONS: {
    WIDTH: 0.70,   // 70cm de largeur
    HEIGHT: 0.85,  // 85cm de hauteur
  },
  
  // Dimensions minimales pour un espace valide
  MIN_SPACE: {
    WIDTH: 2.20,   // Largeur minimale pour un arceau (75cm + 70cm + 75cm)
    HEIGHT: 2.75,  // Hauteur minimale pour un arceau (70cm + 85cm + 70cm)
  },
  
  // Grille de placement
  GRID: {
    WALL: 0.10,    // 10cm pour les murs
    RACK: 0.02,    // 2cm pour les arceaux
  }
} as const;

// Types pour la validation des espaces
export interface SpaceValidation {
  isValid: boolean;
  reason?: string;
  availableWidth?: number;
  availableHeight?: number;
  maxRacksHorizontal?: number;
  maxRacksVertical?: number;
}

// Fonction pour valider un espace rectangulaire
export function validateSpace(width: number, height: number): SpaceValidation {
  if (width < BIKE_RACK_RULES.MIN_SPACE.WIDTH) {
    return {
      isValid: false,
      reason: `Largeur insuffisante (${width.toFixed(2)}m < ${BIKE_RACK_RULES.MIN_SPACE.WIDTH}m)`
    };
  }
  
  if (height < BIKE_RACK_RULES.MIN_SPACE.HEIGHT) {
    return {
      isValid: false,
      reason: `Hauteur insuffisante (${height.toFixed(2)}m < ${BIKE_RACK_RULES.MIN_SPACE.HEIGHT}m)`
    };
  }
  
  // Calculer l'espace disponible en tenant compte des marges
  const availableWidth = width - (2 * BIKE_RACK_RULES.WALL_SPACING.SIDE);
  const availableHeight = height - (2 * BIKE_RACK_RULES.WALL_SPACING.END);
  
  // Calculer le nombre maximum d'arceaux possibles
  const maxRacksHorizontal = Math.floor(availableWidth / BIKE_RACK_RULES.RACK_SPACING.HORIZONTAL);
  const maxRacksVertical = Math.floor(availableHeight / BIKE_RACK_RULES.RACK_SPACING.VERTICAL);
  
  return {
    isValid: true,
    availableWidth,
    availableHeight,
    maxRacksHorizontal,
    maxRacksVertical
  };
}