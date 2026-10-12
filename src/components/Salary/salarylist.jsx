
import { useState } from "react";
import { Link } from "react-router";

function SalaryList() {
  const [salaries, setSalaries] = useState([
    {
      id: 1,
      workerName: "Abu Bakkar",
      month: "2026-09",
      basicSalary: 100000,
      presentDays: 24,
      bonus: 3000,
      deduction: 2000,
      totalSalary: 103000,
      paymentDate: "2026-09-30",
      status: "Paid",
    },
    {
      id: 2,
      workerName: "Samina Afrin",
      month: "2026-09",
      basicSalary: 80000,
      presentDays: 26,
      bonus: 5000,
      deduction: 2000,
      totalSalary: 103000,
      paymentDate: "2026-09-30",
      status: "Paid",
    },
    {
      id: 3,
      workerName: "Tasfia Saba",
      month: "2026-09",
      basicSalary: 50000,
      presentDays: 25,
      bonus: 2000,
      deduction: 500,
      totalSalary: 51500,
      paymentDate: "2026-09-30",
      status: "Paid",
    },
    {
      id: 4,
      workerName: "Sohag Zaman",
      month: "2026-09",
      basicSalary: 20000,
      presentDays: 25,
      bonus: 1000,
      deduction: 500,
      totalSalary: 20500,
      paymentDate: "2026-09-30",
      status: "Paid",
    },
    {
      id: 4,
      workerName: "Helper",
      month: "2026-09",
      basicSalary: 40000,
      presentDays: 25,
      bonus: 1000,
      deduction: 500,
      totalSalary: 40500,
      paymentDate: "2026-09-30",
      status: "Paid",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("");

  const filteredSalaries = salaries.filter((salary) => {
    const searchMatch = salary.workerName
      .toLowerCase()
      .includes(search.toLowerCase());

    const statusMatch =
      statusFilter === "All" ||
      salary.status === statusFilter;

    const monthMatch =
      monthFilter === "" ||
      salary.month === monthFilter;

    return searchMatch && statusMatch && monthMatch;
  });

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this salary?"
    );

    if (confirmDelete) {
      setSalaries(
        salaries.filter((salary) => salary.id !== id)
      );
    }
  };

  return (
    <section className="product-section before-footer-section">
      <div className="container">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="mb-1">Salary</h2>

            <p className="text-muted mb-0">
              Manage monthly worker salaries
            </p>
          </div>

          <Link
            to="/salary/add"
            className="btn btn-primary"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Salary
          </Link>

        </div>

        {/* Search & Filter */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">

            <div className="row g-3">

              <div className="col-md-5">
                <label className="form-label">
                  Search Worker
                </label>

                <div className="input-group">

                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by worker name..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />

                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Month
                </label>

                <input
                  type="month"
                  className="form-control"
                  value={monthFilter}
                  onChange={(e) =>
                    setMonthFilter(e.target.value)
                  }
                />
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
                  <option value="All">
                    All Status
                  </option>

                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Unpaid">
                    Unpaid
                  </option>
                </select>

              </div>

            </div>

          </div>
        </div>

        {/* Salary Table */}
        <div className="card shadow-sm">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-light">
                  <tr>
                    <th>Id</th>
                    <th>Worker</th>
                    <th>Month</th>
                    <th>Basic Salary</th>
                    <th>Present</th>
                    <th>Bonus</th>
                    <th>Deduction</th>
                    <th>Total Salary</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredSalaries.length > 0 ? (

                    filteredSalaries.map((salary, index) => (

                      <tr key={salary.id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {salary.workerName}
                          </strong>
                        </td>

                        <td>
                          {salary.month}
                        </td>

                        <td>
                          ৳{" "}
                          {Number(
                            salary.basicSalary
                          ).toLocaleString()}
                        </td>

                        <td>
                          {salary.presentDays} days
                        </td>

                        <td className="text-success">
                          + ৳{" "}
                          {Number(
                            salary.bonus
                          ).toLocaleString()}
                        </td>

                        <td className="text-danger">
                          - ৳{" "}
                          {Number(
                            salary.deduction
                          ).toLocaleString()}
                        </td>

                        <td>
                          <strong>
                            ৳{" "}
                            {Number(
                              salary.totalSalary
                            ).toLocaleString()}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              salary.status === "Paid"
                                ? "bg-success"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {salary.status}
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

                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="10"
                        className="text-center py-4"
                      >
                        <i className="bi bi-wallet2 fs-3 text-muted"></i>

                        <p className="mb-0 mt-2">
                          No salary records found
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
  );
}

export default SalaryList;
