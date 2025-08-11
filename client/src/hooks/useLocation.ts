import { useEffect, useState } from "react";

export interface ILocation {
  latitude: number | null;
  longitude: number | null;
}

export const useLocation = () => {
  const [location, setLocation] = useState<ILocation | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not suppo rted by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  return { location, setLocation };
};
