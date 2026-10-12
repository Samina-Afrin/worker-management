
import React, { useState } from "react";

const BasicTables = () => {
  const [workers, setWorkers] = useState([
    {
      id: 1,
      name: "Abu Bakkar",
      phone: "01811111111",
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
      department: "IT",
      designation: "Helper",
      joiningDate: "2024-05-15",
      basicSalary: 40000,
      status: "Inactive",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewWorker, setViewWorker] = useState(null);
  const [editWorker, setEditWorker] = useState(null);

  // Search + Filter
  const filteredWorkers = workers.filter((worker) => {
    const searchMatch =
      worker.name.toLowerCase().includes(search.toLowerCase()) ||
      worker.phone.includes(search);

    const statusMatch =
      statusFilter === "All" || worker.status === statusFilter;

    return searchMatch && statusMatch;
  });

  // Update Worker
  const handleUpdateWorker = (e) => {
    e.preventDefault();

    setWorkers((prevWorkers) =>
      prevWorkers.map((worker) =>
        worker.id === editWorker.id ? editWorker : worker
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
      setWorkers((prevWorkers) =>
        prevWorkers.filter((worker) => worker.id !== id)
      );
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">
            <i className="bi bi-table me-2"></i>
            Basic Tables
          </h3>

          <p className="text-muted mb-0">
            View and manage worker information
          </p>
        </div>

        <span className="badge bg-primary fs-6">
          Total Workers: {workers.length}
        </span>
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

      {/* Basic Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">Worker Information Table</h5>
        </div>

        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle">

              <thead className="table-light">
                <tr>
                  <th>Id</th>
                  <th>Worker</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                  <th>Basic Salary</th>
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
                        ৳ {Number(worker.basicSalary).toLocaleString("en-BD")}
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
                            type="button"
                            className="btn btn-sm btn-info text-white"
                            title="View Worker"
                            onClick={() => setViewWorker(worker)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            className="btn btn-sm btn-warning"
                            title="Edit Worker"
                            onClick={() => setEditWorker({ ...worker })}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            title="Delete Worker"
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

          <div className="text-muted small">
            Showing {filteredWorkers.length} of {workers.length} workers
          </div>

        </div>
      </div>

      {/* View Worker Modal */}
      {viewWorker && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-person-vcard me-2"></i>
                  Worker Details
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewWorker(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p><strong>Name:</strong> {viewWorker.name}</p>
                <p><strong>Phone:</strong> {viewWorker.phone}</p>
                <p><strong>Department:</strong> {viewWorker.department}</p>
                <p><strong>Designation:</strong> {viewWorker.designation}</p>
                <p><strong>Joining Date:</strong> {viewWorker.joiningDate}</p>
                <p>
                  <strong>Basic Salary:</strong>{" "}
                  ৳ {Number(viewWorker.basicSalary).toLocaleString("en-BD")}
                </p>
                <p className="mb-0">
                  <strong>Status:</strong> {viewWorker.status}
                </p>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setViewWorker(null)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Edit Worker Modal */}
      {editWorker && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit Worker
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditWorker(null)}
                ></button>
              </div>

              <form onSubmit={handleUpdateWorker}>

                <div className="modal-body">

                  <div className="mb-3">
                    <label className="form-label">Worker Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editWorker.name}
                      onChange={(e) =>
                        setEditWorker({
                          ...editWorker,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={editWorker.phone}
                      onChange={(e) =>
                        setEditWorker({
                          ...editWorker,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editWorker.department}
                      onChange={(e) =>
                        setEditWorker({
                          ...editWorker,
                          department: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editWorker.designation}
                      onChange={(e) =>
                        setEditWorker({
                          ...editWorker,
                          designation: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Joining Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editWorker.joiningDate}
                      onChange={(e) =>
                        setEditWorker({
                          ...editWorker,
                          joiningDate: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Basic Salary</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={editWorker.basicSalary}
                      onChange={(e) =>
                        setEditWorker({
                          ...editWorker,
                          basicSalary: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={editWorker.status}
                      onChange={(e) =>
                        setEditWorker({
                          ...editWorker,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditWorker(null)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-save me-2"></i>
                    Update Worker
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BasicTables;
