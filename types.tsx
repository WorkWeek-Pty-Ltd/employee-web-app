export interface ValidationResponse {
  isValid: boolean;
  message: string;
}

export interface Site {
  id: string;
  name: string;
}

export interface Employee {
  employee_id: string;
  full_name: string;
}

export interface ModeSwitchProps {
  mode: "clockIn" | "clockOut";
  setMode: (mode: "clockIn" | "clockOut") => void;
}

export interface ClockEvent {
  employee_id: string;
  site_id: string;
  type: "in" | "out";
  timestamptz: string;
  latitude: number;
  longitude: number;
  accuracy_meters: number;
  selfie_data_uri: string;
}

export interface ClockLists {
  clockInList: Employee[];
  clockOutList: Employee[];
}

export interface OrgSitesInfo {
  organisation_name: string;
  sites: Array<{ id: string; name: string }>;
}
