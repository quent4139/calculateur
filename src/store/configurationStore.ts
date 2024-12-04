import { create } from 'zustand';
import { Wall, BikeRack, Shelter, Point, WallBuildingMode, Selection } from '../types';
import { validateBikeRackPlacement } from '../utils/bikeRackValidation';
import { autoPlaceBikeRacks } from '../utils/autoBikeRackPlacement';
import { snapToBikeRackGrid, snapToWallGrid } from '../utils/geometry';
import { DUO_RACK_DIMENSIONS } from '../config/constants';

interface ConfigurationState {
  walls: Wall[];
  bikeRacks: BikeRack[];
  shelters: Shelter[];
  viewMode: '2d' | '3d';
  isTransitioning: boolean;
  isBuilding: boolean;
  buildingMode: WallBuildingMode | 'bikeRack';
  buildingStartPoint: Point | null;
  previewEndPoint: Point | null;
  waitingForFirstClick: boolean;
  showWallMenu: boolean;
  lastPlacedBikeRack: BikeRack | null;
  settings: {
    showMeasurements: boolean;
    showBikes: boolean;
    hideBackground: boolean;
  };
  currentValidations: { isValid: boolean; message: string; }[];
  selectedElement: Selection | null;
  isDragging: boolean;
  currentBikeRackType: 'oura' | 'duo';
  currentDuoVariant?: '4+4' | '6+6' | '8+8';

  toggleWallMenu: () => void;
  startBuilding: (mode: WallBuildingMode) => void;
  stopBuilding: () => void;
  setPreviewPoint: (point: Point) => void;
  handleWallClick: (point: Point) => void;
  handleBikeRackPlacement: (point: Point) => void;
  startPlacingBikeRack: (type: 'oura' | 'duo', variant?: '4+4' | '6+6' | '8+8') => void;
  startAutomaticPlacement: (type: 'oura' | 'duo') => void;
  setViewMode: (mode: '2d' | '3d') => void;
  setTransitioning: (transitioning: boolean) => void;
  toggleSetting: (setting: keyof ConfigurationState['settings']) => void;
  selectElement: (element: Selection | null) => void;
  deleteSelectedElement: () => void;
  startDragging: () => void;
  stopDragging: () => void;
  moveElement: (point: Point) => void;
  rotateElement: () => void;
  addShelter: (shelter: Omit<Shelter, 'id'>) => void;
  resetProject: () => void;
}

const initialState = {
  walls: [],
  bikeRacks: [],
  shelters: [],
  viewMode: '2d' as const,
  isTransitioning: false,
  isBuilding: false,
  buildingMode: 'custom' as const,
  buildingStartPoint: null,
  previewEndPoint: null,
  waitingForFirstClick: false,
  showWallMenu: false,
  lastPlacedBikeRack: null,
  settings: {
    showMeasurements: false,
    showBikes: false,
    hideBackground: false,
  },
  currentValidations: [],
  selectedElement: null,
  isDragging: false,
  currentBikeRackType: 'oura' as const,
  currentDuoVariant: undefined,
};

