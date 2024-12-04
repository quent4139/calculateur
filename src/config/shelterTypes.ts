export interface ShelterDimensions {
  width: number;
  depth: number;
  inDevelopment?: boolean;
  name?: string;
}

export interface ShelterCategory {
  name: string;
  dimensions: ShelterDimensions[];
}

export interface ShelterType {
  name: string;
  description?: string;
  image: string;
  categories?: ShelterCategory[];
  dimensions?: ShelterDimensions[];
  isOpen: boolean;
}

export const SHELTER_TYPES: Record<string, ShelterType> = {
  bosquet: {
    name: "Abri Bosquet",
    description: "Protection optimale avec une structure ouverte et élégante",
    image: "https://bycommute.fr/wp-content/uploads/2024/04/abri-bosquet.jpg",
    isOpen: true,
    dimensions: [
      { width: 4.18, depth: 2.03 },
      { width: 5.18, depth: 2.03 },
      { width: 6.21, depth: 2.03 },
      { width: 7.21, depth: 2.03, inDevelopment: true },
      { width: 8.24, depth: 2.03 },
      { width: 9.24, depth: 2.03 },
      { width: 10.24, depth: 2.03 },
      { width: 11.27, depth: 2.03 },
      { width: 12.30, depth: 2.03 }
    ]
  },
  refuge: {
    name: "Abri Refuge",
    description: "Solution sécurisée avec accès contrôlé",
    image: "https://bycommute.fr/wp-content/uploads/2024/04/abri-refuge.jpg",
    isOpen: false,
    categories: [
      {
        name: "Profondeur 4m",
        dimensions: [
          { width: 4, depth: 4 },
          { width: 5, depth: 4 },
          { width: 6, depth: 4 },
          { width: 8, depth: 4 },
          { width: 9, depth: 4 },
          { width: 10, depth: 4 },
          { width: 11, depth: 4 },
          { width: 12, depth: 4 }
        ]
      },
      {
        name: "Profondeur 6m",
        dimensions: [
          { width: 4, depth: 6 },
          { width: 5, depth: 6 },
          { width: 6, depth: 6 },
          { width: 8, depth: 6 },
          { width: 9, depth: 6 },
          { width: 10, depth: 6 },
          { width: 11, depth: 6 },
          { width: 12, depth: 6 }
        ]
      },
      {
        name: "Profondeur 10m",
        dimensions: [
          { width: 6, depth: 10 }
        ]
      }
    ]
  },
  maritime: {
    name: "Abri Maritime",
    description: "Design robuste adapté aux environnements côtiers",
    image: "https://bycommute.fr/wp-content/uploads/2024/04/abri-maitime.jpg",
    isOpen: false,
    dimensions: [
      { width: 5.95, depth: 2.32, name: "Simple" },
      { width: 5.95, depth: 4.70, name: "Double" }
    ]
  },
  escale: {
    name: "Abri Escale",
    description: "Solution élégante en bois pour tous les environnements",
    image: "https://bycommute.fr/wp-content/uploads/2024/04/abri-esacle-bois.jpg",
    isOpen: true,
    dimensions: [
      { width: 5.90, depth: 2.35, name: "Simple" },
      { width: 11.90, depth: 2.35, name: "Double" }
    ]
  }
};