import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import axios from 'axios';
import Fuse from 'fuse.js'; // Import Fuse.js for search functionality
import { apiUrl } from '../config';

const Home = () => {
  const router = useRouter();
  const organisationId = router.query.organisationId;
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]); // State to manage filtered sites
  const [searchTerm, setSearchTerm] = useState(''); // State to manage the search term
  const [error, setError] = useState('');

  useEffect(() => {
    if (!organisationId) return;
    axios.post(`${apiUrl}/getSites`, {
      organisationId
    })
    .then(response => {
      console.log('Sites fetched successfully.', response.data);
      setSites(response.data);
      setFilteredSites(response.data); // Initialize filteredSites with all sites initially
    })
    .catch(err => {
      console.error('Failed to fetch sites:', err.response ? err.response.data : err);
      setError('Failed to fetch sites. Please try again later.');
    });
  }, [organisationId]);

  useEffect(() => {
    const options = {
      keys: ['name']
    };
    const fuse = new Fuse(sites, options);
    const result = fuse.search(searchTerm).map(({item}) => item);

    setFilteredSites(searchTerm ? result : sites);
  }, [searchTerm, sites]);

  const handleSiteClick = (siteId) => {
    router.push(`/${organisationId}/sites/${siteId}`);
  };

  return (
    <Layout pageTitle="Welcome">
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mt-5">
          Welcome to the Workweek Employee Web App
        </h1>
        <h3 className="mt-5">
          Please select a site:
        </h3>
        <input 
          type="search" 
          className="border p-2 w-full mb-4" 
          placeholder="Search for a site..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm based on user input
        />
        {error && <p className="text-red-500">{error}</p>}
        <ul className="mt-5">
          {filteredSites.map((site) => (
            <li key={site.id} className="cursor-pointer hover:bg-gray-100 p-2" onClick={() => handleSiteClick(site.id)}>
              {site.name}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Home;