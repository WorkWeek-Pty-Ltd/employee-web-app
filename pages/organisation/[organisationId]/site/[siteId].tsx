import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import ClockModal from "../../../../components/ClockModal";
import NotificationBanner from "../../../../components/NotificationBanner";
import EmployeeList from "../../../../components/EmployeeList";
import {
  getClockListsAndSiteName,
  insertClockEvent,
} from "../../../../utils/api";
import ModeSwitch from "../../../../components/ModeSwitch";
import { useLocationAccuracy } from "../../../../hooks/useLocationAccuracy";
import { Employee, ModeSwitchProps, ClockEvent, ClockLists } from "@/types";
import styles from "../../../../styles/SearchAndList.module.css";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export const getServerSideProps = async (context: {
  params: { siteId: string };
}) => {
  const { siteId } = context.params;

  try {
    const response = await getClockListsAndSiteName(siteId);

    return {
      props: {
        clockLists: response.clockLists,
        siteName: response.siteName,
        error: null,
      },
    };
  } catch (error) {
    console.error("Failed to fetch site details:", error);

    return {
      props: {
        clockLists: null,
        siteName: "",
        error: "Failed to fetch site details. Please try again.",
      },
    };
  }
};

const SiteDetailPage = ({
  clockLists: initialClockLists,
  siteName: initialSiteName,
  error: initialError,
}: {
  clockLists: ClockLists | null;
  siteName: string;
  error: string | null;
}) => {
  const router = useRouter();
  const { organisationId, siteId } = router.query;
  const [clockLists, setClockLists] = useState<ClockLists | null>(
    initialClockLists
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(initialError);
  const [mode, setMode] = useState<ModeSwitchProps["mode"]>("clockIn");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isNotificationSuccess, setIsNotificationSuccess] = useState(true);
  const { latitude, longitude, accuracy } = useLocationAccuracy();

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

      const response = await insertClockEvent(payload);
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
      setError(
        `Failed to ${
          mode == "clockIn" ? "Clock In" : "Clock Out"
        }. Please try again.`
      );
      setNotificationMessage("Failure");
      setIsNotificationSuccess(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  return (
    <Layout
      pageTitle={initialSiteName}
      backRoute={`/organisation/${organisationId}`}
    >
      {!isModalOpen && (
        <>
          <ModeSwitch mode={mode} setMode={setMode} />
          <div className="w-full flex">
            <div className="bg-white px-4 py-2 rounded-lg flex items-center mb-4 border-orange-300 border w-full">
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
          </div>
          {error && <p className="text-red-500 text-center pb-2">{error}</p>}
          <EmployeeList
            employees={
              mode === "clockIn"
                ? clockLists?.clockInList
                : clockLists?.clockOutList
            }
            searchTerm={searchTerm}
            onSelectEmployee={handleOpenModal}
          />
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
