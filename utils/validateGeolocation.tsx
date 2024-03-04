// validateCoordinates.tsx

const validateGeolocation = (
  latitude: number,
  longitude: number,
  accuracy: number
) => {
  if (latitude === 0 && longitude === 0) {
    console.error("Invalid coordinates: Both latitude and longitude are 0.");
    return false;
  }
  if (accuracy > 500) {
    console.error("Location accuracy is above 500 meters.");
    return false;
  }
  console.log("Coordinates and accuracy validated successfully.");
  return true;
};

export default validateGeolocation;
