export const SPACING_RULES = {
  // Distance minimale entre le côté d'un arceau et un mur
  RACK_TO_WALL_SIDE: 0.75, // 75cm
  
  // Distance minimale entre le haut/bas d'un arceau et un mur
  RACK_TO_WALL_END: 0.70, // 70cm (60cm + 10cm)
  
  // Distance minimale horizontale entre deux arceaux
  RACK_TO_RACK_HORIZONTAL: 0.82, // 82cm
  
  // Distance minimale verticale entre deux arceaux (mesurée entre les centres)
  RACK_TO_RACK_VERTICAL: 1.70, // 1.7m
} as const;

export const BIKE_RACK_DIMENSIONS = {
  HEIGHT: 0.85, // 85cm
  WIDTH: 0.7, // 70cm
} as const;

export const DUO_RACK_DIMENSIONS = {
  HEIGHT: 1.913, // 1913mm = 1.913m
  VARIANTS: {
    '4+4': { width: 1.641 }, // 1641mm = 1.641m
    '6+6': { width: 2.482 }, // 2482mm = 2.482m
    '8+8': { width: 3.281 }  // 3281mm = 3.281m
  },
  CIRCULATION_SPACE: 2.0, // 2m required in front
  MIN_CEILING_SPACE: 0.2, // 20cm minimum above
  SPACING: {
    BETWEEN_MODULES: 0.10 // 10cm between modules
  }
} as const;