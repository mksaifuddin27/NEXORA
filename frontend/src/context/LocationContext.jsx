import React, { createContext, useContext, useState, useEffect } from 'react';
import { POPULAR_CITIES, geocodeLocationQuery, getGoogleMapsSearchUrl } from '../utils/geo';
const LocationContext = createContext(undefined);
export const LocationProvider = ({ children }) => {
    const [userLocation, setUserLocation] = useState(() => {
        const saved = localStorage.getItem('nexora_location');
        if (saved) {
            try {
                return JSON.parse(saved);
            }
            catch {
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
    const [permissionStatus, setPermissionStatus] = useState('prompt');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    useEffect(() => {
        if (userLocation) {
            localStorage.setItem('nexora_location', JSON.stringify(userLocation));
        }
        else {
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
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const newLoc = {
                latitude,
                longitude,
                cityName: 'My Current GPS Location',
                source: 'gps',
                isPermitted: true,
            };
            setUserLocation(newLoc);
            setPermissionStatus('granted');
            setIsLoading(false);
        }, (error) => {
            setIsLoading(false);
            if (error.code === error.PERMISSION_DENIED) {
                setPermissionStatus('denied');
                setErrorMessage('Location permission was denied. You can select your city manually below.');
            }
            else if (error.code === error.POSITION_UNAVAILABLE) {
                setPermissionStatus('unavailable');
                setErrorMessage('Current position is unavailable from your device network.');
            }
            else {
                setPermissionStatus('unavailable');
                setErrorMessage('Timeout while obtaining current location coordinates.');
            }
        }, { timeout: 10000, enableHighAccuracy: true });
    };
    const selectCityPreset = (city) => {
        const newLoc = {
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
    const searchLocationWithGoogle = async (query) => {
        if (!query.trim())
            return false;
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const result = await geocodeLocationQuery(query);
            if (result) {
                const newLoc = {
                    latitude: result.lat,
                    longitude: result.lng,
                    cityName: result.name,
                    source: 'manual',
                    isPermitted: true,
                };
                setUserLocation(newLoc);
                setIsLoading(false);
                return true;
            }
            else {
                setErrorMessage(`Could not pinpoint "${query}". Try a city or district name.`);
                setIsLoading(false);
                return false;
            }
        }
        catch {
            setErrorMessage('Network error while searching location.');
            setIsLoading(false);
            return false;
        }
    };
    const setCustomLocation = (lat, lng, name) => {
        setUserLocation({
            latitude: lat,
            longitude: lng,
            cityName: name,
            source: 'manual',
            isPermitted: true,
        });
    };
    const openGoogleMaps = (target) => {
        const query = target || userLocation?.cityName || 'Hyderabad, India';
        const url = getGoogleMapsSearchUrl(query);
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    const clearLocation = () => {
        setUserLocation(null);
        setPermissionStatus('prompt');
        setErrorMessage(null);
    };
    return (<LocationContext.Provider value={{
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
        }}>
      {children}
    </LocationContext.Provider>);
};
export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};
