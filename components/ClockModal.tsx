import React, { useState } from "react";
import { useCamera } from "../hooks/useCamera";

interface ClockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    latitude: number;
    longitude: number;
    accuracy: number;
    image: string;
    locationWarning?: boolean; // Add optional locationWarning flag
  }) => void;
  mode: "clockIn" | "clockOut";
  latitude: number;
  longitude: number;
  accuracy: number;
}

const ClockModal: React.FC<ClockModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  latitude,
  longitude,
  accuracy,
}) => {
  const { image, captureImage: originalCaptureImage, error: cameraError, videoRef } = useCamera(isOpen);
  const [showProceedAnyway, setShowProceedAnyway] = useState(false); // State to control the visibility of the 'Proceed Anyway' button

  const handleSubmit = (forceSubmit = false) => {
    if (latitude && longitude && (accuracy <= 500 || forceSubmit) && image) {
      console.log(`Submitting ${mode} with geolocation data and accuracy of ${accuracy} meters.`);
      onSubmit({ latitude, longitude, accuracy, image, locationWarning: accuracy > 500 });
      setShowProceedAnyway(false); // Reset the state to hide 'Proceed Anyway' button after submission
      onClose();
    } else if (!forceSubmit) {
      console.error("Location accuracy is not within the required range.");
      setShowProceedAnyway(true); // Show the 'Proceed Anyway' button if location accuracy check fails
    } else {
      console.error("Missing data for submission");
    }
  };

  const captureImage = () => {
    originalCaptureImage();
    setShowProceedAnyway(false); // Reset the 'Proceed Anyway' visibility when a new selfie is taken
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
            {showProceedAnyway && (
              <p className="text-red-500 mt-2">
                Your location accuracy is not within 500 meters. You can wait for a better signal or proceed with a note of inaccuracy.
              </p>
            )}
          </div>
          {cameraError && <p className="text-red-500">{cameraError}</p>}
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              disabled={!image || !latitude || !longitude}
              onClick={() => handleSubmit()}
            >
              {`Confirm ${mode}`}
            </button>
            {showProceedAnyway && (
              <button
                id="proceed-anyway-btn"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => handleSubmit(true)}
              >
                Proceed Anyway
              </button>
            )}
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