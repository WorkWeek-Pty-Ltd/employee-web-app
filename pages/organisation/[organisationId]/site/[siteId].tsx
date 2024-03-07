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
import { Employee } from "@/types";
import { ModeSwitchProps } from "@/types";

const SiteDetailPage = () => {
  const router = useRouter();
  const { organisationId, siteId } = router.query;
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<ModeSwitchProps["mode"]>("clockIn");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isNotificationSuccess, setIsNotificationSuccess] = useState(true);
  const { latitude, longitude, accuracy } = useLocationAccuracy();

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
        setAllEmployees(response);
      } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "response" in err) {
          const error = err as { response: { data: any } };
          console.error("Failed to clock employee:", error.response.data);
        } else {
          console.error("Failed to clock employee:", err);
        }
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
        type: mode === "clockIn" ? "in" : "out",
        site_id: siteId as string,
        employee_id: selectedEmployee,
        timestamptz: new Date().toISOString(),
        latitude: latitude as number,
        longitude: longitude as number,
        accuracy_meters: accuracy as number,
        selfie_data_uri: data.image,
      };

      const response =
        mode === "clockIn"
          ? clockInEmployee(payload)
          : clockOutEmployee(payload);
      console.log(`Employee successful ${mode}.`, response);
      setIsModalOpen(false);
      setError("");
      // Optimistically remove the employee from the list upon clock submission.
      setEmployees((prev) =>
        prev.filter((emp) => emp.employee_id !== selectedEmployee)
      );
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const error = err as { response: { data: any } };
        console.error("Failed to clock employee:", error.response.data);
      } else {
        console.error("Failed to clock employee:", err);
      }
      setEmployees(allEmployees);
      setError(`Failed to ${mode}. Please try again.`);
      setNotificationMessage("Failure");
      setIsNotificationSuccess(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <Layout pageTitle="Site Details">
      {!isModalOpen && (
        <>
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
        </>
      )}
      <ClockModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(data) => handleClock(mode, { image: data.image })}
        onOptimisticUIUpdate={(employeeId) => {
          // Optimistically update the UI before the submission
          console.log(
            `Optimistically updating UI for employee ID: ${employeeId}`
          );
          setEmployees((prev) =>
            prev.filter((emp) => emp.employee_id !== employeeId)
          );
        }}
        selectedEmployee={selectedEmployee}
        mode={mode as ModeSwitchProps["mode"]}
        latitude={latitude || 0}
        longitude={longitude || 0}
        accuracy={accuracy || 0}
      />
      {showNotification && (
        <NotificationBanner
          notification={{
            message: notificationMessage,
            isSuccess: isNotificationSuccess,
            isVisible: showNotification,
          }}
        />
      )}
    </Layout>
  );
};

export default SiteDetailPage;
