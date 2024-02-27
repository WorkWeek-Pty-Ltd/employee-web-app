import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle = 'Page Title' }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-dark-blue text-white py-2 px-4 text-center text-md sm:py-4 sm:px-6 sm:text-xl">
        {pageTitle}
      </header>
      <main className="flex-grow container mt-4 mb-4">
        {children}
      </main>
      <footer className="bg-light-grey text-black py-2 px-4 text-center text-xs sm:py-4 sm:px-6 sm:text-sm">
        © {new Date().getFullYear()} Workweek Employee Web App
      </footer>
    </div>
  );
};

export default Layout;