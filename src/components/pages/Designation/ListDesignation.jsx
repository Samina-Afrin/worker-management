
import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const Listdesignation = () => {
  const [designations, setDesignations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Designations
  async function fetchDesignations() {
    try {
      setLoading(true);

      const res = await axios.get("designation/index.php");

      setDesignations(res?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch designations:", error);
      setDesignations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDesignations();
  }, []);

  // Delete Designation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this designation?")) {
      return;
    }

    try {
      const res = await axios.get("designation/delete.php?id=" + id);

      if (
        res?.data?.status === true ||
        res?.data?.status === "success" ||
        res?.data?.status === 1
      ) {
        alert("Designation deleted successfully!");
        fetchDesignations();
      } else {
        alert(res?.data?.message || "Failed to delete designation.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete designation. Please check your API.");
    }
  };

  // Search Designations
  const filteredDesignations = designations.filter((designation) =>
    String(designation.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mt-4">
        <div className="card shadow-sm">

          {/* Header */}
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="mb-0">
                <i className="bi bi-person-badge me-2"></i>
                Designation List
              </h5>

              <Link
                to="/designation/add"
                className="btn btn-primary"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Designation
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-5">
                <label className="form-label">Search Designation</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by designation name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "80px" }}>ID</th>
                    <th>Designation Name</th>
                    <th style={{ width: "180px" }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">
                            Loading...
                          </span>
                        </div>
                        <p className="mt-2 mb-0">
                          Loading designations...
                        </p>
                      </td>
                    </tr>
                  ) : filteredDesignations.length > 0 ? (
                    filteredDesignations.map((designation) => (
                      <tr key={designation.id}>
                        <td>{designation.id}</td>

                        <td>{designation.name}</td>

                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/designation/edit/${designation.id}`}
                              className="btn btn-sm btn-warning"
                              title="Edit"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Link>

                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              title="Delete"
                              onClick={() =>
                                handleDelete(designation.id)
                              }
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No designations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Total */}
            {!loading && (
              <div className="text-muted mt-2">
                Total Designations: {filteredDesignations.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Listdesignation;
