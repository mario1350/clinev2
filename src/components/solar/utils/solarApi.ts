import { config } from '../../../lib/config';
import { SolarAnalysisError } from './errors';

interface Coordinates {
  lat: number;
  lng: number;
}

interface SolarAnalysisResponse {
  roofArea: number;
  usableArea: number;
  shadingPercentage: number;
  orientation: string;
  tilt: number;
  solarRadiation: number;
  estimatedOutput: number;
  coordinates: Coordinates;
}

interface GoogleSolarResponse {
  solarPotential?: {
    maxSunshineHoursPerYear?: number;
    yearlyEnergyDcKwh?: number;
    roofSegmentStats?: Array<{
      pitchDegrees?: number;
      azimuthDegrees?: number;
      stats?: {
        areaMeters2?: number;
        groundAreaMeters2?: number;
        sunshineQuantiles?: number[];
      };
    }>;
  };
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

export const fetchSolarAnalysis = async (coordinates: Coordinates): Promise<SolarAnalysisResponse> => {
  try {
    const { lat, lng } = coordinates;

    // Validate coordinates are within Puerto Rico bounds
    if (!isWithinPuertoRico(lat, lng)) {
      throw new SolarAnalysisError('Location must be within Puerto Rico');
    }

    // Make the request through our backend proxy
    const response = await fetch(`${config.apiBaseUrl}/api/solar-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordinates: { lat, lng } }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new SolarAnalysisError(error.message || 'Failed to fetch solar data');
    }

    const solarData: GoogleSolarResponse = await response.json();

    // Validate response has required data
    if (!solarData.solarPotential || !solarData.solarPotential.roofSegmentStats?.[0]) {
      throw new SolarAnalysisError('No solar potential data available for this location');
    }

    const roofSegment = solarData.solarPotential.roofSegmentStats[0];
    const stats = roofSegment.stats;

    if (!stats || !roofSegment.pitchDegrees || !roofSegment.azimuthDegrees) {
      throw new SolarAnalysisError('Incomplete roof data available for this location');
    }

    // Convert azimuth degrees to cardinal direction
    const orientation = getCardinalDirection(roofSegment.azimuthDegrees);

    // Calculate average sunshine hours per day
    const maxSunshineHours = solarData.solarPotential.maxSunshineHoursPerYear || 0;
    const dailySolarRadiation = maxSunshineHours / 365;

    // Transform and validate the response
    const analysisResponse: SolarAnalysisResponse = {
      roofArea: stats.areaMeters2 || 0,
      usableArea: stats.groundAreaMeters2 || 0,
      shadingPercentage: calculateShadingPercentage(stats.sunshineQuantiles || []),
      orientation,
      tilt: roofSegment.pitchDegrees,
      solarRadiation: dailySolarRadiation,
      estimatedOutput: solarData.solarPotential.yearlyEnergyDcKwh || 0,
      coordinates: { lat, lng }
    };

    // Validate transformed data
    validateAnalysisResponse(analysisResponse);

    return analysisResponse;
  } catch (error) {
    if (error instanceof SolarAnalysisError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new SolarAnalysisError(`Solar analysis failed: ${error.message}`);
    }
    
    throw new SolarAnalysisError('Solar analysis failed');
  }
};

// Utility function to validate coordinates are within Puerto Rico bounds
const isWithinPuertoRico = (lat: number, lng: number): boolean => {
  const PR_BOUNDS = {
    north: 18.5200,
    south: 17.8830,
    east: -65.2200,
    west: -67.9450
  };

  return (
    lat >= PR_BOUNDS.south &&
    lat <= PR_BOUNDS.north &&
    lng >= PR_BOUNDS.west &&
    lng <= PR_BOUNDS.east
  );
};

// Convert azimuth degrees to cardinal direction
const getCardinalDirection = (azimuth: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((azimuth %= 360) < 0 ? azimuth + 360 : azimuth) / 45) % 8;
  return directions[index];
};

// Calculate shading percentage from sunshine quantiles
const calculateShadingPercentage = (quantiles: number[]): number => {
  if (!quantiles.length) return 0;
  const avgSunshine = quantiles.reduce((a, b) => a + b, 0) / quantiles.length;
  return Math.round((1 - avgSunshine) * 100);
};

// Validate the analysis response has valid data
const validateAnalysisResponse = (response: SolarAnalysisResponse): void => {
  const requiredFields: Array<keyof SolarAnalysisResponse> = [
    'roofArea',
    'usableArea',
    'shadingPercentage',
    'solarRadiation',
    'estimatedOutput'
  ];

  for (const field of requiredFields) {
    const value = response[field];
    if (typeof value !== 'number' || isNaN(value)) {
      throw new SolarAnalysisError(`Invalid ${field} value in solar analysis response`);
    }
  }
};