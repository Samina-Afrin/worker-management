import React from "react";
import { Link } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const pad = (value) => String(value).padStart(2, "0");

const getList = (response) => {
  const data = response?.data?.data;
  return Array.isArray(data) ? data : data ? [data] : [];
};

const Viewattendance = () => {
  const [month, setMonth] = React.useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;
  });
  const [workers, setWorkers] = React.useState([]);
  const [records, setRecords] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchMonthlyData = React.useCallback(async () => {
    const [workerResponse, attendanceResponse] = await Promise.all([
      axios.get("workers/index.php"),
      axios.get("attendances/index.php"),
    ]);

    return {
      workers: getList(workerResponse),
      records: getList(attendanceResponse),
    };
  }, []);

  const handleFetchError = React.useCallback((err) => {
    console.error("Failed to fetch monthly attendance:", err);
    setWorkers([]);
    setRecords([]);
    setError(
      err.response?.data?.message ||
        "Failed to load workers or attendance records. Please check your API."
    );
  }, []);

  React.useEffect(() => {
    let active = true;

    fetchMonthlyData()
      .then(({ workers: workerList, records: attendanceList }) => {
        if (!active) return;
        setWorkers(workerList);
        setRecords(attendanceList);
      })
      .catch((err) => {
        if (active) handleFetchError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchMonthlyData, handleFetchError]);

  const refreshMonthlyData = () => {
    setLoading(true);
    setError("");

    fetchMonthlyData()
      .then(({ workers: workerList, records: attendanceList }) => {
        setWorkers(workerList);
        setRecords(attendanceList);
      })
      .catch(handleFetchError)
      .finally(() => setLoading(false));
  };

  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const monthLabel = new Date(year, monthNumber - 1, 1).toLocaleString(
    "en-US",
    { month: "long", year: "numeric" }
  );

  const attendanceByWorkerDay = React.useMemo(() => {
    const map = new Map();

    records.forEach((record) => {
      const recordDate = String(record.date || "").slice(0, 10);
      if (recordDate.slice(0, 7) !== month) return;

      map.set(`${record.worker_id}-${recordDate}`, record);
    });

    return map;
  }, [month, records]);

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
      <div className="container-fluid py-4">
        <div className="card shadow-sm">
          <div className="card-header bg-white py-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h5 className="mb-1">
                  <i className="bi bi-calendar-check me-2"></i>
                  Monthly Attendance
                </h5>
                <div className="text-muted">{monthLabel}</div>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <input
                  type="month"
                  className="form-control"
                  aria-label="Attendance month"
                  value={month}
                  onChange={(event) => {
                    if (event.target.value) setMonth(event.target.value);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={refreshMonthlyData}
                  disabled={loading}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Refresh
                </button>
                <Link to="/attendance" className="btn btn-secondary">
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to List
                </Link>
              </div>
            </div>
          </div>

          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 mb-0">Loading monthly attendance...</p>
              </div>
            ) : !error ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover text-center align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th
                        scope="col"
                        className="text-start"
                        style={{
                          minWidth: 200,
                          position: "sticky",
                          left: 0,
                          zIndex: 2,
                          background: "var(--bs-table-bg)",
                        }}
                      >
                        Worker
                      </th>
                      {days.map((day) => {
                        const date = new Date(year, monthNumber - 1, day);
                        return (
                          <th scope="col" key={day} style={{ minWidth: 78 }}>
                            <div>{day}</div>
                            <small className="text-muted">
                              {date.toLocaleString("en-US", {
                                weekday: "short",
                              })}
                            </small>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {workers.length ? (
                      workers.map((worker) => (
                        <tr key={worker.id}>
                          <th
                            scope="row"
                            className="text-start"
                            style={{
                              position: "sticky",
                              left: 0,
                              zIndex: 1,
                              background: "var(--bs-table-bg)",
                            }}
                          >
                            <div className="fw-semibold">{worker.name}</div>
                            <small className="text-muted">
                              {worker.phone || "-"}
                            </small>
                          </th>
                          {days.map((day) => {
                            const date = `${month}-${pad(day)}`;
                            const record = attendanceByWorkerDay.get(
                              `${worker.id}-${date}`
                            );
                            const status = record?.status;

                            return (
                              <td key={day} title={date}>
                                {record ? (
                                  <span
                                    className={`badge ${getStatusClass(status)}`}
                                  >
                                    {status || "Unknown"}
                                  </span>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={daysInMonth + 1} className="text-muted py-4">
                          No workers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Viewattendance;
