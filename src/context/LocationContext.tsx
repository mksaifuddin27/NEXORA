import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserLocation } from '../types';
import { POPULAR_CITIES, CityPreset, geocodeLocationQuery, getGoogleMapsSearchUrl } from '../utils/geo';

interface LocationContextType {
  userLocation: UserLocation | null;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unavailable';
  isLoading: boolean;
  errorMessage: string | null;
  requestCurrentLocation: () => void;
  selectCityPreset: (city: CityPreset) => void;
  searchLocationWithGoogle: (query: string) => Promise<boolean>;
  setCustomLocation: (lat: number, lng: number, name: string) => void;
  openGoogleMaps: (target?: string) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => {
    const saved = localStorage.getItem('nexora_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default preset
    return {
      latitude: POPULAR_CITIES[0].lat,
      longitude: POPULAR_CITIES[0].lng,
      cityName: POPULAR_CITIES[0].name,
      source: 'manual',
      isPermitted: true,
    };
  });

  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unavailable'>('prompt');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('nexora_location', JSON.stringify(userLocation));
    } else {
      localStorage.removeItem('nexora_location');
    }
  }, [userLocation]);

  const requestCurrentLocation = () => {
    if (!navigator.geolocation) {
      setPermissionStatus('unavailable');
      setErrorMessage('Browser Geolocation is not supported by your current browser.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLoc: UserLocation = {
          latitude,
          longitude,
          cityName: 'My Current GPS Location',
          source: 'gps',
          isPermitted: true,
        };
        setUserLocation(newLoc);
        setPermissionStatus('granted');
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionStatus('denied');
          setErrorMessage('Location permission was denied. You can select your city manually below.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setPermissionStatus('unavailable');
          setErrorMessage('Current position is unavailable from your device network.');
        } else {
          setPermissionStatus('unavailable');
          setErrorMessage('Timeout while obtaining current location coordinates.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const selectCityPreset = (city: CityPreset) => {
    const newLoc: UserLocation = {
      latitude: city.lat,
      longitude: city.lng,
      cityName: city.name,
      source: 'manual',
      isPermitted: true,
    };
    setUserLocation(newLoc);
    setPermissionStatus('prompt');
    setErrorMessage(null);
  };

  const searchLocationWithGoogle = async (query: string): Promise<boolean> => {
    if (!query.trim()) return false;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await geocodeLocationQuery(query);
      if (result) {
        const newLoc: UserLocation = {
          latitude: result.lat,
          longitude: result.lng,
          cityName: result.name,
          source: 'manual',
          isPermitted: true,
        };
        setUserLocation(newLoc);
        setIsLoading(false);
        return true;
      } else {
        setErrorMessage(`Could not pinpoint "${query}". Try a city or district name.`);
        setIsLoading(false);
        return false;
      }
    } catch {
      setErrorMessage('Network error while searching location.');
      setIsLoading(false);
      return false;
    }
  };

  const setCustomLocation = (lat: number, lng: number, name: string) => {
    setUserLocation({
      latitude: lat,
      longitude: lng,
      cityName: name,
      source: 'manual',
      isPermitted: true,
    });
  };

  const openGoogleMaps = (target?: string) => {
    const query = target || userLocation?.cityName || 'Hyderabad, India';
    const url = getGoogleMapsSearchUrl(query);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const clearLocation = () => {
    setUserLocation(null);
    setPermissionStatus('prompt');
    setErrorMessage(null);
  };

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        permissionStatus,
        isLoading,
        errorMessage,
        requestCurrentLocation,
        selectCityPreset,
        searchLocationWithGoogle,
        setCustomLocation,
        openGoogleMaps,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
