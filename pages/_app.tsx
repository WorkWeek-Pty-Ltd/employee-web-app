// pages/_app.tsx
import "../styles/globals.css"; // Adjust the path as necessary

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
