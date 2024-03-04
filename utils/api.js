import axios from 'axios';
import validateGeolocation from './validateGeolocation'; // Import the validateCoordinates utility
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getSites = async (organisationId) => {
  try {
    const response = await axios.post(`${apiUrl}/getSites`, { organisationId });
    console.log('Sites fetched successfully.');
    return response.data;
  } catch (error) {
    console.error('Error fetching sites:', error.response ? error.response.data : error);
    throw error;
  }
};

export const getClockInList = async (siteId) => {
  try {
    const response = await axios.post(`${apiUrl}/getClockInList`, { siteId });
    console.log('Clock in list fetched successfully.');
    return response.data;
  } catch (error) {
    console.error('Error fetching clock in list:', error.response ? error.response.data : error);
    throw error;
  }
};

export const getClockOutList = async (siteId) => {
  try {
    const response = await axios.post(`${apiUrl}/getClockOutList`, { siteId });
    console.log('Clock out list fetched successfully.');
    return response.data;
  } catch (error) {
    console.error('Error fetching clock out list:', error.response ? error.response.data : error);
    throw error;
  }
};

export const clockInEmployee = async (data) => {
  if (!validateGeolocation(data.latitude, data.longitude)) {
    console.error('Invalid coordinates provided, aborting clock in operation.');
    return Promise.reject('Invalid coordinates provided.'); // Prevent clocking in with invalid coordinates
  }

  try {
    const response = await axios.post(`${apiUrl}/clockInEmployee`, data);
    console.log('Employee clocked in successfully.');
    return response.data;
  } catch (error) {
    console.error('Error clocking in employee:', error.response ? error.response.data : error);
    throw error;
  }
};

export const clockOutEmployee = async (data) => {
  if (!validateGeolocation(data.latitude, data.longitude)) {
    console.error('Invalid coordinates provided, aborting clock out operation.');
    return Promise.reject('Invalid coordinates provided.'); // Prevent clocking out with invalid coordinates
  }

  try {
    const response = await axios.post(`${apiUrl}/clockOutEmployee`, data);
    console.log('Employee clocked out successfully.');
    return response.data;
  } catch (error) {
    console.error('Error clocking out employee:', error.response ? error.response.data : error);
    throw error;
  }
};