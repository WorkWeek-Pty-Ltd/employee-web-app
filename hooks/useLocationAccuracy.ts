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
      setGeolocation((currentGeo) => {
        // Only update state if the new accuracy is better (less) than the current or if no accuracy is set yet
        if (
          currentGeo.accuracy === null ||
          position.coords.accuracy < currentGeo.accuracy
        ) {
          return {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: Math.round(position.coords.accuracy),
            error: null,
          };
        }
        return currentGeo;
      });

      // If accuracy is less than 500, stop tracking
      if (Math.round(position.coords.accuracy) < 500) {
        navigator.geolocation.clearWatch(watchId);
        console.log("Desired accuracy achieved, stopping location tracking.");
      }
    };

    const onError = (error: GeolocationPositionError) => {
      console.error("Error tracking location:", error.message);
      setGeolocation((geo) => ({ ...geo, error: error.message }));
    };

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 5000,
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
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
        console.log("Location tracking stopped.");
      }
    };
  }, []);

  return geolocation;
};
