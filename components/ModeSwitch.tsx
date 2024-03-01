import React from 'react';

interface ModeSwitchProps {
  mode: 'clockIn' | 'clockOut';
  setMode: (mode: 'clockIn' | 'clockOut') => void;
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, setMode }) => {
  console.log(`Rendering ModeSwitch with current mode: ${mode}`);

  const handleModeChange = (newMode: 'clockIn' | 'clockOut') => {
    try {
      setMode(newMode);
      console.log(`Mode changed to: ${newMode}`);
    } catch (error) {
      console.error('Error changing mode in ModeSwitch:', error);
    }
  };

  return (
    <div className="flex gap-4 mb-4">
      <button
        className={`px-4 py-2 ${
          mode === 'clockIn' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        onClick={() => handleModeChange('clockIn')}
      >
        Clock In
      </button>
      <button
        className={`px-4 py-2 ${
          mode === 'clockOut' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        onClick={() => handleModeChange('clockOut')}
      >
        Clock Out
      </button>
    </div>
  );
};

export default ModeSwitch;