import React, { useEffect, useState } from 'react';

const GeolocationComponent = () => {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      setError('Geolocation is not supported by your browser');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        console.log('Geolocation permissions granted');
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.error('Error obtaining geolocation', err.message);
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (position.latitude && position.longitude) {
    return (
      <div>
        <p>Latitude: {position.latitude}</p>
        <p>Longitude: {position.longitude}</p>
      </div>
    );
  }

  return <p>Fetching location...</p>;
};

export default GeolocationComponent;