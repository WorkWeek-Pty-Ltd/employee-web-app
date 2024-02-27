import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import axios from "axios";
import { apiUrl } from "../../config"; // Ensure this import path matches your project structure

const SitesPage = () => {
  const router = useRouter();
  const { organisationId } = router.query;
  const [sites, setSites] = useState([]);
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

  const handleSiteClick = (siteId) => {
    router.push(`/${organisationId}/sites/${siteId}`);
  };

  return (
    <Layout pageTitle="Sites">
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mt-5">Sites</h1>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="mt-5">
          {sites.map((site) => (
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
