import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string; // This will be dynamically filled later
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle = 'Page Title' }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-dark-blue text-white py-4 px-6 text-xl">
        {pageTitle}
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-light-grey text-black py-4 px-6 text-center">
        © {new Date().getFullYear()} Workweek Employee Web App
      </footer>
    </div>
  );
};

export default Layout;