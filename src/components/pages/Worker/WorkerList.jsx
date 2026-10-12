import React, { useState } from "react";
import { Link } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const WorkerList = () => {
  const [workers, setWorkers] = useState([]);

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
    async function fetchWorker() {
      const res= await axios.get('workers/index.php');
                setWorkers(res.data.data)
    }
    React.useEffect(() => {
      fetchWorker();
    }, []);

  // Delete Worker


  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this data?")) {
      let res = await axios.delete(`workers/delete.php?id=${id}`)
      if(res.data.status){
        fetchWorker();
      }else{
        alert(res.data.message);
      }
    }
  }

  return (
    <Layout>
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Worker Management</h3>
          <p className="text-muted mb-0">
            Manage all workers and their information
          </p>
        </div>

        <Link
          className="btn btn-primary"
          to="/workers/create"
        >
          <i className="bi bi-person-plus-fill me-2"></i>
          Add Worker
        </Link>
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
                  <th>Id</th>
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

                      <td>{worker.dept_name}</td>

                      <td>{worker.desi_name}</td>

                      <td>{worker.joining_date}</td>

                      <td>
                        ৳ {Number(worker.basic_salary).toLocaleString()}
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
                          <Link
                            to={`/workers/view/${worker.id}`}
                            className="btn btn-sm btn-info text-white"
                            title="View"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>

                          {/* Edit */}
                          <Link
                            className="btn btn-sm btn-warning"
                            title="Edit"
                            to={`/workers/edit/${worker.id}`}
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>

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

    </div>
    </Layout>
  );
};

export default WorkerList;