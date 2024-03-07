import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import ClockModal from "../../../../components/ClockModal";
import NotificationBanner from "../../../../components/NotificationBanner";
import EmployeeList from "../../../../components/EmployeeList";
import {
  getClockLists,
  clockInEmployee,
  clockOutEmployee,
} from "../../../../utils/api";
import ModeSwitch from "../../../../components/ModeSwitch";
import SiteHeader from "../../../../components/SiteHeader";
import { useLocationAccuracy } from "../../../../hooks/useLocationAccuracy";
import { Employee, ModeSwitchProps, ClockEvent, ClockLists } from "@/types";

const SiteDetailPage = () => {
  const router = useRouter();
  const { organisationId, siteId } = router.query;
  const [clockLists, setClockLists] = useState<ClockLists | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<ModeSwitchProps["mode"]>("clockIn");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isNotificationSuccess, setIsNotificationSuccess] = useState(true);
  const { latitude, longitude, accuracy } = useLocationAccuracy();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!organisationId || !siteId) {
      console.log("Missing organisation ID or site ID");
      return;
    }
    const fetchEmployees = async () => {
      try {
        const response = await getClockLists(siteId as string);
        setClockLists(response);
        setIsLoading(false);
      } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "response" in err) {
          const error = err as { response: { data: any } };
          console.error("Failed to clock employee:", error.response.data);
        } else {
          console.error("Failed to clock employee:", err);
        }
        setError("Failed to fetch data. Please try again later.");
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, [organisationId, siteId]);

  const handleOpenModal = (employee: Employee) => {
    setSelectedEmployee(employee);
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
      const payload: ClockEvent = {
        type: mode === "clockIn" ? "in" : "out",
        site_id: siteId as string,
        employee_id: selectedEmployee.employee_id,
        timestamptz: new Date().toISOString(),
        latitude: latitude as number,
        longitude: longitude as number,
        accuracy_meters: accuracy as number,
        selfie_data_uri: data.image,
      };

      const response =
        mode === "clockIn"
          ? await clockInEmployee(payload)
          : await clockOutEmployee(payload);
      console.log(`Employee successful ${mode}.`, response);
      setClockLists((prev) => {
        if (!prev) {
          return null;
        }
        const updatedClockLists = { ...prev };
        const updatedEmployee = updatedClockLists[`${mode}List`].find(
          (employee: Employee) =>
            employee.employee_id === selectedEmployee.employee_id
        );
        if (updatedEmployee) {
          updatedClockLists[`${mode}List`] = updatedClockLists[
            `${mode}List`
          ].filter(
            (employee: Employee) =>
              employee.employee_id !== selectedEmployee.employee_id
          );
          updatedClockLists[
            mode === "clockIn" ? "clockOutList" : "clockInList"
          ].push(updatedEmployee);
        }
        return updatedClockLists;
      });
      setIsModalOpen(false);
      setError("");

      // move the employee from this list to the other
      // remove the employee from the current list
      // and add them to the other list
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const error = err as { response: { data: any } };
        console.error("Failed to clock employee:", error.response.data);
      } else {
        console.error("Failed to clock employee:", err);
      }
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
            employees={
              mode === "clockIn"
                ? clockLists?.clockInList
                : clockLists?.clockOutList
            }
            searchTerm={searchTerm}
            onSelectEmployee={handleOpenModal}
          />
          {isLoading && <p>Loading...</p>}
        </>
      )}
      <ClockModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={(data) => handleClock(mode, { image: data.image })}
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
