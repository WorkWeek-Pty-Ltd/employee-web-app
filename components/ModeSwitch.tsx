import React from "react";
import { ModeSwitchProps } from "@/types";
import { Tab } from "@headlessui/react";

const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, setMode }) => {
  console.log(`Rendering ModeSwitch with current mode: ${mode}`);

  const handleModeChange = (newMode: "clockIn" | "clockOut") => {
    try {
      setMode(newMode);
      console.log(`Mode changed to: ${newMode}`);
    } catch (error) {
      console.error("Error changing mode in ModeSwitch:", error);
    }
  };

  return (
    <Tab.Group>
      <Tab.List className="flex rounded-lg gap-0.5 mb-4">
        <Tab
          className={({ selected }) =>
            `w-full rounded-lg py-2 text-sm font-medium leading-5 transition-colors duration-15 5 mr-2 ${
              selected
                ? "bg-blue-500 text-white"
                : "bg-white text-black dark:bg-gray-700 dark:text-white"
            }`
          }
          onClick={() => handleModeChange("clockIn")}
        >
          Clock In
        </Tab>
        <Tab
          className={({ selected }) =>
            `w-full rounded-lg py-2 text-sm font-medium leading-5 transition-colors duration-15 ml-2 ${
              selected
                ? "bg-blue-500 text-white"
                : "bg-white text-black dark:bg-gray-700 dark:text-white"
            }`
          }
          onClick={() => handleModeChange("clockOut")}
        >
          Clock Out
        </Tab>
      </Tab.List>
    </Tab.Group>
  );
};

export default ModeSwitch;
