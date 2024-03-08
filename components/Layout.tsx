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
      <header className="relative bg-primary text-white py-2 px-4 text-center text-base sm:py-4 sm:px-6 sm:text-xl flex flex-col justify-center items-center">
        {backRoute && (
          <button
            style={{ position: "absolute", left: "15px", top: "15px" }} // Adjusted to make sure the back button doesn't overlap with the vertically aligned elements
            onClick={() => router.push(backRoute)}
          >
            <img src="/back-arrow-icon.svg" alt="Back" />
          </button>
        )}
        <img src="/workweek.svg" alt="Workweek" />
        <h1 style={{ marginTop: "10px" }}>{pageTitle}</h1>
      </header>
      <main className="container mx-auto mt-4 mb-4 px-4">{children}</main>
      <footer className="bg-light-grey text-black py-2 px-4 text-center text-xs sm:py-4 sm:px-6 sm:text-sm">
        © {new Date().getFullYear()} Workweek Employee Web App
      </footer>
    </div>
  );
};

export default Layout;
