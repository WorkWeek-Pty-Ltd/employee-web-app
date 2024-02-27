import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import axios from "axios";
import Fuse from "fuse.js";

const SiteDetailPage = () => {
  const router = useRouter();
  const { organisationId, siteId } = router.query; // Corrected to include organisationId in the URL parameters
  const [employees, setEmployees] = useState([]);
  const [displayedEmployees, setDisplayedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("clockIn"); // 'clockIn' or 'clockOut'

  useEffect(() => {
    if (!organisationId || !siteId) {
      console.log("Missing organisation ID or site ID");
      return;
    }
    const endpoint = mode === "clockIn" ? "getClockInList" : "getClockOutList";
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/functions/v1/${endpoint}`, {
        siteId,
      })
      .then((response) => {
        console.log(`${mode} list fetched successfully.`, response.data);
        setEmployees(response.data);
        setDisplayedEmployees(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data. Please try again later.");
      });
  }, [organisationId, siteId, mode]);

  useEffect(() => {
    const options = { keys: ["full_name"] };
    const fuse = new Fuse(employees, options);
    const result = fuse.search(searchTerm).map(({ item }) => item);

    setDisplayedEmployees(searchTerm ? result : employees);
  }, [searchTerm, employees]);

  return (
    <Layout pageTitle="Site Details">
      <div className="container mx-auto p-4">
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 ${
              mode === "clockIn" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("clockIn")}
          >
            Clock In
          </button>
          <button
            className={`px-4 py-2 ${
              mode === "clockOut" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("clockOut")}
          >
            Clock Out
          </button>
        </div>
        <input
          type="search"
          className="border p-2 w-full mb-4"
          placeholder="Search for an employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <ul>
          {displayedEmployees.map((employee) => (
            <li
              key={employee.employee_id}
              className="cursor-pointer hover:bg-gray-100 p-2"
            >
              {employee.full_name}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default SiteDetailPage;
