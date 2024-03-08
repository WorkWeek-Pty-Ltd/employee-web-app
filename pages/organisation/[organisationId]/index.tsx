import { GetServerSideProps } from "next";
import Layout from "../../../components/Layout";
import { getSitesAndOrgName } from "../../../utils/api";
import Fuse from "fuse.js";
import { Site } from "../../../types";
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import styles from "../../../styles/SearchAndList.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

interface SitesPageProps {
  sites: Site[];
  organisationName: string;
  error: string | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { organisationId } = context.params || {};

  if (!organisationId || typeof organisationId !== "string") {
    return {
      props: {
        sites: [],
        organisationName: "",
        error: "Invalid organisation ID",
      },
    };
  }

  try {
    const data = await getSitesAndOrgName(organisationId);
    return {
      props: {
        sites: data.sites,
        organisationName: data.organisation_name,
        error: null,
      },
    };
  } catch (error) {
    console.error("Failed to fetch data for organisation:", error);
    return {
      props: {
        sites: [],
        organisationName: "",
        error: "Failed to fetch sites.",
      },
    };
  }
};

const SitesPage: React.FC<SitesPageProps> = ({
  sites,
  organisationName,
  error,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedSites, setDisplayedSites] = useState<Site[]>(sites);

  const handleSiteClick = (siteId: string) => {
    router.push(`/organisation/${router.query.organisationId}/site/${siteId}`);
  };

  if (error) {
    return (
      <Layout pageTitle="Organisation not Found">
        <div className="container mx-auto p-4 flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-xl font-bold">An error occurred</h1>
            <p className="text-gray-500">
              The link you followed may be incorrect
            </p>
            <p className="mt-5 text-red-300">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              const fuse = new Fuse(sites, { keys: ["name"] });
              const results = fuse
                .search(e.target.value)
                .map(({ item }) => item);
              setDisplayedSites(e.target.value ? results : sites);
            }}
            className={`${styles.searchBar} ${styles.searchInput}`}
          />
        </div>
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
