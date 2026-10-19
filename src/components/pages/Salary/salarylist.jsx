import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import Layout from "../../Layout.jsx";
import axios from "../../../Lib/axios";

const Salarylist = () => {
  const [salaries, setSalaries] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Pending");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingWorker, setUpdatingWorker] = useState("");

  async function fetchSalary() {
    try {
      setError("");

      const res = await axios.get("salary/index.php");
      if (res?.data?.status === false) {
        throw new Error(res?.data?.message || "Could not load salaries.");
      }
      setSalaries(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (fetchError) {
      console.error("Failed to fetch salaries:", fetchError);
      setSalaries([]);
      setError(
        fetchError.response?.data?.message ||
          fetchError.message ||
          "Failed to load salaries."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSalary();
  }, []);

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const employees = useMemo(() => {
    const grouped = new Map();

    salaries.forEach((salary) => {
      const status = salary.payment_status === "Paid" ? "Paid" : "Pending";
      const recordDate = salary.salary_date
        ? String(salary.salary_date).slice(0, 10)
        : "";
      if (fromDate && (!recordDate || recordDate < fromDate)) return;
      if (toDate && (!recordDate || recordDate > toDate)) return;

      const key = String(salary.worker_id);
      if (!grouped.has(key)) {
        grouped.set(key, {
          worker_id: salary.worker_id,
          worker_name: salary.worker_name || `Worker ${salary.worker_id}`,
          records: [],
          paid_days: 0,
          unpaid_days: 0,
          visible_amount: 0,
        });
      }

      const employee = grouped.get(key);
      employee.records.push(salary);
      if (status === "Paid") employee.paid_days++;
      else employee.unpaid_days++;
      if (status === activeTab) {
        employee.visible_amount += Number(salary.net_salary || 0);
      }
    });

    const query = search.trim().toLowerCase();
    return Array.from(grouped.values())
      .filter((employee) => {
        const hasTabStatus = employee.records.some(
          (record) =>
            (record.payment_status === "Paid" ? "Paid" : "Pending") === activeTab
        );
        return (
          hasTabStatus &&
          employee.worker_name.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => a.worker_name.localeCompare(b.worker_name));
  }, [activeTab, fromDate, salaries, search, toDate]);

  const tabCounts = useMemo(() => {
    const counts = { Paid: new Set(), Pending: new Set() };
    salaries.forEach((salary) => {
      const recordDate = salary.salary_date
        ? String(salary.salary_date).slice(0, 10)
        : "";
      if (fromDate && (!recordDate || recordDate < fromDate)) return;
      if (toDate && (!recordDate || recordDate > toDate)) return;
      const status = salary.payment_status === "Paid" ? "Paid" : "Pending";
      counts[status].add(String(salary.worker_id));
    });
    return { Paid: counts.Paid.size, Pending: counts.Pending.size };
  }, [fromDate, salaries, toDate]);

  const clearFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
  };

  const markEmployeePaid = async (employee) => {
    const dateRange = fromDate || toDate
      ? ` in the selected date range${fromDate ? ` from ${fromDate}` : ""}${toDate ? ` to ${toDate}` : ""}`
      : "";
    if (!window.confirm(`Mark all unpaid salary dates for ${employee.worker_name} as paid${dateRange}?`)) {
      return;
    }

    setUpdatingWorker(String(employee.worker_id));
    setError("");
    try {
      const data = new FormData();
      data.append("worker_id", employee.worker_id);
      data.append("payment_status", "Paid");
      data.append("from_date", fromDate);
      data.append("to_date", toDate);

      const response = await axios.post("salary/payment-status.php", data);
      if (response?.data?.status !== true) {
        throw new Error(response?.data?.message || "Could not update salary payments.");
      }
      await fetchSalary();
    } catch (updateError) {
      console.error("Failed to mark employee salaries paid:", updateError);
      setError(
        updateError.response?.data?.message ||
          updateError.message ||
          "Failed to update salary payments."
      );
    } finally {
      setUpdatingWorker("");
    }
  };

  return (
    <Layout>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1">Salary Management</h3>
            <p className="text-muted mb-0">View employee payment status and daily salary records</p>
          </div>
                   <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary" to="/salary/sheet">
              <i className="bi bi-table me-2"></i>
              Salary Sheet
            </Link>
            <Link className="btn btn-primary" to="/salary/create">
              <i className="bi bi-plus-circle me-2"></i>
              Add Salary
            </Link>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-lg-4 col-md-6">
                <label className="form-label" htmlFor="salary-search">Search employee</label>
                <input
                  id="salary-search"
                  type="search"
                  className="form-control"
                  placeholder="Employee name..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="col-lg-3 col-md-3">
                <label className="form-label" htmlFor="salary-from-date">From date</label>
                <input
                  id="salary-from-date"
                  type="date"
                  className="form-control"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(event) => setFromDate(event.target.value)}
                />
              </div>
              <div className="col-lg-3 col-md-3">
                <label className="form-label" htmlFor="salary-to-date">To date</label>
                <input
                  id="salary-to-date"
                  type="date"
                  className="form-control"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(event) => setToDate(event.target.value)}
                />
              </div>
              <div className="col-lg-2">
                <button type="button" className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <ul className="nav nav-tabs mb-0">
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "Pending" ? "active" : ""}`}
              onClick={() => setActiveTab("Pending")}
            >
              Unpaid employees <span className="badge bg-warning text-dark ms-1">{tabCounts.Pending}</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeTab === "Paid" ? "active" : ""}`}
              onClick={() => setActiveTab("Paid")}
            >
              Paid employees <span className="badge bg-success ms-1">{tabCounts.Paid}</span>
            </button>
          </li>
        </ul>

        <div className="card shadow-sm border-top-0 rounded-top-0">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
              <h5 className="mb-0">{activeTab === "Paid" ? "Paid employees" : "Unpaid employees"}</h5>
              <span className="badge bg-primary">Employees: {employees.length}</span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Id</th>
                    <th>Employee</th>
                    <th>Paid days</th>
                    <th>Unpaid days</th>
                    <th>{activeTab === "Paid" ? "Paid salary total" : "Unpaid salary total"}</th>
                    {activeTab === "Pending" && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={activeTab === "Pending" ? 6 : 5} className="text-center py-4">Loading salaries...</td></tr>
                  ) : employees.length ? (
                    employees.map((employee, index) => (
                      <tr key={employee.worker_id}>
                        <td>{index + 1}</td>
                        <td>
                          <Link
                            to={`/salary/view/${employee.worker_id}`}
                            className="fw-semibold text-decoration-none"
                          >
                            {employee.worker_name}
                          </Link>
                        </td>
                        <td>{employee.paid_days}</td>
                        <td>{employee.unpaid_days}</td>
                        <td className="fw-semibold">৳ {formatMoney(employee.visible_amount)}</td>
                        {activeTab === "Pending" && (
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-success"
                              disabled={updatingWorker !== ""}
                              onClick={() => markEmployeePaid(employee)}
                            >
                              {updatingWorker === String(employee.worker_id) ? "Updating..." : "Paid"}
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={activeTab === "Pending" ? 6 : 5} className="text-center text-muted py-4">
                        No {activeTab === "Paid" ? "paid" : "unpaid"} employees found for these filters.
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
