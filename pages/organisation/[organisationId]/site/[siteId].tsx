import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import axios from "axios";
import Fuse from "fuse.js";
import ClockModal from "../../../../components/ClockModal";
import Link from "next/link";

const SiteDetailPage = () => {
  const router = useRouter();
  const { organisationId, siteId } = router.query;
  const [employees, setEmployees] = useState([]);
  const [displayedEmployees, setDisplayedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("clockIn");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  interface Employee {
    employee_id: string;
    full_name: string;
    // Add any other properties here
  }

  useEffect(() => {
    if (!organisationId || !siteId) {
      console.log("Missing organisation ID or site ID");
      return;
    }
    const endpoint = mode === "clockIn" ? "getClockInList" : "getClockOutList";
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
        siteId,
      })
      .then((response) => {
        console.log(`${mode} list fetched successfully.`, response.data);
        setEmployees(response.data);
        setDisplayedEmployees(response.data);
      })
      .catch((err) => {
        console.error(
          "Failed to fetch data:",
          err.response ? err.response.data : err
        );
        setError("Failed to fetch data. Please try again later.");
      });
  }, [organisationId, siteId, mode]);

  useEffect(() => {
    if (!employees.length) return;

    const options = { keys: ["full_name"] };
    const fuse = new Fuse(employees, options);
    const result = fuse.search(searchTerm).map(({ item }) => item);

    setDisplayedEmployees(searchTerm ? result : employees);
  }, [searchTerm, employees]);

  const handleOpenModal = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClock = async (data: {
    latitude: number;
    longitude: number;
    accuracy: number;
    image: string;
  }) => {
    if (!selectedEmployee) {
      console.error("No employee selected for clocking.");
      return;
    }
    try {
      const endpoint =
        mode === "clockIn" ? "clockInEmployee" : "clockOutEmployee";
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
        {
          siteId,
          employeeId: selectedEmployee,
          timestamptz: new Date().toISOString(),
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
          base64Image: data.image,
          mimeType: "image/png", // Assuming PNG format for the captured image
        }
      );
      console.log(`Employee successfully clocked ${mode}.`, response.data);
      setIsModalOpen(false);
      setError("");
    } catch (err: any) {
      console.error(
        "Failed to clock employee:",
        err.response ? err.response.data : err
      );
      setError(`Failed to clock ${mode}. Please try again.`);
    }
  };

  return (
    <Layout pageTitle="Site Details">
      <div className="container mx-auto p-4">
        <Link
          href={`/organisation/${organisationId}`}
          className="inline-block mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out"
        >
          ← Back to Sites
        </Link>
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
          {displayedEmployees.map((employee: Employee) => (
            <li
              key={employee.employee_id}
              className="cursor-pointer hover:bg-gray-100 p-2"
              onClick={() => handleOpenModal(employee.employee_id)}
            >
              {employee.full_name}
            </li>
          ))}
        </ul>
      </div>
      <ClockModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onClock={handleClock}
        mode={mode as "clockIn" | "clockOut"} // Fix: Update the type of mode
      />
    </Layout>
  );
};

export default SiteDetailPage;
