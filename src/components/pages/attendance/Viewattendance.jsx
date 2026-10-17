
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const Viewattendance = () => {
  const { id } = useParams();

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `attendance/single.php?id=${id}`
        );

        const data = res?.data?.data;

        if (res?.data?.status && data) {
          setAttendance(data);
        } else if (data) {
          setAttendance(data);
        } else {
          setError(
            res?.data?.message || "Attendance record not found."
          );
        }
      } catch (err) {
        console.error("Failed to fetch attendance:", err);

        setError(
          err.response?.data?.message ||
          "Failed to load attendance details. Please check your API."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAttendance();
    } else {
      setError("Attendance ID is missing.");
      setLoading(false);
    }
  }, [id]);

  const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
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
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="mb-0">
                <i className="bi bi-calendar-check me-2"></i>
                Attendance Details
              </h5>

              <div className="d-flex gap-2">
                <Link
                  to="/attendance"
                  className="btn btn-outline-secondary"
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to List
                </Link>

                {attendance && (
                  <Link
                    to={`/attendance/edit/${attendance.id}`}
                    className="btn btn-warning"
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    Edit
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary"
                  role="status"
                >
                  <span className="visually-hidden">
                    Loading...
                  </span>
                </div>
                <p className="mt-2 mb-0">
                  Loading attendance details...
                </p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            ) : attendance ? (
              <>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Attendance ID
                      </small>
                      <h6 className="mt-2 mb-0">
                        {attendance.id || "-"}
                      </h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Worker ID
                      </small>
                      <h6 className="mt-2 mb-0">
                        {attendance.worker_id || "-"}
                      </h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Worker Name
                      </small>
                      <h6 className="mt-2 mb-0">
                        {attendance.worker_name ||
                          attendance.name ||
                          `Worker #${attendance.worker_id || "-"}`}
                      </h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Attendance Date
                      </small>
                      <h6 className="mt-2 mb-0">
                        {attendance.date
                          ? String(attendance.date).slice(0, 10)
                          : "-"}
                      </h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        In Time
                      </small>
                      <h6 className="mt-2 mb-0">
                        {attendance.in_time || "-"}
                      </h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Out Time
                      </small>
                      <h6 className="mt-2 mb-0">
                        {attendance.out_time || "-"}
                      </h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">
                        Attendance Status
                      </small>
                      <div className="mt-2">
                        <span
                          className={`badge ${getStatusClass(
                            attendance.status
                          )}`}
                        >
                          {attendance.status || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Link
                    to="/attendance"
                    className="btn btn-secondary"
                  >
                    Close
                  </Link>

                  <Link
                    to={`/attendance/edit/${attendance.id}`}
                    className="btn btn-primary"
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    Edit Attendance
                  </Link>
                </div>
              </>
            ) : (
              <div className="alert alert-warning">
                Attendance record not found.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Viewattendance;
