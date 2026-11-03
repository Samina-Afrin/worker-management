import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import Layout from "../Layout.jsx";
import axios from "../../Lib/axios";

/* ---------- Helpers ---------- */

const getLocalDate = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const normalize = (v) => String(v || "").trim().toLowerCase();

const toYMD = (value) => {
  if (!value) return "";
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const parsed = new Date(text);
  return isNaN(parsed) ? "" : getLocalDate(parsed);
};

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

// Listattendance / Salarylist er moto: res.data.data (array)
const getRows = (response) => {
  const result = response?.data;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.records)) return result.records;
  return [];
};

// Salarylist er moto: "Paid" chara shob Pending
const salaryState = (salary) =>
  normalize(salary.payment_status) === "paid" ? "Paid" : "Pending";

const attendanceDate = (item) => toYMD(item.date || item.attendance_date);

const attendanceBadge = (status) => {
  const s = normalize(status);
  if (s === "present") return "bg-success";
  if (s === "absent" || s === "a") return "bg-danger";
  if (s.includes("late")) return "bg-warning text-dark";
  return "bg-secondary";
};

/* ---------- Donut chart ---------- */
const CircleChart = ({ paid, unpaid, total }) => {
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const paidLength = total > 0 ? (paid / total) * circumference : 0;
  const unpaidLength = total > 0 ? (unpaid / total) * circumference : 0;
  const percentage = total > 0 ? Math.round((paid / total) * 100) : 0;

  return (
    <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4">
      <div style={{ width: 210, height: 210 }}>
        <svg viewBox="0 0 180 180" width="100%" height="100%">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#e9ecef" strokeWidth="20" />
          {total > 0 && (
            <>
              <circle
                cx="90" cy="90" r={radius} fill="none" stroke="#198754" strokeWidth="20"
                strokeDasharray={`${paidLength} ${circumference}`}
                strokeDashoffset="0"
                transform="rotate(-90 90 90)"
              />
              <circle
                cx="90" cy="90" r={radius} fill="none" stroke="#ffc107" strokeWidth="20"
                strokeDasharray={`${unpaidLength} ${circumference}`}
                strokeDashoffset={-paidLength}
                transform="rotate(-90 90 90)"
              />
            </>
          )}
          <text x="90" y="85" textAnchor="middle" fontSize="25" fontWeight="bold" fill="#212529">
            {percentage}%
          </text>
          <text x="90" y="106" textAnchor="middle" fontSize="11" fill="#6c757d">Paid</text>
        </svg>
      </div>

      <div style={{ minWidth: 190 }}>
        <div className="mb-3">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="rounded-circle" style={{ width: 12, height: 12, background: "#198754" }}></span>
            <span className="text-muted">Paid Salary</span>
          </div>
          <h5 className="mb-0 text-success">৳ {formatMoney(paid)}</h5>
        </div>
        <div className="mb-3">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="rounded-circle" style={{ width: 12, height: 12, background: "#ffc107" }}></span>
            <span className="text-muted">Unpaid Salary</span>
          </div>
          <h5 className="mb-0 text-warning">৳ {formatMoney(unpaid)}</h5>
        </div>
        <div className="border-top pt-2">
          <span className="text-muted">Total Salary</span>
          <h5 className="mb-0">৳ {formatMoney(total)}</h5>
        </div>
      </div>
    </div>
  );
};

