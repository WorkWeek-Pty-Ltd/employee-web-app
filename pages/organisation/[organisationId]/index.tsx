import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import axios from "axios";
import { apiUrl } from "../../../config";

const SitePage = () => {
  const router = useRouter();
  const { organisationId } = router.query;
  const [sites, setSites] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!organisationId) {
      console.log("No organisation ID provided");
      return;
    }
    axios
      .post(`${apiUrl}/getSites`, {
        organisationId,
      })
      .then((response) => {
        console.log("Sites fetched successfully.", response.data);
        setSites(response.data);
      })
      .catch((err) => {
        console.error(
          "Failed to fetch sites:",
          err.response ? err.response.data : err
        );
        setError("Failed to fetch sites. Please try again later.");
      });
  }, [organisationId]);

  const handleSiteClick = (siteId) => {
    router.push(`/organisation/${organisationId}/site/${siteId}`);
  };

  return (
    <Layout pageTitle={`Site Details - ${organisationId}`}>
      <div className="container mx-auto p-4">
        <h2 className="text-lg font-semibold">All Sites for Organisation</h2>
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

export default SitePage;
