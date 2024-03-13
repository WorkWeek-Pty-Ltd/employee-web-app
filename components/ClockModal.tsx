import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useCamera } from "../hooks/useCamera";
import validateGeolocation from "../utils/validateGeolocation";
import { Employee, ValidationResponse } from "../types";
import spinnerStyles from "../styles/Spinner.module.css";

interface ClockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    latitude: number;
    longitude: number;
    accuracy: number;
    image: string;
  }) => void;
  selectedEmployee: Employee | null;
  mode: "clockIn" | "clockOut";
  latitude: number;
  longitude: number;
  accuracy: number;
}

const ClockModal: React.FC<ClockModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedEmployee,
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
    resetImage,
    streamIsReady,
  } = useCamera(isOpen);

  const [selfieTaken, setSelfieTaken] = useState<boolean>(false);
  const [locationValidationResult, setLocationValidationResult] =
    useState<ValidationResponse>({ isValid: true, message: "" });
  const [submissionIsLoading, setSubmissionIsLoading] = useState(false);

  useEffect(() => {
    const validationResult = validateGeolocation(latitude, longitude, accuracy);
    setLocationValidationResult(validationResult);
  }, [latitude, longitude, accuracy]);

  useEffect(() => {
    setSelfieTaken(false);
  }, [isOpen]);

  const handleCloseModal = () => {
    resetImage();
    setSelfieTaken(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (image && locationValidationResult.isValid && selectedEmployee) {
      try {
        setSubmissionIsLoading(true);
        await onSubmit({
          latitude,
          longitude,
          accuracy,
          image,
        });
        setSubmissionIsLoading(false);
        console.log("Submitting clock-in/out data");
        resetImage();
        setSelfieTaken(false);
        onClose();
      } catch (error) {
        console.error("Failed to submit clock in/out data:", error);
      }
    } else {
      console.error("Missing data for submission");
    }
  };

  const captureImage = () => {
    originalCaptureImage();
    setSelfieTaken(true);
  };

  if (!isOpen) return null;
  return (
    <div>
      <Transition show={isOpen}>
        <Dialog
          open={isOpen}
          onClose={handleCloseModal}
          className="fixed inset-0 z-40 overflow-y-auto"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-5 border w-full max-w-sm mx-4 sm:max-w-md lg:max-w-lg bg-white dark:bg-gray-800 shadow-lg rounded-md">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">{`${
                  mode == "clockIn" ? "Clock In" : "Clock Out"
                } "${selectedEmployee?.full_name}"`}</h3>
                <div className="mt-2">
                  <p className="text-sm pb-2 text-gray-500 dark:text-gray-400">
                    Capture your selfie and location
                  </p>
                  {!selfieTaken && (
                    <>
                      <video ref={videoRef} className="w-full" autoPlay></video>
                      <button
                        onClick={captureImage}
                        className="p-2 mt-3 px-4 py-2 bg-blue-400 dark:bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500"
                        disabled={!streamIsReady}
                      >
                        Capture Selfie
                      </button>
                    </>
                  )}
                  {selfieTaken && !locationValidationResult.isValid && (
                    <p className="text-red-500 dark:text-red-400 mt-2">
                      {locationValidationResult.message}
                    </p>
                  )}
                  {selfieTaken && (
                    <img
                      src={image}
                      alt="Selfie preview"
                      className="mt-4 mx-auto"
                    />
                  )}
                </div>
                {cameraError && (
                  <p className="text-red-500 dark:text-red-400">
                    {cameraError}
                  </p>
                )}
                <div className="items-center px-4 py-3">
                  {selfieTaken && (
                    <button
                      id="ok-btn"
                      className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-500"
                      disabled={
                        !selfieTaken ||
                        !locationValidationResult.isValid ||
                        submissionIsLoading
                      }
                      onClick={handleSubmit}
                    >
                      {`Confirm ${
                        mode == "clockIn" ? "Clock In" : "Clock Out"
                      }`}
                    </button>
                  )}
                  <button
                    id="close-btn"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 dark:bg-red-700 text-base font-medium text-white hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-red-600"
                    onClick={handleCloseModal}
                    disabled={submissionIsLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition show={submissionIsLoading}>
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className={spinnerStyles.spinner}></div>
          <div className="text-white text-lg font-medium">
            {`${mode == "clockIn" ? "Clock In" : "Clock Out"} in progress...`}
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default ClockModal;
