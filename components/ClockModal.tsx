import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

interface ClockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClock: (data: {
    latitude: number;
    longitude: number;
    accuracy: number;
    image: string;
  }) => void;
  mode: "clockIn" | "clockOut";
  siteId: string;
  employeeId: string;
}

const ClockModal: React.FC<ClockModalProps> = ({
  isOpen,
  onClose,
  onClock,
  mode,
  siteId,
  employeeId,
}) => {
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const captureImage = () => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      canvas
        .getContext("2d")!
        .drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");
      setImage(imageDataUrl);
    }
  };

  useEffect(() => {
    if (isOpen) {
      requestPermissionsAndCapture();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const requestPermissionsAndCapture = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
          };
        }
      })
      .catch((err) => {
        console.error("Error accessing the camera:", err);
        setError(
          "Error accessing the camera. Please ensure you have given the necessary permissions."
        );
      });
  };

  const performClockAction = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const data = {
          latitude: Math.round(position.coords.latitude),
          longitude: Math.round(position.coords.longitude),
          accuracy: Math.round(position.coords.accuracy), // Updated line for accuracy rounding
          base64Image: image,
          mimeType: "image/png",
        };

        const endpoint =
          mode === "clockIn" ? "clockInEmployee" : "clockOutEmployee";
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
            siteId: siteId,
            employeeId: employeeId,
            timestamptz: new Date().toISOString(),
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.accuracy,
            base64Image: data.base64Image, // Change 'image' to 'base64Image'
            mimeType: data.mimeType, // Add 'mimeType' property
          });
          console.log(`Employee successfully clocked ${mode}.`);
          onClose();
          onClock({
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.accuracy,
            image: data.base64Image, // Add 'image' property
          });
        } catch (err) {
          console.error(`Failed to clock ${mode}:`, err);
          setError(`Failed to clock ${mode}. Please try again.`);
        }
      },
      () => {
        console.error("Unable to retrieve your location");
        setError("Unable to retrieve your location");
      }
    );
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
          {error && <p className="text-red-500">{error}</p>}
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              disabled={!image}
              onClick={performClockAction}
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
