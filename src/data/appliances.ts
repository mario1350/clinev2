import type { Appliance } from '../types/analysis';

export const commonAppliances: Appliance[] = [
  // Kitchen Appliances
  {
    id: 'fridge',
    name: 'Refrigerator',
    category: 'kitchen',
    powerRating: 150,
    hoursPerDay: 24,
    quantity: 1,
    standbyPower: 0
  },
  {
    id: 'microwave',
    name: 'Microwave',
    category: 'kitchen',
    powerRating: 1100,
    hoursPerDay: 0.5,
    quantity: 1,
    standbyPower: 3
  },
  {
    id: 'stove',
    name: 'Electric Stove',
    category: 'kitchen',
    powerRating: 2100,
    hoursPerDay: 1.5,
    quantity: 1,
    standbyPower: 0
  },
  {
    id: 'dishwasher',
    name: 'Dishwasher',
    category: 'kitchen',
    powerRating: 1800,
    hoursPerDay: 1,
    quantity: 1,
    standbyPower: 2
  },

  // Climate Control
  {
    id: 'ac',
    name: 'Air Conditioner',
    category: 'climate',
    powerRating: 3500,
    hoursPerDay: 8,
    quantity: 1,
    efficiency: 0.9
  },
  {
    id: 'fan',
    name: 'Ceiling Fan',
    category: 'climate',
    powerRating: 75,
    hoursPerDay: 8,
    quantity: 1,
    standbyPower: 0
  },

  // Laundry
  {
    id: 'washer',
    name: 'Washing Machine',
    category: 'laundry',
    powerRating: 500,
    hoursPerDay: 1,
    quantity: 1,
    standbyPower: 1
  },
  {
    id: 'dryer',
    name: 'Clothes Dryer',
    category: 'laundry',
    powerRating: 3000,
    hoursPerDay: 1,
    quantity: 1,
    standbyPower: 0
  },

  // Entertainment
  {
    id: 'tv',
    name: 'Television',
    category: 'entertainment',
    powerRating: 100,
    hoursPerDay: 4,
    quantity: 1,
    standbyPower: 5
  },
  {
    id: 'computer',
    name: 'Computer',
    category: 'entertainment',
    powerRating: 200,
    hoursPerDay: 4,
    quantity: 1,
    standbyPower: 2
  },

  // Other
  {
    id: 'waterheater',
    name: 'Water Heater',
    category: 'other',
    powerRating: 4500,
    hoursPerDay: 3,
    quantity: 1,
    efficiency: 0.9
  },
  {
    id: 'lighting',
    name: 'LED Lighting',
    category: 'other',
    powerRating: 10,
    hoursPerDay: 5,
    quantity: 10,
    standbyPower: 0
  }
];