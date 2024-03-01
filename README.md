# Workweek Employee Web App

The Workweek Employee Web App is a comprehensive solution designed to streamline and simplify the process of clocking in and out for employees across various sites. Leveraging geolocation and selfie verification, the app enhances attendance tracking and ensures a seamless user experience.

## Overview

This project utilizes Next.js for the frontend and Tailwind CSS for styling, offering a responsive and intuitive interface. Employees can clock in or out by selecting their site, taking a selfie, and allowing the app to capture their geolocation. The app communicates with backend services via RESTful API endpoints for efficient data handling and is optimized for mobile use.

## Features

- Site and employee selection for clocking in/out
- Enhanced geolocation-based verification with improved accuracy
- Selfie capture for additional security
- Fuzzy match search for quick lookups
- Mobile optimization for varied device sizes
- Real-time feedback on clocking status

## Geolocation Update

As part of our continuous effort to improve the app's accuracy and performance, we have transitioned from using our custom `useGeolocation` hook to a more efficient and accurate `useLocationAccuracy` hook for geolocation data. This ensures that the geolocation data we collect is more precise, improving the overall functionality and user experience of the clock in/out process.

## Getting started

### Requirements

- Node.js (latest stable version recommended)
- A modern web browser

### Quickstart

1. Clone the repository to your local machine.
2. Navigate to the project directory and install dependencies with `npm install`.
3. Start the development server with `npm run dev`.
4. Open your web browser and navigate to `http://localhost:3000` to view the app.

### License

Copyright (c) 2024.