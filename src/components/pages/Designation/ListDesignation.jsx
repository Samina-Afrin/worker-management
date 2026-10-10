
import { useState } from "react";
import { Link } from "react-router";

function ListDesignation() {
  const [designations, setDesignations] = useState([
    {
      id: 1,
      name: "HR",
      description: "Handles human resources activities",
      basicSalary: 100000,
      status: "Active",
    },
    {
      id: 2,
      name: "IT Developer",
      description: "Develops and maintains software applications",
      basicSalary: 80000,
      status: "Active",
    },
    {
      id: 3,
      name: "IT Designer",
      description: "Designs and creates user interfaces for software applications",
      basicSalary: 50000,
      status: "Active",
    },
    {
      id: 4,
      name: "Driver",
      description: "Drives vehicles for transportation purposes",
      basicSalary: 20000,
      status: "Active",
    },
    {
      id: 5,
      name: "Helper",
      description: "Assists with various tasks and responsibilities",
      basicSalary: 40000,
      status: "Inactive",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredDesignations = designations.filter(
    (designation) => {
      const searchMatch = designation.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" ||
        designation.status === statusFilter;

      return searchMatch && statusMatch;
    }
  );

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this designation?"
    );

    if (confirmDelete) {
      setDesignations(
        designations.filter(
          (designation) => designation.id !== id
        )
      );
    }
  };

  return (
    <>
      <section className="hero shop-hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
            </div>
          </div>
        </div>
      </section>

      <section
        className="product-section before-footer-section"
        aria-label="Designation list"
      >
        <div className="container">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>
              <h2>Designation</h2>

              <p className="text-muted mb-0">
                Manage all designations
              </p>
            </div>

            <Link
              to="/designation/add"
              className="btn btn-primary"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Designation
            </Link>

          </div>

          {/* Search & Filter */}
          <div className="card shadow-sm mb-4">

            <div className="card-body">

              <div className="row g-3">

                <div className="col-md-8">

                  <label className="form-label">
                    Search Designation
                  </label>

                  <div className="input-group">

                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by designation name..."
                      value={search}
                      onChange={(e) =>
                        setSearch(e.target.value)
                      }
                    />

                  </div>

                </div>

                <div className="col-md-4">

                  <label className="form-label">
                    Status
                  </label>

                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                  >
                    <option value="All">
                      All Designations
                    </option>

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>

                </div>

              </div>

            </div>

          </div>

          {/* Table */}
          <div className="card shadow-sm">

            <div className="card-body">

              <div className="table-responsive">

                <table className="table table-hover align-middle">

                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Designation</th>
                      <th>Description</th>
                      <th>Basic Salary</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredDesignations.length > 0 ? (
                      filteredDesignations.map(
                        (designation, index) => (

                          <tr key={designation.id}>

                            <td>
                              {index + 1}
                            </td>

                            <td>
                              <strong>
                                {designation.name}
                              </strong>
                            </td>

                            <td>
                              {designation.description}
                            </td>

                            <td>
                              ৳{" "}
                              {Number(
                                designation.basicSalary
                              ).toLocaleString()}
                            </td>

                            <td>

                              <span
                                className={`badge ${
                                  designation.status === "Active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {designation.status}
                              </span>

                            </td>

                            <td>

                              <div className="btn-group">

                                {/* View */}
                                <Link
                                  to={`/designation/view/${designation.id}`}
                                  className="btn btn-sm btn-info text-white"
                                  title="View"
                                >
                                  <i className="bi bi-eye"></i>
                                </Link>

                                {/* Edit */}
                                <Link
                                  to={`/designation/edit/${designation.id}`}
                                  className="btn btn-sm btn-warning"
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>

                                {/* Delete */}
                                <button
                                  className="btn btn-sm btn-danger"
                                  title="Delete"
                                  onClick={() =>
                                    handleDelete(
                                      designation.id
                                    )
                                  }
                                >
                                  <i className="bi bi-trash"></i>
                                </button>

                              </div>

                            </td>

                          </tr>

                        )
                      )
                    ) : (

                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-4"
                        >
                          <i className="bi bi-person-x fs-3 text-muted"></i>

                          <p className="mb-0 mt-2">
                            No designations found
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
      </section>
    </>
  );
}

export default ListDesignation;
