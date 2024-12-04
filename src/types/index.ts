export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
}

export interface BikeRack {
  id: string;
  position: Point;
  rotation: number;
  type: 'oura' | 'duo';
  variant?: '4+4' | '6+6' | '8+8';  // Only for duo type
  bikes?: {
    left: boolean;
    right: boolean;
  };
}

export interface Shelter {
  id: string;
  type: string;
  dimensions: {
    width: number;
    depth: number;
  };
  position: Point;
  rotation: number;
  isOpen: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface Selection {
  type: 'wall' | 'bikeRack' | 'shelter';
  id: string;
}

export type WallBuildingMode = 'custom' | 'rectangle' | 'openShelter';