export const useConfigurationStore = create<ConfigurationState>((set, get) => ({
  ...initialState,

  toggleWallMenu: () => set((state) => ({ 
    showWallMenu: !state.showWallMenu,
    isBuilding: false,
    buildingStartPoint: null,
    previewEndPoint: null,
    waitingForFirstClick: false,
    selectedElement: null
  })),

  startBuilding: (mode) => {
    set({ 
      isBuilding: false,
      buildingStartPoint: null,
      previewEndPoint: null,
      waitingForFirstClick: false,
      selectedElement: null
    });

    setTimeout(() => {
      set({
        isBuilding: true, 
        buildingMode: mode,
        buildingStartPoint: null,
        previewEndPoint: null,
        waitingForFirstClick: true,
        viewMode: '2d',
        showWallMenu: false,
        selectedElement: null
      });
    }, 50);
  },

  stopBuilding: () => set({ 
    isBuilding: false, 
    buildingStartPoint: null, 
    previewEndPoint: null,
    waitingForFirstClick: false,
    lastPlacedBikeRack: null,
    selectedElement: null,
    currentBikeRackType: 'oura',
    currentDuoVariant: undefined
  }),

  setPreviewPoint: (point) => set((state) => {
    if (!state.isBuilding) return state;
    if (state.waitingForFirstClick) return state;
    return { previewEndPoint: point };
  }),

  handleWallClick: (point) => set((state) => {
    if (!state.isBuilding) return state;

    if (state.waitingForFirstClick) {
      return {
        buildingStartPoint: point,
        previewEndPoint: point,
        waitingForFirstClick: false,
      };
    }

    if (!state.buildingStartPoint || !state.previewEndPoint) return state;

    const distance = Math.sqrt(
      Math.pow(state.previewEndPoint.x - state.buildingStartPoint.x, 2) +
      Math.pow(state.previewEndPoint.y - state.buildingStartPoint.y, 2)
    );
    
    if (distance < 0.5) return state;

    if (state.buildingMode === 'rectangle' || state.buildingMode === 'openShelter') {
      const walls = [
        ...(state.buildingMode === 'rectangle' ? [{
          id: crypto.randomUUID(),
          start: state.buildingStartPoint,
          end: { x: state.previewEndPoint.x, y: state.buildingStartPoint.y }
        }] : []),
        {
          id: crypto.randomUUID(),
          start: { x: state.previewEndPoint.x, y: state.buildingStartPoint.y },
          end: state.previewEndPoint
        },
        {
          id: crypto.randomUUID(),
          start: state.previewEndPoint,
          end: { x: state.buildingStartPoint.x, y: state.previewEndPoint.y }
        },
        {
          id: crypto.randomUUID(),
          start: { x: state.buildingStartPoint.x, y: state.previewEndPoint.y },
          end: state.buildingStartPoint
        }
      ];
      
      return {
        walls: [...state.walls, ...walls],
        isBuilding: false,
        buildingStartPoint: null,
        previewEndPoint: null,
        waitingForFirstClick: false
      };
    }
    
    const newWall = { 
      id: crypto.randomUUID(), 
      start: state.buildingStartPoint, 
      end: state.previewEndPoint 
    };
    
    return {
      walls: [...state.walls, newWall],
      buildingStartPoint: state.previewEndPoint,
      previewEndPoint: state.previewEndPoint,
    };
  }),

  handleBikeRackPlacement: (point) => {
    const state = get();
    const validations = validateBikeRackPlacement(
      point, 
      state.walls, 
      state.bikeRacks,
      state.currentBikeRackType,
      state.currentDuoVariant
    );
    const isValidPlacement = validations.every(v => v.isValid);

    if (isValidPlacement) {
      const newRack: BikeRack = {
        id: crypto.randomUUID(),
        position: point,
        rotation: Math.PI / 2,
        type: state.currentBikeRackType,
        variant: state.currentDuoVariant
      };

      set((state) => ({
        bikeRacks: [...state.bikeRacks, newRack],
        lastPlacedBikeRack: newRack,
        currentValidations: []
      }));
    } else {
      set({ currentValidations: validations });
    }
  },

  startPlacingBikeRack: (type, variant) => set({
    isBuilding: true,
    buildingMode: 'bikeRack',
    buildingStartPoint: null,
    previewEndPoint: null,
    waitingForFirstClick: false,
    viewMode: '2d',
    showWallMenu: false,
    lastPlacedBikeRack: null,
    currentBikeRackType: type,
    currentDuoVariant: variant,
    selectedElement: null
  }),

  startAutomaticPlacement: (type) => {
    const state = get();
    const positions = autoPlaceBikeRacks(state.walls, state.bikeRacks, state.shelters, type);
    
    const newRacks = positions.map(position => {
      let variant: '4+4' | '6+6' | '8+8' | undefined;
      
      if (type === 'duo') {
        const variants: ('8+8' | '6+6' | '4+4')[] = ['8+8', '6+6', '4+4'];
        variant = variants.find(v => {
          const width = DUO_RACK_DIMENSIONS.VARIANTS[v].width;
          return width <= Math.abs(state.walls[0]?.end.x - state.walls[0]?.start.x);
        }) || '4+4';
      }

      return {
        id: crypto.randomUUID(),
        position,
        rotation: Math.PI / 2,
        type,
        variant
      };
    });

    set((state) => ({
      bikeRacks: [...state.bikeRacks, ...newRacks]
    }));
  },

  setViewMode: (mode) => set({ viewMode: mode }),
  
  setTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
  
  toggleSetting: (setting) => set((state) => ({
    settings: {
      ...state.settings,
      [setting]: !state.settings[setting]
    }
  })),

  selectElement: (element) => set({ selectedElement: element }),
  
  deleteSelectedElement: () => set((state) => {
    if (!state.selectedElement) return state;

    switch (state.selectedElement.type) {
      case 'wall':
        return {
          walls: state.walls.filter(w => w.id !== state.selectedElement!.id),
          selectedElement: null
        };
      case 'bikeRack':
        return {
          bikeRacks: state.bikeRacks.filter(r => r.id !== state.selectedElement!.id),
          selectedElement: null
        };
      case 'shelter':
        return {
          shelters: state.shelters.filter(s => s.id !== state.selectedElement!.id),
          selectedElement: null
        };
      default:
        return state;
    }
  }),

  startDragging: () => set((state) => {
    if (!state.selectedElement) return state;
    return { isDragging: true };
  }),

  stopDragging: () => set({ 
    isDragging: false,
    selectedElement: null 
  }),

  moveElement: (point) => set((state) => {
    if (!state.selectedElement || !state.isDragging) return state;

    switch (state.selectedElement.type) {
      case 'wall':
        return state;
      case 'bikeRack':
        return {
          bikeRacks: state.bikeRacks.map(rack =>
            rack.id === state.selectedElement!.id
              ? { ...rack, position: point }
              : rack
          )
        };
      case 'shelter':
        return {
          shelters: state.shelters.map(shelter =>
            shelter.id === state.selectedElement!.id
              ? { ...shelter, position: point }
              : shelter
          )
        };
      default:
        return state;
    }
  }),

  rotateElement: () => set((state) => {
    if (!state.selectedElement) return state;

    switch (state.selectedElement.type) {
      case 'bikeRack':
        return {
          bikeRacks: state.bikeRacks.map(rack =>
            rack.id === state.selectedElement!.id
              ? { ...rack, rotation: rack.rotation + Math.PI / 2 }
              : rack
          )
        };
      case 'shelter':
        return {
          shelters: state.shelters.map(shelter =>
            shelter.id === state.selectedElement!.id
              ? { ...shelter, rotation: shelter.rotation + Math.PI / 2 }
              : shelter
          )
        };
      default:
        return state;
    }
  }),

  addShelter: (shelter) => set((state) => ({
    shelters: [...state.shelters, {
      ...shelter,
      id: crypto.randomUUID()
    }]
  })),

  resetProject: () => set(initialState)
}));