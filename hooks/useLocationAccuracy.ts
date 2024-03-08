import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
}

export const useLocationAccuracy = () => {
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
  });

  useEffect(() => {
    let watchId: number;

    const onSuccess = (position: GeolocationPosition) => {
      console.log("Location tracking success:", position.coords);
      setGeolocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy),
        error: null,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      console.error("Error tracking location:", error.message);
      setGeolocation((geo) => ({ ...geo, error: error.message }));
    };

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 300000,
        maximumAge: 0,
      });
      console.log("Location tracking initiated.");
    } else {
      console.error("Geolocation is not supported by this browser.");
      setGeolocation((geo) => ({
        ...geo,
        error: "Geolocation is not supported by this browser.",
      }));
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        console.log("Location tracking stopped.");
      }
    };
  }, []);

  return geolocation;
};
