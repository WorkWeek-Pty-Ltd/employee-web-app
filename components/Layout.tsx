import router from "next/router";
import React from "react";
import { useState } from "react";
import spinnerStyles from "../styles/Spinner.module.css";
interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  backRoute?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  pageTitle = "WorkWeek",
  backRoute,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex flex-col min-h-screen">
      <header className="relative bg-primary text-white py-2 px-4 text-center text-base sm:py-4 sm:px-6 sm:text-xl flex flex-col justify-center items-center">
        {backRoute && (
          <button
            style={{ position: "absolute", left: "15px", top: "15px" }}
            onClick={async () => {
              setIsLoading(true);
              await router.push(backRoute);
              // setIsLoading(false); // Optionally reset loading state if needed
            }}
            disabled={isLoading} // Optional: disable button during loading
          >
            {isLoading ? (
              <div className={spinnerStyles.spinner}></div> // Show spinner when loading
            ) : (
              <img src="/back-arrow-icon.svg" alt="Back" />
            )}
          </button>
        )}
        <img src="/workweek.svg" alt="Workweek" />
        <h1 style={{ marginTop: "10px" }}>{pageTitle}</h1>
      </header>
      <main className="flex-1 container mx-auto mt-4 mb-4 px-4">
        {children}
      </main>
      <footer className="bg-light-grey text-black py-2 px-4 text-center text-xs sm:py-4 sm:px-6 sm:text-sm">
        © {new Date().getFullYear()} Workweek Employee Web App
      </footer>
    </div>
  );
};

export default Layout;
