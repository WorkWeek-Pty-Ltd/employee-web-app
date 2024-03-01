import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // INPUT_REQUIRED {Set the API base URL in your environment variables}

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
  try {
    const response = await axios.post(`${apiUrl}/clockOutEmployee`, data);
    console.log('Employee clocked out successfully.');
    return response.data;
  } catch (error) {
    console.error('Error clocking out employee:', error.response ? error.response.data : error);
    throw error;
  }
};