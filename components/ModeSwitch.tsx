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
          className={`w-full rounded-lg py-2 text-sm font-medium leading-5 transition-colors duration-5 ${
            mode === "clockIn" ? "tabs text-white" : "bg-white text-black"
          }`}
          onClick={() => handleModeChange("clockIn")}
        >
          Clock In
        </Tab>
        <Tab
          className={`w-full rounded-lg py-2 text-sm font-medium leading-5 transition-colors duration-5 ${
            mode === "clockOut" ? "tabs text-white" : "bg-white text-black"
          }`}
          onClick={() => handleModeChange("clockOut")}
        >
          Clock Out
        </Tab>
      </Tab.List>
    </Tab.Group>
  );
};

export default ModeSwitch;