/* ---------- Dashboard ---------- */
const Dashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [salaries, setSalaries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [salaryMonth, setSalaryMonth] = useState(getLocalDate().slice(0, 7));

  const fetchDashboardData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);

    const requests = [
      { label: "Workers", url: "workers/index.php", set: setWorkers },
      { label: "Attendance", url: "attendances/index.php", set: setAttendances },
      { label: "Salary", url: "salary/index.php", set: setSalaries },
    ];

    const results = await Promise.allSettled(requests.map((r) => axios.get(r.url)));
    const newErrors = [];

    results.forEach((result, i) => {
      const req = requests[i];
      if (result.status === "fulfilled") {
        if (result.value?.data?.status === false) {
          newErrors.push(`${req.label}: ${result.value.data.message || "API error"}`);
        }
        req.set(getRows(result.value));
      } else {
        console.error(`${req.label} API error:`, result.reason);
        newErrors.push(
          `${req.label}: ${
            result.reason?.response?.data?.message ||
            result.reason?.message ||
            "Could not load"
          } (${req.url})`
        );
      }
    });

    setErrors(newErrors);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboardData(true);
    const interval = setInterval(() => fetchDashboardData(false), 10000);
    const onFocus = () => fetchDashboardData(false);
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchDashboardData]);

  /* ----- Workers ----- */
  const totalWorkers = workers.length;
  const activeWorkers = workers.filter((w) => normalize(w.status) === "active").length;
  const inactiveWorkers = totalWorkers - activeWorkers;

  /* ----- Attendance for selected date ----- */
  const dayAttendances = useMemo(
    () => attendances.filter((a) => attendanceDate(a) === selectedDate),
    [attendances, selectedDate]
  );

  const present = dayAttendances.filter((a) => normalize(a.status) === "present").length;
  const absent = dayAttendances.filter((a) => ["absent", "a"].includes(normalize(a.status))).length;
  const late = dayAttendances.filter((a) => normalize(a.status).includes("late")).length;
  const marked = present + absent + late;
  const attendancePercentage = marked > 0 ? Math.round(((present + late) / marked) * 100) : 0;

  // Latest attendance date (jodi selected date e kichu na thake)
  const latestAttendanceDate = useMemo(() => {
    const dates = attendances.map(attendanceDate).filter(Boolean).sort();
    return dates.length ? dates[dates.length - 1] : "";
  }, [attendances]);

  /* ----- Salary (selected month) ----- */
  const monthSalaries = useMemo(
    () => salaries.filter((s) => toYMD(s.salary_date).slice(0, 7) === salaryMonth),
    [salaries, salaryMonth]
  );

  const salaryReport = useMemo(() => {
    let paid = 0;
    let unpaid = 0;
    const unpaidWorkers = new Set();

    monthSalaries.forEach((s) => {
      const amount = Number(s.net_salary || 0);
      if (salaryState(s) === "Paid") paid += amount;
      else {
        unpaid += amount;
        unpaidWorkers.add(String(s.worker_id));
      }
    });

    return {
      paid,
      unpaid,
      total: paid + unpaid,
      records: monthSalaries.length,
      unpaidEmployees: unpaidWorkers.size,
    };
  }, [monthSalaries]);

  // Selected date er salary (worker per day 1 kaj)
  const daySalary = useMemo(
    () =>
      salaries
        .filter((s) => toYMD(s.salary_date) === selectedDate)
        .reduce((sum, s) => sum + Number(s.net_salary || 0), 0),
    [salaries, selectedDate]
  );

  // Latest salary month (jodi selected month e kichu na thake)
  const latestSalaryMonth = useMemo(() => {
    const months = salaries.map((s) => toYMD(s.salary_date).slice(0, 7)).filter(Boolean).sort();
    return months.length ? months[months.length - 1] : "";
  }, [salaries]);

  /* ----- Recent lists ----- */
  const recentWorkers = useMemo(() => [...workers].slice(-5).reverse(), [workers]);

  const recentAttendances = useMemo(() => {
    return [...attendances]
      .sort((a, b) => {
        const da = new Date(`${attendanceDate(a) || "2000-01-01"} ${a.in_time || "00:00:00"}`);
        const db = new Date(`${attendanceDate(b) || "2000-01-01"} ${b.in_time || "00:00:00"}`);
        return db - da;
      })
      .slice(0, 5);
  }, [attendances]);

  const stats = [
    { title: "Total Workers", value: totalWorkers, icon: "bi-people-fill", color: "primary" },
    { title: "Active Workers", value: activeWorkers, icon: "bi-person-check-fill", color: "success" },
    { title: "Present", value: present, icon: "bi-calendar-check-fill", color: "info" },
    { title: "Absent", value: absent, icon: "bi-calendar-x-fill", color: "danger" },
    { title: "Late", value: late, icon: "bi-clock-fill", color: "warning" },
    { title: `Salary on ${selectedDate}`, value: `৳ ${formatMoney(daySalary)}`, icon: "bi-cash", color: "primary" },
    { title: `Salary (${salaryMonth})`, value: `৳ ${formatMoney(salaryReport.total)}`, icon: "bi-cash-stack", color: "success" },
    { title: "Unpaid Employees", value: salaryReport.unpaidEmployees, icon: "bi-exclamation-circle-fill", color: "danger" },
  ];

  return (
    <Layout>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
          <div>
            <h3 className="mb-1">Dashboard</h3>
            <p className="text-muted mb-0">
              A smarter way to manage workers, attendance, and salaries.
            </p>
            <small className="text-muted">Last updated: {lastUpdated.toLocaleTimeString()}</small>
          </div>

          <div className="d-flex flex-wrap align-items-end gap-2">
            <div>
              <label className="form-label small mb-1">Attendance date</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label small mb-1">Salary month</label>
              <input
                type="month"
                className="form-control"
                value={salaryMonth}
                onChange={(e) => e.target.value && setSalaryMonth(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => fetchDashboardData(true)}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* API errors */}
        {errors.length > 0 && (
          <div className="alert alert-danger">
            <strong>Data load hoyni:</strong>
            <ul className="mb-0">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Hints when selected date / month is empty */}
        {!loading && attendances.length > 0 && marked === 0 && latestAttendanceDate && (
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <span>{selectedDate} date e kono attendance nai. Latest attendance: {latestAttendanceDate}</span>
            <button className="btn btn-sm btn-info text-white" onClick={() => setSelectedDate(latestAttendanceDate)}>
              Show {latestAttendanceDate}
            </button>
          </div>
        )}

        {!loading && salaries.length > 0 && salaryReport.records === 0 && latestSalaryMonth && (
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <span>{salaryMonth} mashe kono salary record nai. Latest salary month: {latestSalaryMonth}</span>
            <button className="btn btn-sm btn-info text-white" onClick={() => setSalaryMonth(latestSalaryMonth)}>
              Show {latestSalaryMonth}
            </button>
          </div>
        )}

        {/* Stat cards */}
        <div className="row g-3 mb-4">
          {stats.map((item, index) => (
            <div className="col-xl-3 col-md-6" key={index}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <p className="text-muted mb-2">{item.title}</p>
                    <h3 className="mb-0">{loading ? "..." : item.value}</h3>
                  </div>
                  <div
                    className={`bg-${item.color} bg-opacity-10 text-${item.color} rounded-circle d-flex align-items-center justify-content-center`}
                    style={{ width: 55, height: 55 }}
                  >
                    <i className={`bi ${item.icon} fs-4`}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Attendance overview + worker summary */}
        <div className="row g-3 mb-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Attendance Overview</h5>
                <span className="badge bg-primary">{selectedDate}</span>
              </div>
              <div className="card-body">
                {marked === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-calendar-x text-muted fs-1"></i>
                    <h6 className="mt-3">No attendance records for this date</h6>
                    <Link to="/attendance/add" className="btn btn-sm btn-outline-primary mt-2">
                      Add attendance
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Attendance percentage</span>
                      <strong>{attendancePercentage}%</strong>
                    </div>
                    <div className="progress mb-4" style={{ height: 12 }}>
                      <div className="progress-bar bg-success" style={{ width: `${attendancePercentage}%` }}></div>
                    </div>
                    <div className="row text-center g-3">
                      <div className="col-4">
                        <h3 className="text-success mb-1">{present}</h3>
                        <span className="text-muted">Present</span>
                      </div>
                      <div className="col-4">
                        <h3 className="text-danger mb-1">{absent}</h3>
                        <span className="text-muted">Absent</span>
                      </div>
                      <div className="col-4">
                        <h3 className="text-warning mb-1">{late}</h3>
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
                <div className="progress mb-3" style={{ height: 10 }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${totalWorkers ? (activeWorkers / totalWorkers) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-success"><i className="bi bi-circle-fill me-2"></i>Active Workers</span>
                  <strong>{activeWorkers}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-danger"><i className="bi bi-circle-fill me-2"></i>Inactive Workers</span>
                  <strong>{inactiveWorkers}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Salary report */}
        <div className="row g-3 mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">Salary Report</h5>
                  <small className="text-muted">Paid and unpaid salary for {salaryMonth}</small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge bg-primary">{salaryReport.records} Records</span>
                  <Link to="/salary" className="btn btn-sm btn-outline-primary">View salaries</Link>
                </div>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : salaryReport.records === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-pie-chart text-muted fs-1"></i>
                    <h6 className="mt-3">No salary data for this month</h6>
                  </div>
                ) : (
                  <CircleChart paid={salaryReport.paid} unpaid={salaryReport.unpaid} total={salaryReport.total} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent workers + attendance */}
        <div className="row g-3 mb-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Workers</h5>
                <span className="badge bg-primary">{workers.length} Workers</span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr><th>Name</th><th>Phone</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {recentWorkers.length > 0 ? (
                        recentWorkers.map((w, i) => (
                          <tr key={w.id || w.worker_id || i}>
                            <td>{w.name || "N/A"}</td>
                            <td>{w.phone || "N/A"}</td>
                            <td>
                              <span className={`badge ${normalize(w.status) === "active" ? "bg-success" : "bg-secondary"}`}>
                                {w.status || "N/A"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="3" className="text-center py-4 text-muted">No workers found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Attendance</h5>
                <Link to="/attendance" className="btn btn-sm btn-outline-primary">View all</Link>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr><th>Worker</th><th>Date</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {recentAttendances.length > 0 ? (
                        recentAttendances.map((item, i) => (
                          <tr key={item.id || i}>
                            <td>{item.name || item.worker_name || "N/A"}</td>
                            <td>{attendanceDate(item) || "N/A"}</td>
                            <td>
                              <span className={`badge ${attendanceBadge(item.status)}`}>
                                {item.status || "N/A"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="3" className="text-center py-4 text-muted">No attendance records found</td></tr>
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
