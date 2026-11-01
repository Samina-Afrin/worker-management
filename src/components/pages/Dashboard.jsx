
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "../Layout.jsx";
import axios from "../../Lib/axios";

// Circle / Donut Chart
const CircleChart = ({ paid, unpaid, total }) => {
  const radius = 75;
  const circumference = 2 * Math.PI * radius;

  const paidLength = total > 0 ? (paid / total) * circumference : 0;
  const unpaidLength = total > 0 ? (unpaid / total) * circumference : 0;

  const percentage =
    total > 0 ? Math.round((paid / total) * 100) : 0;

  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4">
      <div style={{ width: 210, height: 210, position: "relative" }}>
        <svg viewBox="0 0 180 180" width="100%" height="100%">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#e9ecef"
            strokeWidth="20"
          />

          {total > 0 && (
            <>
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#198754"
                strokeWidth="20"
                strokeDasharray={`${paidLength} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="butt"
                transform="rotate(-90 90 90)"
              />

              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#ffc107"
                strokeWidth="20"
                strokeDasharray={`${unpaidLength} ${circumference}`}
                strokeDashoffset={-paidLength}
                strokeLinecap="butt"
                transform="rotate(-90 90 90)"
              />
            </>
          )}

          <text
            x="90"
            y="85"
            textAnchor="middle"
            fontSize="25"
            fontWeight="bold"
            fill="#212529"
          >
            {percentage}%
          </text>

          <text
            x="90"
            y="106"
            textAnchor="middle"
            fontSize="11"
            fill="#6c757d"
          >
            Paid
          </text>
        </svg>
      </div>

      <div style={{ minWidth: "190px" }}>
        <div className="mb-3">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span
              className="rounded-circle"
              style={{
                width: 12,
                height: 12,
                background: "#198754",
              }}
            ></span>
            <span className="text-muted">Paid Salary</span>
          </div>
          <h5 className="mb-0 text-success">
            ৳ {Number(paid).toLocaleString("en-BD")}
          </h5>
        </div>

        <div className="mb-3">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span
              className="rounded-circle"
              style={{
                width: 12,
                height: 12,
                background: "#ffc107",
              }}
            ></span>
            <span className="text-muted">Unpaid Salary</span>
          </div>
          <h5 className="mb-0 text-warning">
            ৳ {Number(unpaid).toLocaleString("en-BD")}
          </h5>
        </div>

        <div className="border-top pt-2">
          <span className="text-muted">Total Salary</span>
          <h5 className="mb-0">
            ৳ {Number(total).toLocaleString("en-BD")}
          </h5>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [salaries, setSalaries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // API response theke array ber korbe
  const getRows = (response) => {
    const result = response?.data;

    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.records)) return result.records;

    return [];
  };

  // Local date: YYYY-MM-DD
  const getLocalDate = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString("en-BD");
  };

  // Dashboard API fetch
  const fetchDashboardData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);

    try {
      const results = await Promise.allSettled([
        axios.get("workers/index.php"),
        axios.get("attendances/index.php"),
        axios.get("salary/index.php"),
      ]);

      if (results[0].status === "fulfilled") {
        setWorkers(getRows(results[0].value));
      } else {
        console.error("Worker API error:", results[0].reason);
      }

      if (results[1].status === "fulfilled") {
        setAttendances(getRows(results[1].value));
      } else {
        console.error("Attendance API error:", results[1].reason);
      }

      if (results[2].status === "fulfilled") {
        setSalaries(getRows(results[2].value));
      } else {
        console.error("Salary API error:", results[2].reason);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Dashboard data loading error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(true);

    // 10 second por por dashboard update
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 10000);

    const handleFocus = () => fetchDashboardData(false);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchDashboardData(false);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchDashboardData]);

  // Worker statistics
  const totalWorkers = workers.length;

  const activeWorkers = workers.filter(
    (worker) =>
      String(worker.status || "").toLowerCase() === "active"
  ).length;

  const inactiveWorkers = totalWorkers - activeWorkers;

  // Today's attendance
  const today = getLocalDate();

  const todayAttendances = attendances.filter(
    (item) => String(item.date || "").slice(0, 10) === today
  );

  const todayPresent = todayAttendances.filter(
    (item) => String(item.status || "").toLowerCase() === "present"
  ).length;

  const todayAbsent = todayAttendances.filter(
    (item) => String(item.status || "").toLowerCase() === "absent"
  ).length;

  const todayLate = todayAttendances.filter(
    (item) => String(item.status || "").toLowerCase() === "late"
  ).length;

  const attendanceTotal =
    todayPresent + todayAbsent + todayLate;

  const attendancePercentage =
    attendanceTotal > 0
      ? Math.round((todayPresent / attendanceTotal) * 100)
      : 0;

  // Current month salary
  const currentMonth = today.slice(0, 7);

  const currentMonthSalary = salaries
    .filter((salary) => {
      const salaryDate = String(salary.salary_date || "").slice(0, 10);

      return salaryDate.slice(0, 7) === currentMonth;
    })
    .reduce(
      (total, salary) => total + Number(salary.net_salary || 0),
      0
    );

  // Salary Report: Paid and Unpaid
  const salaryReport = useMemo(() => {
    let paid = 0;
    let unpaid = 0;

    salaries.forEach((salary) => {
      const amount = Number(salary.net_salary || 0);

      if (
        String(salary.payment_status || "").toLowerCase() === "paid"
      ) {
        paid += amount;
      } else {
        unpaid += amount;
      }
    });

    return {
      paid,
      unpaid,
      total: paid + unpaid,
      records: salaries.length,
    };
  }, [salaries]);

  // Recent workers
  const recentWorkers = useMemo(() => {
    return [...workers].slice(-5).reverse();
  }, [workers]);

  // Recent attendance
  const recentAttendances = useMemo(() => {
    return [...attendances]
      .sort((a, b) => {
        const dateA = new Date(
          `${a.date || "2000-01-01"} ${a.in_time || "00:00:00"}`
        );

        const dateB = new Date(
          `${b.date || "2000-01-01"} ${b.in_time || "00:00:00"}`
        );

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [attendances]);

  const stats = [
    {
      title: "Total Workers",
      value: totalWorkers,
      icon: "bi-people-fill",
      color: "primary",
    },
    {
      title: "Active Workers",
      value: activeWorkers,
      icon: "bi-person-check-fill",
      color: "success",
    },
    {
      title: "Today's Present",
      value: todayPresent,
      icon: "bi-calendar-check-fill",
      color: "info",
    },
    {
      title: "Today's Absent",
      value: todayAbsent,
      icon: "bi-calendar-x-fill",
      color: "danger",
    },
    {
      title: "Today's Late",
      value: todayLate,
      icon: "bi-clock-fill",
      color: "warning",
    },
    {
      title: "Current Month Salary",
      value: `৳ ${formatMoney(currentMonthSalary)}`,
      icon: "bi-cash-stack",
      color: "success",
    },
  ];

  return (
    <Layout>
      <div className="container-fluid">

        {/* Dashboard Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h3 className="mb-1">Dashboard</h3>
            <p className="text-muted mb-0">
              A smarter way to manage workers, attendance, and salaries.
            </p>
            <small className="text-muted">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </small>
          </div>

          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={() => fetchDashboardData(true)}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="row g-3 mb-4">
          {stats.map((item, index) => (
            <div className="col-xl-4 col-md-6" key={index}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <p className="text-muted mb-2">{item.title}</p>
                    <h3 className="mb-0">
                      {loading ? "..." : item.value}
                    </h3>
                  </div>

                  <div
                    className={`bg-${item.color} bg-opacity-10 text-${item.color} rounded-circle d-flex align-items-center justify-content-center`}
                    style={{ width: "55px", height: "55px" }}
                  >
                    <i className={`bi ${item.icon} fs-4`}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Attendance Overview and Worker Summary */}
        <div className="row g-3 mb-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Attendance Overview</h5>
                <span className="badge bg-primary">{today}</span>
              </div>

              <div className="card-body">
                {attendanceTotal === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-calendar-x text-muted fs-1"></i>
                    <h6 className="mt-3">No attendance records yet</h6>
                    <p className="text-muted mb-0">
                      Today's attendance data will appear here after attendance is added.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">
                        Present percentage
                      </span>
                      <strong>{attendancePercentage}%</strong>
                    </div>

                    <div className="progress mb-4" style={{ height: "12px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${attendancePercentage}%` }}
                      ></div>
                    </div>

                    <div className="row text-center g-3">
                      <div className="col-4">
                        <h3 className="text-success mb-1">{todayPresent}</h3>
                        <span className="text-muted">Present</span>
                      </div>

                      <div className="col-4">
                        <h3 className="text-danger mb-1">{todayAbsent}</h3>
                        <span className="text-muted">Absent</span>
                      </div>

                      <div className="col-4">
                        <h3 className="text-warning mb-1">{todayLate}</h3>
                        <span className="text-muted">Late</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white">
                <h5 className="mb-0">Worker Summary</h5>
              </div>

              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <span>Total Workers</span>
                  <strong>{loading ? "..." : totalWorkers}</strong>
                </div>

                <div className="progress mb-3" style={{ height: "10px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{
                      width: `${
                        totalWorkers
                          ? (activeWorkers / totalWorkers) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-success">
                    <i className="bi bi-circle-fill me-2"></i>
                    Active Workers
                  </span>
                  <strong>{activeWorkers}</strong>
                </div>

                <div className="d-flex justify-content-between">
                  <span className="text-danger">
                    <i className="bi bi-circle-fill me-2"></i>
                    Inactive Workers
                  </span>
                  <strong>{inactiveWorkers}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Report Circle Diagram */}
        <div className="row g-3 mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Salary Report</h5>
                  <small className="text-muted">
                    Paid and unpaid salary overview
                  </small>
                </div>

                <span className="badge bg-primary">
                  {salaryReport.records} Records
                </span>
              </div>

              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="text-muted mt-2 mb-0">
                      Loading salary report...
                    </p>
                  </div>
                ) : salaryReport.records === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-pie-chart text-muted fs-1"></i>
                    <h6 className="mt-3">No salary report data available</h6>
                    <p className="text-muted mb-0">
                      Salary records will appear here after adding salary data.
                    </p>
                  </div>
                ) : (
                  <CircleChart
                    paid={salaryReport.paid}
                    unpaid={salaryReport.unpaid}
                    total={salaryReport.total}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Workers and Attendance */}
        <div className="row g-3 mb-4">

          {/* Recent Workers */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Workers</h5>
                <span className="badge bg-primary">
                  {workers.length} Workers
                </span>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentWorkers.length > 0 ? (
                        recentWorkers.map((worker, index) => (
                          <tr key={worker.id || worker.worker_id || index}>
                            <td>{worker.name || "N/A"}</td>
                            <td>{worker.phone || "N/A"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  String(worker.status || "").toLowerCase() === "active"
                                    ? "bg-success"
                                    : "bg-secondary"
                                }`}
                              >
                                {worker.status || "N/A"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="text-center py-4 text-muted"
                          >
                            No workers found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Attendance */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white">
                <h5 className="mb-0">Recent Attendance</h5>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Worker</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentAttendances.length > 0 ? (
                        recentAttendances.map((item, index) => (
                          <tr key={item.id || index}>
                            <td>{item.name || "N/A"}</td>
                            <td>{item.date || "N/A"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  String(item.status || "").toLowerCase() === "present"
                                    ? "bg-success"
                                    : String(item.status || "").toLowerCase() === "absent"
                                    ? "bg-danger"
                                    : String(item.status || "").toLowerCase() === "late"
                                    ? "bg-warning text-dark"
                                    : "bg-secondary"
                                }`}
                              >
                                {item.status || "N/A"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="text-center py-4 text-muted"
                          >
                            No attendance records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
