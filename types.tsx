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
