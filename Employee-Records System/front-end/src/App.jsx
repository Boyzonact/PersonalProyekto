import React, { useState, useEffect } from 'react';

const EmployeeRecords = () => {
  const api = 'http://localhost:8081/api/employees';
  const [employees, setEmployees] = useState([]);
  const [empId, setEmpId] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const res = await fetch(api);
    const data = await res.json();
    setEmployees(data);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const employee = { name, position, department, salary };

    if (empId) {
      await fetch(`${api}/${empId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });
    } else {
      await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });
    }

    // Clear form and reload employees
    setEmpId('');
    setName('');
    setPosition('');
    setDepartment('');
    setSalary('');
    loadEmployees();
  };

  const editEmployee = (id, name, position, department, salary) => {
    setEmpId(id);
    setName(name);
    setPosition(position);
    setDepartment(department);
    setSalary(salary);
  };

  const deleteEmployee = async (id) => {
    if (window.confirm('Delete this employee?')) {
      await fetch(`${api}/${id}`, { method: 'DELETE' });
      loadEmployees();
    }
  };

  return (
    <div className="container p-4">
      <h2 className="mb-4">👨‍💼 Employee Records System</h2>

      <form id="employeeForm" onSubmit={handleFormSubmit}>
        <input type="hidden" value={empId} onChange={(e) => setEmpId(e.target.value)} />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
        />
        <button className="btn btn-success" type="submit">
          Save
        </button>
      </form>

      <hr />

      <div className="row mt-4">
        {employees.map((emp) => (
          <div className="col-md-4" key={emp.id}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">{emp.name}</h5>
                <p className="card-text">Position: {emp.position}</p>
                <p className="card-text">Department: {emp.department}</p>
                <p className="card-text">Salary: ₱{emp.salary}</p>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() =>
                    editEmployee(emp.id, emp.name, emp.position, emp.department, emp.salary)
                  }
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteEmployee(emp.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeRecords;
