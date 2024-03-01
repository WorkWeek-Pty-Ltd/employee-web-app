import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import ClockModal from "../../../../components/ClockModal";
import NotificationBanner from "../../../../components/NotificationBanner";
import EmployeeList from "../../../../components/EmployeeList";
import {
  getClockInList,
  getClockOutList,
  clockInEmployee,
  clockOutEmployee,
} from "../../../../utils/api";
import ModeSwitch from "../../../../components/ModeSwitch";
import SiteHeader from "../../../../components/SiteHeader";
import { useLocationAccuracy } from "../../../../hooks/useLocationAccuracy";

const SiteDetailPage = () => {
  const router = useRouter();
  const { organisationId, siteId } = router.query;
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("clockIn");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isNotificationSuccess, setIsNotificationSuccess] = useState(true);
  const { latitude, longitude, accuracy } = useLocationAccuracy(); // Destructure the needed values

  useEffect(() => {
    if (!organisationId || !siteId) {
      console.log("Missing organisation ID or site ID");
      return;
    }
    const fetchEmployees = async () => {
      try {
        const response =
          mode === "clockIn"
            ? await getClockInList(siteId)
            : await getClockOutList(siteId);
        console.log(`${mode} list fetched successfully.`, response);
        setEmployees(response);
      } catch (err) {
        console.error(
          "Failed to fetch data:",
          err.response ? err.response.data : err
        );
        setError("Failed to fetch data. Please try again later.");
      }
    };
    fetchEmployees();
  }, [organisationId, siteId, mode]);

  const handleOpenModal = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClock = async (
    mode: "clockIn" | "clockOut",
    data: {
      image: string;
    }
  ) => {
    if (!selectedEmployee) {
      console.error("No employee selected for clocking.");
      return;
    }
    try {
      const payload = {
        siteId: siteId as string,
        employeeId: selectedEmployee,
        timestamptz: new Date().toISOString(),
        latitude: latitude as number,
        longitude: longitude as number,
        accuracy: accuracy as number,
        base64Image: data.image,
        mimeType: "image/png", // Assuming PNG format for simplicity
      };

      const response =
        mode === "clockIn"
          ? await clockInEmployee(payload)
          : await clockOutEmployee(payload);
      console.log(`Employee successfully clocked ${mode}.`, response);
      setIsModalOpen(false);
      setError("");
      setNotificationMessage("Success");
      setIsNotificationSuccess(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      setEmployees((prev) =>
        prev.filter((emp) => emp.employee_id !== selectedEmployee)
      );
    } catch (err) {
      console.error(
        "Failed to clock employee:",
        err.response ? err.response.data : err
      );
      setError(`Failed to clock ${mode}. Please try again.`);
      setNotificationMessage("Failure");
      setIsNotificationSuccess(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <Layout pageTitle="Site Details">
      <div className="container mx-auto p-4">
        <SiteHeader organisationId={organisationId as string} />
        <ModeSwitch mode={mode} setMode={setMode} />
        <input
          type="search"
          className="border p-2 w-full mb-4"
          placeholder="Search for an employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <EmployeeList
          employees={employees}
          searchTerm={searchTerm}
          onSelectEmployee={handleOpenModal}
        />
      </div>
      {showNotification && (
        <NotificationBanner
          notification={{
            message: notificationMessage,
            isSuccess: isNotificationSuccess,
            isVisible: showNotification,
          }}
        />
      )}
      <ClockModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(data) => handleClock(mode, { image: data.image })}
        mode={mode as "clockIn" | "clockOut"}
        latitude={latitude}
        longitude={longitude}
        accuracy={accuracy}
      />
    </Layout>
  );
};

export default SiteDetailPage;