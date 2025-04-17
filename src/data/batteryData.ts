import type { BatterySystem } from '../types/solar';

export const batteryOptions: BatterySystem[] = [
  {
    type: 'aGate',
    capacity: 0,
    voltage: 240,
    maxPower: 10000,
    efficiency: 0.95,
    price: 4999,
    description: 'Intelligent energy management system with built-in hybrid inverter',
    specs: {
      dimensions: '31.5" x 21.7" x 6.3"',
      weight: '38.6 lbs',
      warranty: '12 years',
      rating: 'NEMA 3R',
      maxUnits: 1
    }
  },
  {
    type: 'Envy10kW',
    capacity: 0,
    voltage: 240,
    maxPower: 10000,
    efficiency: 0.97,
    price: 5499,
    description: 'High-performance hybrid inverter with advanced monitoring',
    specs: {
      dimensions: '23.6" x 17.3" x 7.1"',
      weight: '58 lbs',
      warranty: '10 years',
      rating: 'IP65',
      maxUnits: 10,
      features: [
        'Built-in generator input',
        'AC/DC coupling',
        'Integrated rapid shutdown',
        'Remote monitoring'
      ]
    }
  },
  {
    type: 'aPower',
    capacity: 13600,
    voltage: 48,
    maxPower: 5000,
    efficiency: 0.89,
    price: 8999,
    description: 'High-capacity LFP battery storage system',
    specs: {
      dimensions: '45.3" x 29.5" x 11.4"',
      weight: '395 lbs',
      warranty: '12 years',
      rating: 'IP67/IP56',
      maxUnits: 15,
      cycleLife: '6,000 cycles at 70% DoD',
      throughput: '43 MWh',
      warrantyPeriod: '12 years'
    }
  },
  {
    type: 'eVaultMax',
    capacity: 18500,
    voltage: 51.2,
    maxPower: 9200,
    efficiency: 0.98,
    price: 9999,
    description: 'High-capacity scalable LFP battery system',
    specs: {
      dimensions: '20.3" x 20.3" x 42.2"',
      weight: '520 lbs',
      warranty: '10 years',
      rating: 'IP65',
      maxUnits: 20,
      cycleLife: '8,000 cycles at 80% DoD',
      peakPower: '12kW for 30 minutes',
      tempRange: {
        discharge: '-4°F to 140°F',
        charge: '32°F to 120°F'
      }
    }
  }
];
