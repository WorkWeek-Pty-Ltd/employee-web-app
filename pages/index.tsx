import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const { organisationId } = router.query;
    if (organisationId) {
      router.push(`/organisation/${organisationId}`);
    }
  }, [router]);

  return (
    <Layout pageTitle="Welcome">
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mt-5">
          Welcome to the Workweek Employee Web App
        </h1>
        <h3 className="mt-5">
          Please select an organisation:
        </h3>
        <p className="text-center mt-5">Redirecting to your organisation...</p>
      </div>
    </Layout>
  );
};

export default Home;