
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const Listattendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all attendance records
  const fetchAttendances = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("attendances/index.php");

      const data = res?.data?.data;
      setAttendances(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch attendances:", err);
      setAttendances([]);
      setError("Failed to load attendance records. Please check your API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  // Delete attendance
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );

    if (!confirmed) return;

    try {
      const res = await axios.get(
        `attendance/delete.php?id=${id}`
      );

      const result = res?.data?.status;
      const success =
        result === true ||
        result === "success" ||
        result === 1 ||
        result === "1";

      if (success) {
        alert("Attendance deleted successfully!");
        await fetchAttendances();
      } else {
        alert(res?.data?.message || "Failed to delete attendance.");
      }
    } catch (err) {
      console.error("Delete attendance failed:", err);
      alert(
        err.response?.data?.message ||
        "Failed to delete attendance. Please check your API."
      );
    }
  };

  // Search and filters
  const filteredAttendances = attendances.filter((item) => {
    const workerName = String(
      item.worker_name || item.name || ""
    ).toLowerCase();

    const workerId = String(item.worker_id || "").toLowerCase();
    const query = search.trim().toLowerCase();

    const matchesSearch =
      workerName.includes(query) || workerId.includes(query);

    const recordDate = String(item.date || "").slice(0, 10);
    const matchesDate = !date || recordDate === date;

    const recordStatus = String(item.status || "").toLowerCase();
    const matchesStatus =
      !status || recordStatus === status.toLowerCase();

    return matchesSearch && matchesDate && matchesStatus;
  });

  // Summary counts based on current filters
  const presentCount = filteredAttendances.filter(
    (item) => String(item.status).toLowerCase() === "present"
  ).length;

  const absentCount = filteredAttendances.filter(
    (item) => String(item.status).toLowerCase() === "absent"
  ).length;

  const lateCount = filteredAttendances.filter(
    (item) => String(item.status).toLowerCase() === "late"
  ).length;

  const statusBadge = (value) => {
    switch (String(value || "").toLowerCase()) {
      case "present":
        return "bg-success";
      case "absent":
        return "bg-danger";
      case "late":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  return (
    <Layout>
      <div className="container-fluid mt-4">
        <div className="card shadow-sm">
          {/* Header */}
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="mb-0">
                <i className="bi bi-calendar-check me-2"></i>
                Attendance List
              </h5>

              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={fetchAttendances}
                  disabled={loading}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Refresh
                </button>

                <Link
                  to="/attendance/add"
                  className="btn btn-primary"
                >
                  <i className="bi bi-people-fill me-2"></i>
                  Bulk Attendance
                </Link>
              </div>
            </div>
          </div>

          <div className="card-body">
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {/* Summary cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-success h-100">
                  <div className="card-body">
                    <div className="text-secondary">Present</div>
                    <h3 className="text-success mb-0">
                      {presentCount}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-danger h-100">
                  <div className="card-body">
                    <div className="text-secondary">Absent</div>
                    <h3 className="text-danger mb-0">
                      {absentCount}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-warning h-100">
                  <div className="card-body">
                    <div className="text-secondary">Late</div>
                    <h3 className="text-warning mb-0">
                      {lateCount}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and filters */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label">
                  Search Worker
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or worker ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Attendance Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">
                  Status
                </label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setSearch("");
                    setDate("");
                    setStatus("");
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  Reset
                </button>
              </div>
            </div>

            {/* Attendance table */}
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Worker</th>
                    <th>Worker ID</th>
                    <th>Date</th>
                    <th>In Time</th>
                    <th>Out Time</th>
                    <th>Status</th>
                    <th style={{ minWidth: "150px" }}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">
                            Loading...
                          </span>
                        </div>
                        <p className="mt-2 mb-0">
                          Loading attendance records...
                        </p>
                      </td>
                    </tr>
                  ) : filteredAttendances.length > 0 ? (
                    filteredAttendances.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>

                        <td>
                          {item.worker_name ||
                            item.name ||
                            `Worker #${item.worker_id}`}
                        </td>

                        <td>{item.worker_id || "-"}</td>

                        <td>
                          {item.date
                            ? String(item.date).slice(0, 10)
                            : "-"}
                        </td>

                        <td>{item.in_time || "-"}</td>
                        <td>{item.out_time || "-"}</td>

                        <td>
                          <span className={`badge ${statusBadge(item.status)}`}>
                            {item.status || "Unknown"}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/attendance/view/${item.id}`}
                              className="btn btn-sm btn-info text-white"
                              title="View Attendance"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>

                            <Link
                              to={`/attendance/edit/${item.id}`}
                              className="btn btn-sm btn-warning"
                              title="Edit Attendance"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Link>

                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              title="Delete Attendance"
                              onClick={() => handleDelete(item.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-muted mt-3">
              Total Attendance Records: {filteredAttendances.length}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Listattendance;
