
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const today = () => new Date().toLocaleDateString("en-CA");

const Addattendance = () => {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(today());
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Load all workers
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setFetching(true);
        setError("");

        const res = await axios.get("workers/index.php");

        const data = Array.isArray(res?.data?.data)
          ? res.data.data
          : [];

        // If your API returns inactive workers too,
        // filter them here.
        const activeWorkers = data.filter(
          (worker) =>
            !worker.status ||
            String(worker.status).toLowerCase() === "active"
        );

        setWorkers(activeWorkers);

        // Default attendance for each worker
        const initialAttendance = {};

        activeWorkers.forEach((worker) => {
          initialAttendance[worker.id] = {
            worker_id: worker.id,
            status: "Present",
            in_time: "",
            out_time: "",
          };
        });

        setAttendance(initialAttendance);
      } catch (err) {
        console.error("Failed to load workers:", err);
        setError("Workers could not be loaded. Please check the API.");
      } finally {
        setFetching(false);
      }
    };

    fetchWorkers();
  }, []);

  // Change attendance status/time
  const handleChange = (workerId, field, value) => {
    setAttendance((previous) => ({
      ...previous,
      [workerId]: {
        ...previous[workerId],
        [field]: value,
      },
    }));
  };

  // Mark everyone Present
  const markAllPresent = () => {
    setAttendance((previous) => {
      const updated = { ...previous };

      workers.forEach((worker) => {
        updated[worker.id] = {
          ...updated[worker.id],
          worker_id: worker.id,
          status: "Present",
        };
      });

      return updated;
    });
  };

  // Save all attendance records
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!attendanceDate) {
      setError("Please select an attendance date.");
      return;
    }

    if (workers.length === 0) {
      setError("No workers found to save attendance.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // The current create.php endpoint inserts ONE record.
      // Send one request for each worker.
      const results = await Promise.allSettled(
        workers.map((worker) => {
          const item = attendance[worker.id];

          const data = new FormData();
          data.append("worker_id", worker.id);
          data.append("date", attendanceDate);
          data.append("status", item?.status || "Present");
          data.append("in_time", item?.in_time || "");
          data.append("out_time", item?.out_time || "");

          return axios.post("attendances/create.php", data);
        })
      );

      const failed = results.filter((result, index) => {
        if (result.status === "rejected") return true;

        const response = result.value?.data;
        const success =
          response?.status === true ||
          response?.status === "success" ||
          response?.status === 1 ||
          response?.status === "1";

        return !success;
      });

      if (failed.length > 0) {
        setError(
          `${workers.length - failed.length} attendance record(s) saved; ` +
          `${failed.length} failed. Check duplicate records and the API response.`
        );
      } else {
        alert("All attendance records saved successfully!");
        navigate("/attendance");
      }
    } catch (err) {
      console.error("Bulk attendance save failed:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to save attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkers = workers.filter((worker) => {
    const query = search.toLowerCase();

    return (
      String(worker.name || "").toLowerCase().includes(query) ||
      String(worker.phone || "").toLowerCase().includes(query)
    );
  });

  const countStatus = (status) =>
    workers.filter(
      (worker) => attendance[worker.id]?.status === status
    ).length;

  return (
    <Layout>
      <div className="container-fluid mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="mb-0">
              <i className="bi bi-calendar-check me-2"></i>
              Bulk Attendance
            </h5>

            <button
              type="button"
              className="btn btn-success"
              onClick={markAllPresent}
              disabled={fetching || workers.length === 0}
            >
              <i className="bi bi-check2-all me-2"></i>
              Mark All Present
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-body">
              {error && (
                <div className="alert alert-warning" role="alert">
                  {error}
                </div>
              )}

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label">
                    Attendance Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Search Worker
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search name or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">
                    Total Workers
                  </label>

                  <input
                    className="form-control"
                    value={fetching ? "Loading..." : workers.length}
                    readOnly
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="border rounded p-3">
                    <div className="text-secondary">Present</div>
                    <h4 className="text-success mb-0">
                      {countStatus("Present")}
                    </h4>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3">
                    <div className="text-secondary">Absent</div>
                    <h4 className="text-danger mb-0">
                      {countStatus("Absent")}
                    </h4>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3">
                    <div className="text-secondary">Late</div>
                    <h4 className="text-warning mb-0">
                      {countStatus("Late")}
                    </h4>
                  </div>
                </div>
              </div>

              {fetching ? (
                <div className="text-center p-4">
                  Loading workers...
                </div>
              ) : workers.length === 0 ? (
                <div className="alert alert-info">
                  No active workers found.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "70px" }}>#</th>
                        <th>Worker Name</th>
                        <th>Phone</th>
                        <th style={{ minWidth: "150px" }}>In Time</th>
                        <th style={{ minWidth: "150px" }}>Out Time</th>
                        <th style={{ minWidth: "150px" }}>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredWorkers.map((worker, index) => {
                        const item = attendance[worker.id] || {};

                        return (
                          <tr key={worker.id}>
                            <td>{index + 1}</td>
                            <td>{worker.name}</td>
                            <td>{worker.phone || "-"}</td>

                            <td>
                              <input
                                type="time"
                                className="form-control"
                                value={item.in_time || ""}
                                onChange={(e) =>
                                  handleChange(
                                    worker.id,
                                    "in_time",
                                    e.target.value
                                  )
                                }
                              />
                            </td>

                            <td>
                              <input
                                type="time"
                                className="form-control"
                                value={item.out_time || ""}
                                onChange={(e) =>
                                  handleChange(
                                    worker.id,
                                    "out_time",
                                    e.target.value
                                  )
                                }
                              />
                            </td>

                            <td>
                              <select
                                className={`form-select ${
                                  item.status === "Present"
                                    ? "text-success"
                                    : item.status === "Absent"
                                    ? "text-danger"
                                    : "text-warning"
                                }`}
                                value={item.status || "Present"}
                                onChange={(e) =>
                                  handleChange(
                                    worker.id,
                                    "status",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="Late">Late</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="card-footer bg-white text-end">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => navigate("/attendance")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || fetching || workers.length === 0}
              >
                <i className="bi bi-save me-2"></i>
                {loading ? "Saving Attendance..." : "Save All Attendance"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Addattendance;
