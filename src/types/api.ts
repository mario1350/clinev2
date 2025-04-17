export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface AuthResponse {
  token: string;
  expires: string;
}

export interface OrganizationData {
  id: string;
  name: string;
  settings: {
    defaultLocation: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface SystemCreationData {
  name: string;
  consumption: {
    monthly: number;
    annual: number;
  };
  system: {
    panelCount: number;
    panelCapacity: number;
    dailyProduction: number;
    monthlyProduction: number;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface SystemResponse {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'archived';
  created: string;
  updated: string;
  consumption: {
    monthly: number;
    annual: number;
  };
  system: {
    panelCount: number;
    panelCapacity: number;
    dailyProduction: number;
    monthlyProduction: number;
    systemSize: number;
  };
}

export interface SystemCalculation {
  id: string;
  monthlyProduction: number;
  annualProduction: number;
  systemSize: number;
  panelCount: number;
  co2Offset: number;
  roi: {
    years: number;
    savings: number;
  };
  components: {
    panels: {
      id: string;
      name: string;
      count: number;
    }[];
    inverters: {
      id: string;
      name: string;
      count: number;
    }[];
  };
}