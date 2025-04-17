export interface MaterialComponent {
  id: string;
  name: string;
  category: 'mounting' | 'electrical' | 'cabling' | 'conduit' | 'boxes' | 'breakers' | 'misc';
  description: string;
  price: number;
  unit: string;
  minQuantity: number;
  inStock: number;
  reorderPoint: number;
}

export interface SystemRequirement {
  componentId: string;
  quantity: number;
}

export interface SystemConfiguration {
  panelCount: number;
  dailyProduction: number;
  monthlyProduction: number;
  requirements: SystemRequirement[];
  totalCost: number;
}

export interface InstallationStep {
  id: string;
  title: string;
  description: string;
  category: string;
  required: boolean;
  completed: boolean;
  dependsOn?: string[];
}

export interface User {
  id: string;
  role: 'admin' | 'user';
}