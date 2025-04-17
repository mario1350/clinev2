import React, { useState, useCallback, useEffect } from 'react';
import { Sun, AlertTriangle, MapPin } from 'lucide-react';
import type { SolarCalculation } from '../../../types/solar';
import { fetchSolarAnalysis } from '../utils/solarApi';
import SolarAnalysisResults from './analysis/SolarAnalysisResults';
import LoadingState from './analysis/LoadingState';

interface RoofAnalysisStepProps {
  calculation: Partial<SolarCalculation>;
  onUpdate: (data: Partial<SolarCalculation>) => void;
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const RoofAnalysisStep: React.FC<RoofAnalysisStepProps> = ({ calculation, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solarData, setSolarData] = useState<any>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [coordinatesSaved, setCoordinatesSaved] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  const handleMapClick = useCallback((latLng: google.maps.LatLng) => {
    setSelectedCoordinates({
      lat: latLng.lat(),
      lng: latLng.lng()
    });
    setCoordinatesSaved(false);
  }, []);

  const handleSaveCoordinates = async () => {
    if (!selectedCoordinates) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchSolarAnalysis(selectedCoordinates);
      setSolarData(data);
      setCoordinatesSaved(true);
      
      onUpdate({
        ...calculation,
        roofAnalysis: {
          totalArea: data.roofArea,
          usableArea: data.usableArea,
          shadingPercentage: data.shadingPercentage,
          orientation: data.orientation,
          tilt: data.tilt,
          coordinates: selectedCoordinates
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch solar analysis');
    } finally {
      setLoading(false);
    }
  };

  // Check if Google Maps API is loaded
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps) {
        setMapsLoaded(true);
      } else {
        console.log('Waiting for Google Maps API to load...');
        setTimeout(checkGoogleMapsLoaded, 100);
      }
    };

    checkGoogleMapsLoaded();
  }, []);

  // Initialize map once Google Maps is loaded
  useEffect(() => {
    if (!mapsLoaded) return;

    const initMap = async () => {
      try {
        console.log('Initializing Google Maps...');
        const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        
        const myLatlng = { lat: 18.2208, lng: -66.5901 }; // Centered in Puerto Rico
        
        const mapInstance = new Map(document.getElementById("map") as HTMLElement, {
          zoom: 8,
          center: myLatlng,
          mapTypeId: 'satellite',
          tilt: 0,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false
        });
        
        const infoWindowInstance = new InfoWindow({
          content: "Click the map to select a location!",
          position: myLatlng,
        });

        infoWindowInstance.open(mapInstance);
        
        setMap(mapInstance);
        setInfoWindow(infoWindowInstance);
        
        mapInstance.addListener("click", (mapsMouseEvent: google.maps.MapMouseEvent) => {
          if (!mapsMouseEvent.latLng) return;
          
          infoWindowInstance.close();
          
          const contentDiv = document.createElement("div");
          contentDiv.innerHTML = `
            <div class="p-2">
              <p class="text-sm mb-2">Selected coordinates:</p>
              <p class="text-sm font-mono mb-2">${mapsMouseEvent.latLng.lat().toFixed(6)}, ${mapsMouseEvent.latLng.lng().toFixed(6)}</p>
            </div>
          `;
          
          infoWindowInstance.setContent(contentDiv);
          infoWindowInstance.setPosition(mapsMouseEvent.latLng);
          infoWindowInstance.open(mapInstance);
          
          handleMapClick(mapsMouseEvent.latLng);
        });
        
      } catch (error) {
        const err = error as Error;
        console.error('Error initializing map:', {
          message: err.message,
          stack: err.stack,
          error: err
        });
        setError(`Failed to initialize map: ${err.message}. Please check console for details.`);
      }
    };

    // Override the global initMap function
    window.initMap = initMap;
    initMap();

    return () => {
      if (map) {
        google.maps.event.clearInstanceListeners(map);
      }
      if (infoWindow) {
        infoWindow.close();
      }
    };
  }, [mapsLoaded, handleMapClick]);

  if (!mapsLoaded) {
    return (
      <div className="p-4 text-center">
        <LoadingState />
        <p className="mt-2 text-sm text-gray-600">Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Sun className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Solar Potential Analysis</h2>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Click on the map to select your location. Once placed, click "Analyze Solar Potential"
          to evaluate factors like roof area, shading, and optimal panel placement.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div id="map" className="h-[400px] w-full" />

        {selectedCoordinates && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Selected coordinates: {selectedCoordinates.lat.toFixed(6)}, {selectedCoordinates.lng.toFixed(6)}
              </div>
              <button
                onClick={handleSaveCoordinates}
                disabled={loading || coordinatesSaved}
                className="btn"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {coordinatesSaved ? 'Analysis Complete' : 'Analyze Solar Potential'}
              </button>
            </div>
          </div>
        )}
      </div>

      {loading && <LoadingState />}

      {error && (
        <div className="bg-red-50 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-red-800">Analysis Error</h4>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {solarData && <SolarAnalysisResults data={solarData} />}
    </div>
  );
};

export default RoofAnalysisStep;