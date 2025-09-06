import { useEffect, useState } from "react";

export interface ILocation {
  latitude: number | null;
  longitude: number | null;
}

const LOCATION_CACHE_KEY = "userLocation";
const LOCATION_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface CachedLocation {
  location: ILocation;
  timestamp: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get cached location first
    const getCachedLocation = (): ILocation | null => {
      try {
        const cached = localStorage.getItem(LOCATION_CACHE_KEY);
        if (cached) {
          const { location: cachedLocation, timestamp }: CachedLocation =
            JSON.parse(cached);
          const now = Date.now();

          // Check if cached location is still valid (within cache duration)
          if (now - timestamp < LOCATION_CACHE_DURATION) {
            return cachedLocation;
          }
        }
      } catch (error) {
        console.error("Error reading cached location:", error);
      }
      return null;
    };

    // Cache location
    const cacheLocation = (loc: ILocation) => {
      try {
        const cacheData: CachedLocation = {
          location: loc,
          timestamp: Date.now(),
        };
        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(cacheData));
      } catch (error) {
        console.error("Error caching location:", error);
      }
    };

    // Get current location
    const getCurrentLocation = (setLoadingState = true) => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
        return;
      }

      if (setLoadingState) {
        setLoading(true);
      }

      const options: PositionOptions = {
        enableHighAccuracy: false, // Faster response
        timeout: 10000, // 10 seconds timeout
        maximumAge: 300000, // Accept location up to 5 minutes old
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          cacheLocation(newLocation);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Unable to get your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user";
              // You could set a default location here (e.g., city center)
              // const defaultLocation = { latitude: 40.7128, longitude: -74.0060 }; // NYC
              // setLocation(defaultLocation);
              // cacheLocation(defaultLocation);
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }

          setError(errorMessage);
          setLoading(false);
        },
        options
      );
    };

    // Check for cached location first
    const cachedLocation = getCachedLocation();
    if (cachedLocation) {
      setLocation(cachedLocation);
      setLoading(false);
      // Still get fresh location in background
      getCurrentLocation(false);
      return;
    }

    getCurrentLocation();
  }, []);

  const refreshLocation = () => {
    setLoading(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0, // Force fresh location
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);

        // Cache the new location
        try {
          const cacheData: CachedLocation = {
            location: newLocation,
            timestamp: Date.now(),
          };
          localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
          console.error("Error caching location:", error);
        }

        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Error refreshing location:", error);
        setError("Failed to refresh location");
        setLoading(false);
      },
      options
    );
  };

  return {
    location,
    setLocation,
    loading,
    error,
    refreshLocation,
  };
};
