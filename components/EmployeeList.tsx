import React from 'react';
import Fuse from 'fuse.js';

interface Employee {
  employee_id: string;
  full_name: string;
}

interface EmployeeListProps {
  employees: Employee[];
  searchTerm: string;
  onSelectEmployee: (employeeId: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, searchTerm, onSelectEmployee }) => {
  const fuse = new Fuse(employees, { keys: ['full_name'] });
  const results = fuse.search(searchTerm);
  const employeeResults = searchTerm ? results.map(result => result.item) : employees;

  return (
    <ul>
      {employeeResults.map((employee) => (
        <li
          key={employee.employee_id}
          className="cursor-pointer hover:bg-gray-100 p-2"
          onClick={() => {
            console.log(`Selecting employee with ID: ${employee.employee_id}`);
            onSelectEmployee(employee.employee_id);
          }}
        >
          {employee.full_name}
        </li>
      ))}
    </ul>
  );
};

export default EmployeeList;