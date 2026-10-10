import React, { useState } from "react";
import AddWorker from "./AddWorker";
import EditWorker from "./EditWorker";
import ViewWorker from "./ViewWorker";

const WorkerList = () => {
  const [workers, setWorkers] = useState([
    {
      id: 1,
      name: "Abu Bakkar",
      phone: "01811111111",
      nid: "3764521062",
      address: "Dhaka, Bangladesh",
      department: "HR",
      designation: "HR Officer",
      joiningDate: "2025-05-15",
      basicSalary: 100000,
      status: "Active",
    },
    {
      id: 2,
      name: "Samina Afrin",
      phone: "01879228978",
      nid: "9876543210",
      address: "Dhaka, Bangladesh",
      department: "IT",
      designation: "Software Engineer",
      joiningDate: "2024-09-15",
      basicSalary: 80000,
      status: "Active",
    },
     {
      id: 3,
      name: "Tasfia Saba",
      phone: "01833333333",
      nid: "1234567890",
      address: "Dhaka, Bangladesh",
      department: "IT",
      designation: "Designer",
      joiningDate: "2024-05-15",
      basicSalary: 50000,
      status: "Active",
    }, 

    {
      id: 4,
      name: "Sohag Zaman",
      phone: "01844444444",
      nid: "0987654321",
      address: "Dhaka, Bangladesh",
      department: "Driver",
      designation: "Driver",
      joiningDate: "2024-05-15",
      basicSalary: 20000,
      status: "Active",
    },
    {
      id: 5,
      name: "Zamil Hossain",
      phone: "01833333333",
      nid: "1234567890",
      address: "Dhaka, Bangladesh",
      department: "IT",
      designation: "Helper",
      joiningDate: "2024-05-15",
      basicSalary: 40000,
      status: "Inactive",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showAdd, setShowAdd] = useState(false);
  const [editWorker, setEditWorker] = useState(null);
  const [viewWorker, setViewWorker] = useState(null);

  // Search + Filter
  const filteredWorkers = workers.filter((worker) => {
    const searchMatch =
      worker.name.toLowerCase().includes(search.toLowerCase()) ||
      worker.phone.includes(search);

    const statusMatch =
      statusFilter === "All" || worker.status === statusFilter;

    return searchMatch && statusMatch;
  });

  // Add Worker
  const handleAddWorker = (worker) => {
    setWorkers([
      ...workers,
      {
        ...worker,
        id: Date.now(),
      },
    ]);

    setShowAdd(false);
  };

  // Update Worker
  const handleUpdateWorker = (updatedWorker) => {
    setWorkers(
      workers.map((worker) =>
        worker.id === updatedWorker.id ? updatedWorker : worker
      )
    );

    setEditWorker(null);
  };

  // Delete Worker
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this worker?"
    );

    if (confirmDelete) {
      setWorkers(workers.filter((worker) => worker.id !== id));
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Worker Management</h3>
          <p className="text-muted mb-0">
            Manage all workers and their information
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAdd(true)}
        >
          <i className="bi bi-person-plus-fill me-2"></i>
          Add Worker
        </button>
      </div>

      {/* Search & Filter */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">

            <div className="col-md-8">
              <label className="form-label">Search Worker</label>

              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Status</label>

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Workers</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Worker Table */}
      <div className="card shadow-sm">
        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Worker</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredWorkers.length > 0 ? (
                  filteredWorkers.map((worker, index) => (
                    <tr key={worker.id}>

                      <td>{index + 1}</td>

                      <td>
                        <strong>{worker.name}</strong>
                      </td>

                      <td>{worker.phone}</td>

                      <td>{worker.department}</td>

                      <td>{worker.designation}</td>

                      <td>{worker.joiningDate}</td>

                      <td>
                        ৳ {Number(worker.basicSalary).toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            worker.status === "Active"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {worker.status}
                        </span>
                      </td>

                      <td>
                        <div className="btn-group">

                          {/* View */}
                          <button
                            className="btn btn-sm btn-info text-white"
                            title="View"
                            onClick={() => setViewWorker(worker)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          {/* Edit */}
                          <button
                            className="btn btn-sm btn-warning"
                            title="Edit"
                            onClick={() => setEditWorker(worker)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          {/* Delete */}
                          <button
                            className="btn btn-sm btn-danger"
                            title="Delete"
                            onClick={() => handleDelete(worker.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <i className="bi bi-person-x fs-3 text-muted"></i>
                      <p className="mb-0 mt-2">
                        No workers found
                      </p>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>
      </div>

      {/* Add Worker */}
      {showAdd && (
        <AddWorker
          onAdd={handleAddWorker}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Edit Worker */}
      {editWorker && (
        <EditWorker
          worker={editWorker}
          onUpdate={handleUpdateWorker}
          onClose={() => setEditWorker(null)}
        />
      )}

      {/* View Worker */}
      {viewWorker && (
        <ViewWorker
          worker={viewWorker}
          onClose={() => setViewWorker(null)}
        />
      )}

    </div>
  );
};

export default WorkerList;