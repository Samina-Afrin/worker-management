import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const Editattendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState({
    id: "",
    worker_id: "",
    worker_name: "",
    date: "",
    in_time: "",
    out_time: "",
    status: "Present",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError("");
        setLoadFailed(false);

        const res = await axios.get(`attendances/single.php?id=${id}`);

        const raw = res?.data?.data;
        const data = Array.isArray(raw) ? raw[0] : raw;

        if (data) {
          setAttendance({
            ...data,
            date: data.date ? String(data.date).slice(0, 10) : "",
            in_time: data.in_time ? String(data.in_time).slice(0, 5) : "",
            out_time: data.out_time ? String(data.out_time).slice(0, 5) : "",
            status: data.status || "Present",
          });
        } else {
          setLoadFailed(true);
          setError(res?.data?.message || "Attendance record not found.");
        }
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
        setLoadFailed(true);
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
      setLoadFailed(true);
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendance((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await axios.post(`attendances/update.php?id=${id}`, {
        id,
        worker_id: attendance.worker_id,
        date: attendance.date,
        in_time: attendance.in_time,
        out_time: attendance.out_time,
        status: attendance.status,
      });

      if (res?.data?.status === false) {
        setError(res?.data?.message || "Update failed. Please try again.");
        return;
      }

      navigate("/attendance");
    } catch (err) {
      console.error("Failed to update attendance:", err);
      setError(
        err.response?.data?.message || "Update failed. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="mb-0">
                <i className="bi bi-pencil-square me-2"></i>
                Edit Attendance
              </h5>

              <div className="d-flex gap-2">
                <Link to="/attendance" className="btn btn-outline-secondary">
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to List
                </Link>
              </div>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 mb-0">Loading attendance details...</p>
              </div>
            ) : loadFailed ? (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">Attendance ID</small>
                      <h6 className="mt-2 mb-0">{attendance.id || "-"}</h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <small className="text-muted">Worker</small>
                      <h6 className="mt-2 mb-0">
                        {attendance.worker_name ||
                          attendance.name ||
                          `Worker #${attendance.worker_id || "-"}`}
                      </h6>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">
                      Attendance Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={attendance.date || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">
                      Attendance Status
                    </label>
                    <select
                      name="status"
                      className="form-select"
                      value={attendance.status || "Present"}
                      onChange={handleChange}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">In Time</label>
                    <input
                      type="time"
                      name="in_time"
                      className="form-control"
                      value={attendance.in_time || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Out Time</label>
                    <input
                      type="time"
                      name="out_time"
                      className="form-control"
                      value={attendance.out_time || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Link to="/attendance" className="btn btn-secondary">
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    {saving ? "Saving..." : "Update Attendance"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Editattendance;
