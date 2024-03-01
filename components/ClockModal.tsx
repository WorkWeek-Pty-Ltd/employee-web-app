import React, { useRef } from "react";
import { useCamera } from "../hooks/useCamera";
import { useGeolocation } from "../hooks/useGeolocation";

interface ClockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    latitude: number;
    longitude: number;
    accuracy: number;
    image: string;
  }) => void;
  mode: "clockIn" | "clockOut";
}

const ClockModal: React.FC<ClockModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
}) => {
  const { image, captureImage, error: cameraError, videoRef } = useCamera(isOpen);
  const { latitude, longitude, accuracy, error: geoError } = useGeolocation();

  const handleSubmit = () => {
    if (latitude && longitude && accuracy && image) {
      onSubmit({ latitude, longitude, accuracy, image });
      onClose();
    } else {
      console.error("Missing data for submission");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative p-5 border w-full max-w-sm mx-4 sm:max-w-md lg:max-w-lg bg-white shadow-lg rounded-md">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{`Please ${mode}`}</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Capture your selfie and location
            </p>
            <video ref={videoRef} className="w-full" autoPlay></video>
            <button
              onClick={captureImage}
              className="mt-3 bg-blue-500 text-white p-2 rounded"
            >
              {image ? "Retake Selfie" : "Capture Selfie"}
            </button>
            {image && (
              <img src={image} alt="Selfie preview" className="mt-4 mx-auto" />
            )}
          </div>
          {(cameraError || geoError) && <p className="text-red-500">{cameraError || geoError}</p>}
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              disabled={!image || !latitude || !longitude || !accuracy}
              onClick={handleSubmit}
            >
              {`Confirm ${mode}`}
            </button>
            <button
              id="close-btn"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClockModal;