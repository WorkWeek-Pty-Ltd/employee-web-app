import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { getSitesAndOrgName } from "../../../utils/api";
import Fuse from "fuse.js";
import { Site } from "../../../types";
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import styles from "../../../styles/SearchAndList.module.css";

const SitesPage = () => {
  const router = useRouter();
  const { organisationId } = router.query;
  const [sites, setSites] = useState<Site[]>([]);
  const [displayedSites, setDisplayedSites] = useState<Site[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [organisationName, setOrganisationName] = useState("");

  useEffect(() => {
    const orgId = typeof organisationId === "string" ? organisationId : "";
    if (orgId) {
      getSitesAndOrgName(orgId)
        .then((response) => {
          console.log("Sites fetched successfully.", response);
          setSites(response.sites);
          setDisplayedSites(response.sites);
          setOrganisationName(response.organisation_name);
        })
        .catch((err) => {
          console.error(
            "Error fetching sites:",
            err.response ? err.response.data : err
          );
          setError("Failed to fetch sites.");
        });
    }
  }, [organisationId]);

  useEffect(() => {
    const fuse = new Fuse(sites, { keys: ["name"] });
    const results = fuse.search(searchTerm).map(({ item }) => item);
    setDisplayedSites(searchTerm ? results : sites);
  }, [searchTerm, sites]);
  const handleSiteClick = (siteId: string) => {
    router.push(`/organisation/${organisationId}/site/${siteId}`);
  };

  return (
    <Layout pageTitle={organisationName}>
      <div className="container mx-auto px-4 pb-4">
        <div className="bg-white px-4 py-2 rounded-lg flex items-center mb-4 border-orange-300 border">
          <span className="text-gray-500 mr-2">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search sites"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${styles.searchBar} ${styles.searchInput}`}
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div>
          {displayedSites.map((site) => (
            <button
              key={site.id}
              onClick={() => handleSiteClick(site.id)}
              className={styles.listItem}
            >
              <span className="text-gray-800 font-semibold">{site.name}</span>
              <span className="text-gray-500">
                <ChevronRightIcon className="h-5 w-5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SitesPage;
