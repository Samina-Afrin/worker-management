
import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Layout from "../../Layout.jsx";
import axios from "../../../Lib/axios";

const Salarylist = () => {
  const [salaries, setSalaries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Fetch Salary
  async function fetchSalary() {
    try {
      setLoading(true);

      const res = await axios.get("salary/index.php");
      setSalaries(res?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch salaries:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSalary();
  }, []);

  // Get Month Name
  const getMonthName = (month) => {
    const value = Number(month);

    if (value >= 1 && value <= 12) {
      return months[value - 1];
    }

    return month || "N/A";
  };

  // Format Money
  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-BD");

  // Search and Filter
  const filteredSalaries = salaries.filter((salary) => {
    const workerName = String(salary.worker_name || "");
    const monthName = String(getMonthName(salary.month));
    const year = String(salary.year || "");

    const searchMatch =
      workerName.toLowerCase().includes(search.toLowerCase()) ||
      monthName.toLowerCase().includes(search.toLowerCase()) ||
      year.includes(search);

    const status = salary.payment_status || "Pending";

    const statusMatch =
      statusFilter === "All" || status === statusFilter;

    return searchMatch && statusMatch;
  });

  // Delete Salary
  async function handleDelete(id) {
    if (
      window.confirm(
        "Are you sure you want to delete this salary?"
      )
    ) {
      try {
        const res = await axios.delete(
          `salary/delete.php?id=${id}`
        );

        if (
          res?.data?.status === true ||
          res?.data?.status === "success" ||
          res?.data?.status === 1
        ) {
          fetchSalary();
        } else {
          alert(
            res?.data?.message || "Failed to delete salary"
          );
        }
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete salary");
      }
    }
  }

  return (
    <Layout>
      <div className="container-fluid py-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1">Salary Management</h3>
            <p className="text-muted mb-0">
              Manage worker salaries and payments
            </p>
          </div>

          <Link
            className="btn btn-primary"
            to="/salary/create"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Salary
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">

              <div className="col-md-8">
                <label className="form-label">
                  Search Salary
                </label>

                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search worker, month or year..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Payment Status
                </label>

                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >
                  <option value="All">All Salaries</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Salary Table */}
        <div className="card shadow-sm">
          <div className="card-body">

            <div className="d-flex justify-content-between mb-3">
              <h5 className="mb-0">Salary List</h5>

              <span className="badge bg-primary">
                Total: {filteredSalaries.length}
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">

                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Worker</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Basic Salary</th>
                    <th>Present Days</th>
                    <th>Absent Days</th>
                    <th>Deduction</th>
                    <th>Net Salary</th>
                    <th>Payment Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="11" className="text-center py-4">
                        <div className="spinner-border text-primary"></div>
                        <p className="mb-0 mt-2">
                          Loading salaries...
                        </p>
                      </td>
                    </tr>
                  ) : filteredSalaries.length > 0 ? (
                    filteredSalaries.map((salary, index) => {
                      const status =
                        salary.payment_status || "Pending";

                      return (
                        <tr key={salary.id}>
                          <td>{index + 1}</td>

                          <td>
                            <strong>
                              {salary.worker_name ||
                                salary.worker_id ||
                                "N/A"}
                            </strong>
                          </td>

                          <td>
                            {getMonthName(salary.month)}
                          </td>

                          <td>{salary.year || "N/A"}</td>

                          <td>
                            ৳ {formatMoney(salary.basic_salary)}
                          </td>

                          <td>
                            {salary.present_days ?? "N/A"}
                          </td>

                          <td>
                            {salary.absent_days ?? "N/A"}
                          </td>

                          <td className="text-danger">
                            ৳ {formatMoney(salary.deduction)}
                          </td>

                          <td className="text-success">
                            <strong>
                              ৳ {formatMoney(salary.net_salary)}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`badge ${
                                status === "Paid"
                                  ? "bg-success"
                                  : status === "Pending"
                                  ? "bg-warning text-dark"
                                  : "bg-danger"
                              }`}
                            >
                              {status}
                            </span>
                          </td>

                          <td>
                            <div className="btn-group">

                              {/* View */}
                              <Link
                                to={`/salary/view/${salary.id}`}
                                className="btn btn-sm btn-info text-white"
                                title="View"
                              >
                                <i className="bi bi-eye"></i>
                              </Link>

                              {/* Edit */}
                              <Link
                                to={`/salary/edit/${salary.id}`}
                                className="btn btn-sm btn-warning"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>

                              {/* Delete */}
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                title="Delete"
                                onClick={() =>
                                  handleDelete(salary.id)
                                }
                              >
                                <i className="bi bi-trash"></i>
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center py-4">
                        <i className="bi bi-cash-stack fs-3 text-muted"></i>
                        <p className="mb-0 mt-2">
                          No salaries found
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

export default Salarylist;
