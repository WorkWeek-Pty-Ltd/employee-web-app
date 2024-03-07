import React from "react";
import Fuse from "fuse.js";

interface Employee {
  employee_id: string;
  full_name: string;
}

interface EmployeeListProps {
  employees?: Employee[];
  searchTerm: string;
  onSelectEmployee: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  searchTerm,
  onSelectEmployee,
}) => {
  if (!employees) {
    return null;
  }
  const fuse = new Fuse(employees, { keys: ["full_name"] });
  const results = fuse.search(searchTerm);
  const employeeResults = searchTerm
    ? results.map((result) => result.item)
    : employees;

  return employeeResults.length > 0 ? (
    <ul>
      {employeeResults.map((employee) => (
        <li
          key={employee.employee_id}
          className="cursor-pointer hover:bg-gray-100 p-2"
          onClick={() => {
            console.log(`Selecting employee with ID: ${employee.employee_id}`);
            onSelectEmployee(employee);
          }}
        >
          {employee.full_name}
        </li>
      ))}
    </ul>
  ) : (
    <p>No employees</p>
  );
};

export default EmployeeList;
