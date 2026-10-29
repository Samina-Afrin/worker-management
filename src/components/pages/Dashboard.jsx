
import React, { useEffect, useState } from "react";
import Layout from "../Layout.jsx";
import axios from "../../Lib/axios";

const Dashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const currentMonth = todayString.slice(0, 7);

  // API response theke array ber kora
  const getRows = (response) => {
    const data = response?.data?.data ?? response?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const getDate = (item) =>
    String(item?.date ?? item?.attendance_date ?? item?.salary_date ??
      item?.payment_date ?? item?.created_at ?? item?.createdAt ?? "").slice(0, 10);

  const getWorkerName = (item) =>
    item?.worker_name ??
    item?.name ??
    item?.employee_name ??
    item?.worker?.name ??
    `Worker #${item?.worker_id ?? item?.id ?? ""}`;

  const getSalaryAmount = (item) =>
    Number(
      item?.net_salary ??
      item?.netSalary ??
      item?.salary_amount ??
      item?.amount ??
      item?.basic_salary ??
      item?.basicSalary ??
      0
    ) || 0;

  const money = (amount) =>
    "৳ " + Number(amount || 0).toLocaleString("en-BD", {
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const results = await Promise.allSettled([
          axios.get("workers/index.php"),
          axios.get("attendance/index.php"),
          axios.get("salary/index.php"),
        ]);

        const [workerResult, attendanceResult, salaryResult] = results;

        if (workerResult.status === "fulfilled") {
          setWorkers(getRows(workerResult.value));
        } else {
          console.error("Workers API error:", workerResult.reason);
        }

        if (attendanceResult.status === "fulfilled") {
          setAttendance(getRows(attendanceResult.value));
        } else {
          console.error("Attendance API error:", attendanceResult.reason);
        }

        if (salaryResult.status === "fulfilled") {
          setSalaries(getRows(salaryResult.value));
        } else {
          console.error("Salary API error:", salaryResult.reason);
        }

        if (results.every((result) => result.status === "rejected")) {
          setError("Dashboard data load hoyni. API endpoint check koro.");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Dashboard data load korte problem hoyeche.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Worker statistics
  const activeWorkers = workers.filter(
    (worker) =>
      String(worker.status ?? "").toLowerCase() === "active"
  ).length;

  // Today's attendance only
  const todayAttendance = attendance.filter(
    (item) => getDate(item) === todayString
  );

  const presentCount = todayAttendance.filter(
    (item) => String(item.status ?? "").toLowerCase() === "present"
  ).length;

  const absentCount = todayAttendance.filter(
    (item) => String(item.status ?? "").toLowerCase() === "absent"
  ).length;

  const lateCount = todayAttendance.filter(
    (item) => String(item.status ?? "").toLowerCase() === "late"
  ).length;

  // Current month salary
  const monthSalaries = salaries.filter((item) => {
    const date = getDate(item);
    const month = item?.month;

    return (
      date.startsWith(currentMonth) ||
      (String(month ?? "").slice(0, 7) === currentMonth)
    );
  });

  const monthlySalary = monthSalaries.reduce(
    (total, item) => total + getSalaryAmount(item),
    0
  );

  // Recent workers: latest IDs first
  const recentWorkers = [...workers]
    .sort((a, b) => Number(b.id ?? b.worker_id ?? 0) -
      Number(a.id ?? a.worker_id ?? 0))
    .slice(0, 5);

  // Recent activity based on available database records
  const recentActivities = [
    ...workers.map((item) => ({
      title: "Worker Record",
      description: `${getWorkerName(item)} - worker information`,
      date: getDate(item),
      icon: "bi-person-plus-fill",
      color: "success",
    })),
    ...todayAttendance.map((item) => ({
      title: "Attendance Recorded",
      description: `${getWorkerName(item)} - ${item.status ?? "Attendance"}`,
      date: getDate(item),
      icon: "bi-calendar-check-fill",
      color: "primary",
    })),
    ...monthSalaries.map((item) => ({
      title: "Salary Record",
      description: `${getWorkerName(item)} - ${money(getSalaryAmount(item))}`,
      date: getDate(item),
      icon: "bi-cash-stack",
      color: "info",
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const stats = [
    {
      title: "Total Workers",
      value: workers.length,
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
      value: presentCount,
      icon: "bi-calendar-check-fill",
      color: "info",
    },
    {
      title: "Today's Absent",
      value: absentCount,
      icon: "bi-calendar-x-fill",
      color: "danger",
    },
    {
      title: "Today's Late",
      value: lateCount,
      icon: "bi-clock-fill",
      color: "warning",
    },
    {
      title: "Current Month Salary",
      value: money(monthlySalary),
      icon: "bi-cash-stack",
      color: "success",
    },
  ];

  const attendanceChart = [
    { label: "Present", value: presentCount, color: "#198754" },
    { label: "Absent", value: absentCount, color: "#dc3545" },
    { label: "Late", value: lateCount, color: "#ffc107" },
  ];

  const maxAttendance = Math.max(
    ...attendanceChart.map((item) => item.value),
    1
  );

  return (
    <Layout>
      <div className="container-fluid py-3">
        <div className="mb-4">
          <h2>Worker Management Dashboard</h2>
          <p className="text-muted">
            Overview of workers, attendance and salary
          </p>
        </div>

        {loading && (
          <div className="alert alert-info">Loading dashboard data...</div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {/* Statistics */}
        <div className="row g-3">
          {stats.map((item) => (
            <div className="col-12 col-sm-6 col-xl-4" key={item.title}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-2">{item.title}</p>
                    <h3 className="mb-0">{loading ? "..." : item.value}</h3>
                  </div>
                  <div className={`text-${item.color} fs-1`}>
                    <i className={`bi ${item.icon}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Attendance chart */}
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">Today's Attendance Overview</h5>
          </div>

          <div className="card-body">
            <div
              className="d-flex justify-content-around align-items-end gap-4"
              style={{ height: "250px" }}
            >
              {attendanceChart.map((item) => (
                <div
                  key={item.label}
                  className="d-flex flex-column align-items-center justify-content-end h-100 flex-fill"
                >
                  <strong className="mb-2">{item.value}</strong>
                  <div
                    title={`${item.label}: ${item.value}`}
                    style={{
                      width: "100%",
                      maxWidth: "100px",
                      height: `${(item.value / maxAttendance) * 170}px`,
                      minHeight: "8px",
                      backgroundColor: item.color,
                      borderRadius: "6px 6px 0 0",
                    }}
                  />
                  <span className="mt-2 text-muted">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent workers */}
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">Recent Workers</h5>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Worker Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {!loading && recentWorkers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No workers found
                    </td>
                  </tr>
                )}

                {recentWorkers.map((worker, index) => (
                  <tr key={worker.id ?? worker.worker_id ?? index}>
                    <td>{getWorkerName(worker)}</td>
                    <td>
                      {worker.department_name ??
                        worker.department?.name ??
                        worker.department ??
                        "-"}
                    </td>
                    <td>
                      {worker.designation_name ??
                        worker.designation?.name ??
                        worker.designation ??
                        "-"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          String(worker.status).toLowerCase() === "active"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {worker.status ?? "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent activities */}
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">Recent Activities</h5>
          </div>

          <div className="card-body">
            {!loading && recentActivities.length === 0 && (
              <p className="text-muted mb-0">No recent records found.</p>
            )}

            {recentActivities.map((activity, index) => (
              <div
                key={`${activity.title}-${index}`}
                className="d-flex align-items-start gap-3 mb-4"
              >
                <div className={`text-${activity.color} fs-4`}>
                  <i className={`bi ${activity.icon}`} />
                </div>

                <div className="flex-grow-1">
                  <h6 className="mb-1">{activity.title}</h6>
                  <p className="text-muted mb-1">
                    {activity.description}
                  </p>
                  <small className="text-muted">
                    {activity.date || "Date unavailable"}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
