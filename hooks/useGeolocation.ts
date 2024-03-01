import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string;
}

export const useGeolocation = () => {
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: '',
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      setGeolocation((geo) => ({ ...geo, error: 'Geolocation is not supported by your browser' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation fetched successfully.');
        setGeolocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: '',
        });
      },
      (error) => {
        console.error('Unable to retrieve your location', error);
        setGeolocation((geo) => ({ ...geo, error: 'Unable to retrieve your location' }));
      }
    );
  }, []);

  return geolocation;
};