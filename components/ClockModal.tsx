import React, { useState, useEffect } from "react";
import { useCamera } from "../hooks/useCamera";
import validateGeolocation from "../utils/validateGeolocation";
import { ValidationResponse } from "../types";

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
  const {
    image,
    captureImage: originalCaptureImage,
    error: cameraError,
    videoRef,
  } = useCamera(isOpen);

  const [locationValidationResult, setLocationValidationResult] =
    useState<ValidationResponse>({
      isValid: true,
      message: "",
    });

  useEffect(() => {
    const validationResult = validateGeolocation(latitude, longitude, accuracy);
    setLocationValidationResult(validationResult);
  }, [latitude, longitude, accuracy]);

  const handleSubmit = () => {
    if (image && locationValidationResult.isValid) {
      console.log(
        `Submitting ${mode} with geolocation data and accuracy of ${accuracy} meters.`
      );
      onSubmit({
        latitude,
        longitude,
        accuracy,
        image,
      });
      onClose();
    } else {
      console.error("Missing data for submission");
    }
  };

  const captureImage = () => {
    originalCaptureImage();
  };

  if (!isOpen) return null;

  // TODO use the fancy new next image thing
  // "Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-elementeslint@next/next/no-img-element"

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
            {locationValidationResult.message && (
              <p className="text-red-500 mt-2">
                {locationValidationResult.message}
              </p>
            )}
            {image && (
              <img src={image} alt="Selfie preview" className="mt-4 mx-auto" />
            )}
          </div>
          {cameraError && <p className="text-red-500">{cameraError}</p>}
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              disabled={!image || !locationValidationResult.isValid}
              onClick={() => handleSubmit()}
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
