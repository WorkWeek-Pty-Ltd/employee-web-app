import router from "next/router";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  backRoute?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  pageTitle = "Page Title",
  backRoute,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="relative bg-dark-blue text-white py-2 px-4 text-center text-base sm:py-4 sm:px-6 sm:text-xl flex justify-center items-center">
        {backRoute && (
          <button
            style={{ position: "absolute", left: "15px" }}
            onClick={() => router.push(backRoute)}
          >
            {/* Replace with your actual back arrow icon */}
            <img src="/back-arrow-icon.svg" alt="Back" />
          </button>
        )}
        <h1>{pageTitle}</h1>
      </header>
      <main className="flex-grow container mt-4 mb-4">{children}</main>
      <footer className="bg-light-grey text-black py-2 px-4 text-center text-xs sm:py-4 sm:px-6 sm:text-sm">
        © {new Date().getFullYear()} Workweek Employee Web App
      </footer>
    </div>
  );
};

export default Layout;
