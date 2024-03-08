import {
  ClockLists,
  ClockEvent,
  OrgSitesInfo,
  ClockListsAndSiteName,
} from "@/types";
import axios from "axios";
import validateGeolocation from "./validateGeolocation"; // Import the validateCoordinates utility
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getSitesAndOrgName = async (organisationId: string) => {
  try {
    const response = await axios.post(`${apiUrl}/get-sites-and-org-name`, {
      organisationId,
    });
    console.log("Sites and organisation name fetched successfully.");
    return <OrgSitesInfo>response.data;
  } catch (error: any) {
    console.error(
      "Error fetching sites and organisation name:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

export const getClockListsAndSiteName = async (siteId: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/get-clock-lists-and-site-name`,
      { siteId }
    );
    console.log("Clock lists fetched successfully.");
    return <ClockListsAndSiteName>response.data;
  } catch (error: any) {
    console.error(
      "Error fetching clock lists:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

export const insertClockEvent = async (data: ClockEvent) => {
  if (
    !validateGeolocation(data.latitude, data.longitude, data.accuracy_meters)
  ) {
    console.error("Invalid location provided, aborting clock in operation.");
    return Promise.reject("Invalid location provided."); // Prevent clocking in with invalid coordinates
  }

  try {
    const response = await axios.post(`${apiUrl}/insert-clock-event`, data);
    console.log("Employee clocked successfully.");
    return response.data;
  } catch (error: any) {
    console.error(
      "Error clocking employee:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};
