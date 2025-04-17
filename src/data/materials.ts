import type { MaterialComponent } from '../types/vendor';

export const materials: MaterialComponent[] = [
  // Mounting Components
  {
    id: 'mount-1',
    name: 'EXPANSIONES SS 3/8',
    category: 'mounting',
    description: 'Stainless steel expansion bolts',
    price: 2.99,
    unit: 'piece',
    minQuantity: 4,
    inStock: 200,
    reorderPoint: 50
  },
  {
    id: 'mount-2',
    name: 'PATA BAJA',
    category: 'mounting',
    description: 'Low-profile mounting foot',
    price: 12.99,
    unit: 'piece',
    minQuantity: 4,
    inStock: 150,
    reorderPoint: 40
  },
  {
    id: 'mount-3',
    name: 'PATA ALTA',
    category: 'mounting',
    description: 'High-profile mounting foot',
    price: 14.99,
    unit: 'piece',
    minQuantity: 4,
    inStock: 120,
    reorderPoint: 40
  },
  {
    id: 'mount-4',
    name: 'RIEL 246"',
    category: 'mounting',
    description: 'Mounting rail',
    price: 45.99,
    unit: 'piece',
    minQuantity: 2,
    inStock: 80,
    reorderPoint: 30
  },
  {
    id: 'mount-5',
    name: 'SPLICE BAR',
    category: 'mounting',
    description: 'Rail connector bar',
    price: 8.99,
    unit: 'piece',
    minQuantity: 2,
    inStock: 100,
    reorderPoint: 30
  },
  {
    id: 'mount-6',
    name: 'GROUNDING LUG',
    category: 'mounting',
    description: 'Grounding connection point',
    price: 5.99,
    unit: 'piece',
    minQuantity: 2,
    inStock: 150,
    reorderPoint: 40
  },
  {
    id: 'mount-7',
    name: 'END CLAMP',
    category: 'mounting',
    description: 'End panel mounting clamp',
    price: 6.99,
    unit: 'piece',
    minQuantity: 4,
    inStock: 200,
    reorderPoint: 50
  },
  {
    id: 'mount-8',
    name: 'MID CLAMP',
    category: 'mounting',
    description: 'Middle panel mounting clamp',
    price: 6.99,
    unit: 'piece',
    minQuantity: 4,
    inStock: 200,
    reorderPoint: 50
  },

  // Electrical Components
  {
    id: 'elec-1',
    name: 'MC4 MALE',
    category: 'electrical',
    description: 'Male MC4 connector',
    price: 3.99,
    unit: 'piece',
    minQuantity: 2,
    inStock: 300,
    reorderPoint: 100
  },
  {
    id: 'elec-2',
    name: 'MC4 FEMALE',
    category: 'electrical',
    description: 'Female MC4 connector',
    price: 3.99,
    unit: 'piece',
    minQuantity: 2,
    inStock: 300,
    reorderPoint: 100
  },

  // Conduit Components
  {
    id: 'conduit-1',
    name: 'TUBO PVC 1"',
    category: 'conduit',
    description: '1-inch PVC conduit',
    price: 4.99,
    unit: 'piece',
    minQuantity: 1,
    inStock: 150,
    reorderPoint: 40
  },
  // Add all other conduit components...

  // Boxes and Enclosures
  {
    id: 'box-1',
    name: 'J.BOX 4X4X2',
    category: 'boxes',
    description: '4x4x2 junction box',
    price: 3.99,
    unit: 'piece',
    minQuantity: 1,
    inStock: 100,
    reorderPoint: 30
  },
  // Add all other boxes...

  // Cables
  {
    id: 'cable-1',
    name: 'CABLE #10 NEGRO',
    category: 'cabling',
    description: '#10 Black cable',
    price: 1.99,
    unit: 'meter',
    minQuantity: 10,
    inStock: 500,
    reorderPoint: 150
  },
  // Add all other cables...

  // Breakers
  {
    id: 'breaker-1',
    name: 'BREAKER CSR',
    category: 'breakers',
    description: 'CSR circuit breaker',
    price: 45.99,
    unit: 'piece',
    minQuantity: 1,
    inStock: 50,
    reorderPoint: 15
  },
  // Add all other breakers...

  // Miscellaneous
  {
    id: 'misc-1',
    name: 'WARNING LABELS',
    category: 'misc',
    description: 'Safety warning labels',
    price: 0.99,
    unit: 'piece',
    minQuantity: 5,
    inStock: 200,
    reorderPoint: 50
  },
  // Add remaining misc items...
];