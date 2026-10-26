import React from "react";
import { Link, useParams } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const Viewattendance = () => {
  const { id } = useParams();

  const [attendance, setAttendance] = React.useState({
    id: "",
    worker_id: "",
    worker_name: "",
    date: "",
    in_time: "",
    out_time: "",
    status: "",
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  async function fetchAttendance() {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("attendances/single.php?id=" + id);
      const raw = res?.data?.data;
      const data = Array.isArray(raw) ? raw[0] : raw;

      if (data) {
        setAttendance(data);
      } else {
        setError(res?.data?.message || "Attendance record not found.");
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
  }

  React.useEffect(() => {
    fetchAttendance();
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
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-calendar-check me-2"></i>
                Attendance Details
              </h5>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 mb-0">Loading attendance details...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              ) : (
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">Attendance ID</small>
                      <h6 className="mb-0">{attendance.id || "-"}</h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">Worker ID</small>
                      <h6 className="mb-0">{attendance.worker_id || "-"}</h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">Worker Name</small>
                      <h6 className="mb-0">
                        {attendance.worker_name ||
                          attendance.name ||
                          `Worker #${attendance.worker_id || "-"}`}
                      </h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">Attendance Date</small>
                      <h6 className="mb-0">
                        {attendance.date
                          ? String(attendance.date).slice(0, 10)
                          : "-"}
                      </h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">In Time</small>
                      <h6 className="mb-0">{attendance.in_time || "-"}</h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">Out Time</small>
                      <h6 className="mb-0">{attendance.out_time || "-"}</h6>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="border rounded p-3">
                      <small className="text-muted">Attendance Status</small>
                      <div>
                        <span
                          className={`badge ${getStatusClass(attendance.status)}`}
                        >
                          {attendance.status || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <Link to="/attendance" className="btn btn-secondary">
                <i className="bi bi-arrow-left me-1"></i>
                Back to List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Viewattendance;
