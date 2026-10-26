import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const getCurrentDate = () => new Date().toLocaleDateString("en-GB");

const Salaryview = () => {
  const { id: workerId } = useParams();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [updatingSalary, setUpdatingSalary] = useState("");

  useEffect(() => {
    let active = true;
    const fetchSalaries = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `salary/worker.php?worker_id=${encodeURIComponent(workerId)}`
        );
        if (!active) return;
        if (response?.data?.status !== true) {
          throw new Error(response?.data?.message || "Could not load employee salaries.");
        }
        setSalaries(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (fetchError) {
        if (!active) return;
        console.error("Failed to fetch employee salaries:", fetchError);
        setSalaries([]);
        setError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            "Failed to load employee salaries."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSalaries();
    return () => {
      active = false;
    };
  }, [workerId]);

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getSalaryDate = (salary) => {
    if (salary.salary_date) return String(salary.salary_date).slice(0, 10);
    return salary.month && salary.year
      ? `Legacy record: ${salary.month}/${salary.year}`
      : "N/A";
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const printPayslip = (salary) => {
    const paid = salary.payment_status === "Paid";
    const salaryDate = getSalaryDate(salary);
    const presentDays = Number(salary.present_days ?? 1);
    const deduction = Number(salary.deduction || 0);
    const netSalary = Number(salary.net_salary || 0);
    const grossEarnings = netSalary + deduction;
    const employeeName = salary.worker_name || `Worker ${workerId}`;
    const printedDate = getCurrentDate();
    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Payslip - ${escapeHtml(employeeName)}</title>
  <style>
    @page { size: A4 portrait; margin: 18mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #172033; font-family: Arial, Helvetica, sans-serif; font-size: 12px; }
    .payslip { max-width: 700px; margin: 0 auto; border: 1px solid #d8dee9; }
    .header { padding: 28px 32px 24px; color: #fff; background: #16324f; }
    .company { margin: 0; font-size: 22px; letter-spacing: 1.5px; text-transform: uppercase; }
    .company-detail { margin: 6px 0 0; color: #d6e0ea; font-size: 11px; }
    .document-title { margin-top: 24px; font-size: 18px; font-weight: 700; letter-spacing: 2px; }
    .document-subtitle { margin: 4px 0 0; color: #d6e0ea; }
    .content { padding: 28px 32px 32px; }
    .section-title { margin: 0 0 12px; color: #16324f; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
    .employee { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; padding-bottom: 22px; }
    .field-label { display: block; margin-bottom: 4px; color: #68778a; font-size: 10px; text-transform: uppercase; }
    .field-value { font-size: 13px; font-weight: 600; }
    .status { display: inline-block; padding: 5px 10px; border: 1px solid ${paid ? "#9ac9ad" : "#e5c77b"}; border-radius: 20px; color: ${paid ? "#216b3a" : "#805b08"}; background: ${paid ? "#edf8f0" : "#fff8e5"}; font-size: 10px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 11px 12px; border: 1px solid #d8dee9; text-align: left; }
    th { color: #526175; background: #f3f6f9; font-size: 10px; letter-spacing: .5px; text-transform: uppercase; }
    td.amount { text-align: right; font-variant-numeric: tabular-nums; }
    .total-row td { color: #16324f; background: #f3f6f9; font-weight: 700; }
    .net-pay { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding: 16px 18px; color: #fff; background: #16324f; }
    .net-pay-label { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }
    .net-pay-amount { font-size: 20px; font-weight: 700; }
    .note { margin: 12px 0 0; color: #68778a; font-size: 10px; }
    .signatures { display: flex; justify-content: space-between; gap: 28px; margin-top: 64px; }
    .signature { width: 42%; padding-top: 8px; border-top: 1px solid #7c8795; color: #526175; text-align: center; font-size: 10px; }
    .footer { padding: 12px 32px; border-top: 1px solid #d8dee9; color: #68778a; font-size: 9px; text-align: right; }
    @media print { .payslip { border: 0; } }
  </style>
</head>
<body>
  <article class="payslip">
    <header class="header">
      <h1 class="company">Work Nest Bangladesh</h1>
      <p class="company-detail">2no Gate, Chattogram Bangladesh</p>
      <div class="document-title">SALARY PAYSLIP</div>
      <p class="document-subtitle">Confidential employee payroll statement</p>
    </header>
    <main class="content">
      <h2 class="section-title">Employee &amp; payroll details</h2>
      <section class="employee">
        <div><span class="field-label">Employee name</span><span class="field-value">${escapeHtml(employeeName)}</span></div>
        <div><span class="field-label">Employee ID</span><span class="field-value">EMP-${escapeHtml(String(salary.worker_id ?? workerId).padStart(3, "0"))}</span></div>
        <div><span class="field-label">Salary date</span><span class="field-value">${escapeHtml(salaryDate)}</span></div>
        <div><span class="field-label">Payslip reference</span><span class="field-value">PAY-${escapeHtml(salary.id)}</span></div>
        <div><span class="field-label">Payment status</span><span class="status">${paid ? "PAID" : "UNPAID"}</span></div>
        <div><span class="field-label">Present days</span><span class="field-value">${escapeHtml(presentDays)}</span></div>
      </section>
      <h2 class="section-title">Salary breakdown</h2>
      <table>
        <thead><tr><th>Description</th><th>Calculation</th><th class="amount">Amount (BDT)</th></tr></thead>
        <tbody>
          <tr><td>Salary before deductions</td><td>Net salary + deductions</td><td class="amount">৳ ${formatMoney(grossEarnings)}</td></tr>
          <tr><td>Deduction</td><td>Salary adjustment</td><td class="amount">− ৳ ${formatMoney(deduction)}</td></tr>
          <tr class="total-row"><td colspan="2">Net salary</td><td class="amount">৳ ${formatMoney(netSalary)}</td></tr>
        </tbody>
      </table>
      <div class="net-pay"><span class="net-pay-label">Net amount payable</span><span class="net-pay-amount">৳ ${formatMoney(netSalary)}</span></div>
      <p class="note">This payslip is generated for payroll record-keeping. Please contact the accounts department for any discrepancy.</p>
      <div class="signatures"><div class="signature">Employee signature</div><div class="signature">Authorized signature</div></div>
    </main>
    <footer class="footer">Generated on ${escapeHtml(printedDate)} · This is a computer-generated document</footer>
  </article>
</body>
</html>`;

    const iframe = document.createElement("iframe");
    iframe.title = "Payslip print preview";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const printWindow = iframe.contentWindow;
    if (!printWindow) {
      document.body.removeChild(iframe);
      throw new Error("Could not open the payslip print preview.");
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      window.setTimeout(() => {
        if (iframe.isConnected) document.body.removeChild(iframe);
      }, 1000);
    };
  };

  const employeeName = salaries[0]?.worker_name || `Worker ${workerId}`;
  const filteredSalaries = useMemo(() => {
    const query = search.trim().toLowerCase();
    return salaries.filter((salary) => {
      const status = salary.payment_status === "Paid" ? "Paid" : "Pending";
      const date = salary.salary_date
        ? String(salary.salary_date).slice(0, 10)
        : "";
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      const matchesFrom = !fromDate || (date && date >= fromDate);
      const matchesTo = !toDate || (date && date <= toDate);
      const matchesSearch =
        !query ||
        getSalaryDate(salary).toLowerCase().includes(query) ||
        status.toLowerCase().includes(query);

      return matchesStatus && matchesFrom && matchesTo && matchesSearch;
    });
  }, [fromDate, salaries, search, statusFilter, toDate]);

  const paidTotal = filteredSalaries
    .filter((salary) => salary.payment_status === "Paid")
    .reduce((total, salary) => total + Number(salary.net_salary || 0), 0);
  const unpaidTotal = filteredSalaries
    .filter((salary) => salary.payment_status !== "Paid")
    .reduce((total, salary) => total + Number(salary.net_salary || 0), 0);

  const clearFilters = () => {
    setStatusFilter("All");
    setFromDate("");
    setToDate("");
    setSearch("");
  };

  const updatePaymentStatus = async (salary) => {
    const nextStatus = salary.payment_status === "Paid" ? "Pending" : "Paid";
    setUpdatingSalary(String(salary.id));
    setError("");

    try {
      const data = new FormData();
      data.append("salary_id", salary.id);
      data.append("payment_status", nextStatus);
      const response = await axios.post("salary/payment-status.php", data);
      if (response?.data?.status !== true) {
        throw new Error(response?.data?.message || "Could not update payment status.");
      }

      setSalaries((current) =>
        current.map((item) =>
          String(item.id) === String(salary.id)
            ? { ...item, payment_status: nextStatus }
            : item
        )
      );
    } catch (updateError) {
      console.error("Failed to update salary payment status:", updateError);
      setError(
        updateError.response?.data?.message ||
          updateError.message ||
          "Failed to update payment status."
      );
    } finally {
      setUpdatingSalary("");
    }
  };

  return (
    <Layout>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <div>
            <h3 className="mb-1">{employeeName}</h3>
            <p className="text-muted mb-0">All paid and unpaid daily salary records</p>
          </div>
          <Link to="/salary" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i>
            Back to salaries
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card border-success h-100">
              <div className="card-body">
                <div className="text-secondary">Paid total (filtered)</div>
                <h4 className="text-success mb-0">৳ {formatMoney(paidTotal)}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-warning h-100">
              <div className="card-body">
                <div className="text-secondary">Unpaid total (filtered)</div>
                <h4 className="text-warning-emphasis mb-0">৳ {formatMoney(unpaidTotal)}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row g-3 align-items-end mb-4">
              <div className="col-lg-3 col-md-6">
                <label className="form-label" htmlFor="record-status">Payment status</label>
                <select
                  id="record-status"
                  className="form-select"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="All">All statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Unpaid</option>
                </select>
              </div>
              <div className="col-lg-3 col-md-6">
                <label className="form-label" htmlFor="record-from-date">From date</label>
                <input
                  id="record-from-date"
                  type="date"
                  className="form-control"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(event) => setFromDate(event.target.value)}
                />
              </div>
              <div className="col-lg-3 col-md-6">
                <label className="form-label" htmlFor="record-to-date">To date</label>
                <input
                  id="record-to-date"
                  type="date"
                  className="form-control"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(event) => setToDate(event.target.value)}
                />
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label" htmlFor="record-search">Search date/status</label>
                <input
                  id="record-search"
                  type="search"
                  className="form-control"
                  placeholder="Date or status..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="col-lg-1">
                <button type="button" className="btn btn-outline-secondary w-100" onClick={clearFilters} title="Clear filters">
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <h5 className="mb-0">Salary history</h5>
              <span className="badge bg-primary">Records: {filteredSalaries.length}</span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Salary date</th>
                    <th>Daily salary</th>
                    <th>Present days</th>
                    <th>Deduction</th>
                    <th>Net salary</th>
                    <th>Payment status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-4">Loading salary history...</td></tr>
                  ) : filteredSalaries.length ? (
                    filteredSalaries.map((salary) => {
                      const paid = salary.payment_status === "Paid";
                      return (
                        <tr key={salary.id}>
                          <td>{getSalaryDate(salary)}</td>
                          <td>৳ {formatMoney(salary.daily_salary ?? salary.net_salary)}</td>
                          <td>{salary.present_days ?? 1}</td>
                          <td className="text-danger">৳ {formatMoney(salary.deduction)}</td>
                          <td className="fw-semibold">৳ {formatMoney(salary.net_salary)}</td>
                          <td>
                            <span className={`badge ${paid ? "bg-success" : "bg-warning text-dark"}`}>
                              {paid ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => printPayslip(salary)}
                              >
                                <i className="bi bi-printer me-1"></i>
                                Print
                              </button>
                              <button
                                type="button"
                                className={`btn btn-sm ${paid ? "btn-outline-warning" : "btn-success"}`}
                                disabled={updatingSalary !== ""}
                                onClick={() => updatePaymentStatus(salary)}
                              >
                                {updatingSalary === String(salary.id)
                                  ? "Updating..."
                                  : paid
                                  ? "Unpaid"
                                  : "Paid"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        {salaries.length
                          ? "No salary records match the selected filters."
                          : "No salary records found for this employee."}
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

export default Salaryview;
