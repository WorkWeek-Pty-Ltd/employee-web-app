import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import axios from "axios";
import { apiUrl } from "../../../config";
import Fuse from 'fuse.js';

const SitesPage = () => {
  const router = useRouter();
  const { organisationId } = router.query;
  const [sites, setSites] = useState([]);
  const [displayedSites, setDisplayedSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState("");

  useEffect(() => {
    if (organisationId) {
      axios
        .post(`${apiUrl}/getSites`, {
          organisationId: organisationId,
        })
        .then((response) => {
          console.log("Sites fetched successfully.", response.data);
          setSites(response.data);
          setDisplayedSites(response.data);
        })
        .catch((err) => {
          console.error(
            "Error fetching sites:",
            err.response ? err.response.data : err
          );
          setError("Failed to fetch sites. Please try again later.");
        });
    }
  }, [organisationId]);

  useEffect(() => {
    const fuse = new Fuse(sites, { keys: ["name"] });
    const results = fuse.search(searchTerm).map(({ item }) => item);
    setDisplayedSites(searchTerm ? results : sites);
  }, [searchTerm, sites]);

  const handleSiteClick = (siteId) => {
    router.push(`/organisation/${organisationId}/site/${siteId}`);
  };

  return (
    <Layout pageTitle="Sites">
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mt-5">Sites</h1>
        <input
          type="text"
          placeholder="Search sites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        {error && <p className="text-red-500">{error}</p>}
        <ul className="mt-5">
          {displayedSites.map((site) => (
            <li
              key={site.id}
              className="cursor-pointer hover:bg-gray-100 p-2"
              onClick={() => handleSiteClick(site.id)}
            >
              {site.name}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default SitesPage;
