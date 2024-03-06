import { useState, useEffect, useRef, useCallback } from 'react';

export const useCamera = (isOpen) => {
  const [image, setImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const obtainVideoStream = async () => {
      if (!isOpen) {
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('Camera stream obtained successfully.');
        }
      } catch (err) {
        console.error('Error obtaining camera stream:', err);
        setError('Error obtaining camera stream. Please ensure camera access is allowed.');
      }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      obtainVideoStream();
    } else {
      console.error('Camera access is not supported by this browser.');
      setError('Camera access is not supported by this browser.');
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        console.log('Camera stream stopped.');
      }
      resetImage(); // Reset the image after the modal is closed or the post request is completed
    };
  }, [isOpen]);

  const captureImage = useCallback(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        setImage(imageDataUrl);
        console.log('Image captured successfully.');
      } else {
        const captureError = 'Failed to capture image due to context not being available.';
        setError(captureError);
        console.error(captureError);
      }
    } else {
      const captureError = 'Video reference is null.';
      setError(captureError);
      console.error(captureError);
    }
  }, [videoRef]);

  const resetImage = () => {
    setImage('');
    console.log('Image reset successfully.');
  };

  return { image, captureImage, error, videoRef, resetImage };
};