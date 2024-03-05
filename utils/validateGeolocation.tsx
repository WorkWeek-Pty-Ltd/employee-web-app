import { ValidationResponse } from "../types";
import {
  MIN_GEOLOCATION_ACCURACY_THRESHOLD,
  MAX_GEOLOCATION_ACCURACY_THRESHOLD,
} from "./constants";

const validateGeolocation = (
  latitude: number,
  longitude: number,
  accuracy: number
): ValidationResponse => {
  if (latitude === 0 && longitude === 0) {
    return {
      isValid: false,
      message: `Location not found: Your phone can't find where you are. Please move a bit and try checking your location again.`,
    };
  }
  if (accuracy > MAX_GEOLOCATION_ACCURACY_THRESHOLD) {
    return {
      isValid: false,
      message: `Your location is not clear, it's off by more than ${
        accuracy / 1000
      } km. Please wait for a clearer signal or move to an open area and try again.`,
    };
  }
  if (accuracy > MIN_GEOLOCATION_ACCURACY_THRESHOLD) {
    // Here we consider the location valid but not ideal
    return {
      isValid: true, // Keep isValid as true to indicate the location is valid
      message: `Your location is valid but could be clearer. It's off by ${accuracy} meters. If possible, wait a little for a better signal or move to a better location for more accuracy.`,
    };
  }
  return {
    isValid: true,
    message: `Your location is clear. You're all set!`,
  };
};

export default validateGeolocation;
