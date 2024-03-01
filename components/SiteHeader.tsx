import React from 'react';
import Link from 'next/link';

interface SiteHeaderProps {
  organisationId: string;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ organisationId }) => {
  return (
    <div className="mb-4">
      <Link
        href={`/organisation/${organisationId}`}
        className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out"
      >
        ← Back to Sites
      </Link>
    </div>
  );
};

export default SiteHeader;