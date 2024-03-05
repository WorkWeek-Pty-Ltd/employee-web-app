import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "next/navigation";
import Layout from "../components/Layout";

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const organisationId = searchParams.get("organisationId");
    if (organisationId) {
      navigate(`/organisation/${organisationId}`).catch((error) => {
        console.error("Failed to redirect to organisation page:", error);
      });
    }
  }, [searchParams, navigate]);

  return (
    <Layout pageTitle="No Organisation Id">
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mt-5">
          Welcome to the Workweek Employee Web App
        </h1>
        <h3 className="mt-5">
          No organisation ID found. Please use the link provided by your
          employer.
        </h3>
      </div>
    </Layout>
  );
};

export default Home;