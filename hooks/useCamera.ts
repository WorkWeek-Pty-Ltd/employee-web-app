import { useState, useEffect, useRef, useCallback } from "react";

export const useCamera = (isOpen: boolean) => {
  const [image, setImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamIsReady, setStreamIsReady] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">(
    "user"
  );

  const obtainVideoStream = useCallback(
    async (cameraFacingMode: "user" | "environment") => {
      if (!isOpen) {
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacingMode },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // these next 3 lines are necessary to ensure the video is played on iOS devices
          videoRef.current.autoplay = true; // Set autoplay programmatically
          videoRef.current.playsInline = true; // Ensure inline playback
          videoRef.current.muted = true; // Mute the video to allow autoplay on most browsers
          console.log("Camera stream obtained successfully.");
          setStreamIsReady(true);
        }
      } catch (err) {
        console.error("Error obtaining camera stream:", err);
        setError(
          "Error obtaining camera stream. Please ensure camera access is allowed."
        );
      }
    },
    [isOpen]
  );

  useEffect(() => {
    obtainVideoStream(cameraFacing);
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        console.log("Camera stream stopped.");
      }
      resetImage();
    };
  }, [isOpen, cameraFacing, obtainVideoStream]);

  const toggleCamera = useCallback(() => {
    setCameraFacing((prevFacing) =>
      prevFacing === "user" ? "environment" : "user"
    );
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/png");
        setImage(imageDataUrl);
        console.log("Image captured successfully.");
      } else {
        const captureError =
          "Failed to capture image due to context not being available.";
        setError(captureError);
        console.error(captureError);
      }
    } else {
      const captureError = "Video reference is null.";
      setError(captureError);
      console.error(captureError);
    }
  }, [videoRef]);

  const resetImage = useCallback(() => {
    setImage("");
    setError("");
    obtainVideoStream(cameraFacing);
    console.log("Image reset successfully.");
  }, []);

  return {
    image,
    captureImage,
    error,
    videoRef,
    resetImage,
    streamIsReady,
    toggleCamera,
  };
};
