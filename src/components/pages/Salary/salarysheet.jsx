import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

// Ekhane tomar company-r nam o address likho
const COMPANY_NAME = "Work Nest Bangladesh";
const COMPANY_ADDRESS = "2no Gate, Chattogram Bangladesh";

const localDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const displayDate = (value) => {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const money = (amount) =>
  Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const today = new Date();
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const Salarysheet = () => {
  const [salaries, setSalaries] = useState([]);
  const [fromDate, setFromDate] = useState(localDate(firstOfMonth));
  const [toDate, setToDate] = useState(localDate(today));
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const fetchSalary = async () => {
      try {
        setError("");
        const res = await axios.get("salary/index.php");
        if (!active) return;
        if (res?.data?.status === false) {
          throw new Error(res?.data?.message || "Could not load salaries.");
        }
        setSalaries(Array.isArray(res?.data?.data) ? res.data.data : []);
      } catch (fetchError) {
        if (!active) return;
        console.error("Failed to fetch salaries:", fetchError);
        setSalaries([]);
        setError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            "Failed to load salary sheet."
        );
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchSalary();
    return () => {
      active = false;
    };
  }, []);

  const rows = useMemo(() => {
    const grouped = new Map();

    salaries.forEach((salary) => {
      const date = salary.salary_date
        ? String(salary.salary_date).slice(0, 10)
        : "";
      if (fromDate && (!date || date < fromDate)) return;
      if (toDate && (!date || date > toDate)) return;

      const paid = salary.payment_status === "Paid";
      if (statusFilter === "Paid" && !paid) return;
      if (statusFilter === "Pending" && paid) return;

      const key = String(salary.worker_id);
      if (!grouped.has(key)) {
        grouped.set(key, {
          worker_id: salary.worker_id,
          worker_name: salary.worker_name || `Worker ${salary.worker_id}`,
          basic_salary: Number(salary.basic_salary || 0),
          days: 0,
          deduction: 0,
          paid_amount: 0,
          unpaid_amount: 0,
          net_payable: 0,
        });
      }

      const row = grouped.get(key);
      const net = Number(salary.net_salary || 0);
      row.days += Number(salary.present_days ?? 1);
      row.deduction += Number(salary.deduction || 0);
      row.net_payable += net;
      if (paid) row.paid_amount += net;
      else row.unpaid_amount += net;
    });

    const query = search.trim().toLowerCase();
    return Array.from(grouped.values())
      .filter((row) => row.worker_name.toLowerCase().includes(query))
      .sort((a, b) => a.worker_name.localeCompare(b.worker_name));
  }, [fromDate, salaries, search, statusFilter, toDate]);

  const totals = rows.reduce(
    (sum, row) => ({
      basic_salary: sum.basic_salary + row.basic_salary,
      days: sum.days + row.days,
      deduction: sum.deduction + row.deduction,
      paid_amount: sum.paid_amount + row.paid_amount,
      unpaid_amount: sum.unpaid_amount + row.unpaid_amount,
      net_payable: sum.net_payable + row.net_payable,
    }),
    {
      basic_salary: 0,
      days: 0,
      deduction: 0,
      paid_amount: 0,
      unpaid_amount: 0,
      net_payable: 0,
    }
  );

  const getStatus = (row) => {
    if (row.unpaid_amount === 0 && row.paid_amount > 0) return "Paid";
    if (row.paid_amount === 0) return "Unpaid";
    return "Partial";
  };

  const badgeClass = (status) =>
    status === "Paid"
      ? "bg-success"
      : status === "Partial"
      ? "bg-info text-dark"
      : "bg-warning text-dark";

  // Alada print window/iframe diye print, tai Layout-er sidebar kono problem kore na
  const printSheet = () => {
    const bodyRows = rows
      .map((row, index) => {
        const status = getStatus(row);
        return `<tr>
          <td class="c">${index + 1}</td>
          <td class="c">EMP-${String(row.worker_id).padStart(3, "0")}</td>
          <td>${escapeHtml(row.worker_name)}</td>
          <td class="r">${money(row.basic_salary)}</td>
          <td class="c">${row.days}</td>
          <td class="r">${money(row.deduction)}</td>
          <td class="r b">${money(row.net_payable)}</td>
          <td class="c">${status}</td>
          <td></td>
        </tr>`;
      })
      .join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Salary Sheet ${fromDate} to ${toDate}</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 12px; margin: 0; }
  .head { text-align: center; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
  .head h1 { margin: 0; font-size: 22px; letter-spacing: 1px; text-transform: uppercase; }
  .head p { margin: 2px 0; color: #444; }
  .head h2 { margin: 8px 0 2px; font-size: 15px; text-decoration: underline; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #555; padding: 6px 8px; }
  th { background: #e9ecef; text-align: center; font-size: 11px; text-transform: uppercase; }
  td.c { text-align: center; }
  td.r { text-align: right; }
  td.b { font-weight: bold; }
  tfoot td { font-weight: bold; background: #f1f3f5; }
  tr { page-break-inside: avoid; }
  td:last-child { width: 130px; }
  .sign { display: flex; justify-content: space-between; margin-top: 70px; text-align: center; }
  .sign div { width: 22%; border-top: 1px solid #111; padding-top: 5px; font-weight: bold; }
  .foot { margin-top: 18px; font-size: 10px; color: #666; text-align: right; }
</style>
</head>
<body>
  <div class="head">
    <h1>${escapeHtml(COMPANY_NAME)}</h1>
    <p>${escapeHtml(COMPANY_ADDRESS)}</p>
    <h2>EMPLOYEE SALARY SHEET</h2>
    <p>Period: <b>${displayDate(fromDate)}</b> to <b>${displayDate(toDate)}</b></p>
  </div>
  <table>
    <thead>
      <tr>
        <th>SL</th><th>Employee ID</th><th>Employee Name</th><th>Basic Salary</th>
        <th>Present Days</th><th>Deduction</th><th>Net Payable</th><th>Status</th><th>Signature</th>
      </tr>
    </thead>
    <tbody>${bodyRows}</tbody>
    <tfoot>
      <tr>
        <td colspan="3" class="r">Grand Total (${rows.length} employees)</td>
        <td class="r">${money(totals.basic_salary)}</td>
        <td class="c">${totals.days}</td>
        <td class="r">${money(totals.deduction)}</td>
        <td class="r">${money(totals.net_payable)}</td>
        <td colspan="2"></td>
      </tr>
    </tfoot>
  </table>
  <div class="sign">
    <div>Prepared By</div><div>Checked By</div><div>Accounts</div><div>Approved By</div>
  </div>
  <div class="foot">Printed on: ${displayDate(localDate(new Date()))}</div>
</body>
</html>`;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  };

  const exportCsv = () => {
    const header = [
      "SL",
      "Employee ID",
      "Employee Name",
      "Basic Salary",
      "Present Days",
      "Deduction",
      "Net Payable",
      "Status",
    ];
    const lines = rows.map((row, index) => [
      index + 1,
      row.worker_id,
      `"${row.worker_name.replace(/"/g, '""')}"`,
      row.basic_salary.toFixed(2),
      row.days,
      row.deduction.toFixed(2),
      row.net_payable.toFixed(2),
      getStatus(row),
    ]);
    lines.push([
      "",
      "",
      "Total",
      totals.basic_salary.toFixed(2),
      totals.days,
      totals.deduction.toFixed(2),
      totals.net_payable.toFixed(2),
      "",
    ]);
    const csv = [header, ...lines].map((line) => line.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `salary-sheet-${fromDate}-to-${toDate}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Layout>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <div>
            <h3 className="mb-1">Salary Sheet</h3>
            <p className="text-muted mb-0">
              {displayDate(fromDate)} to {displayDate(toDate)} &middot; all employees
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/salary" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-1"></i>
              Back
            </Link>
            <button type="button" className="btn btn-outline-success" onClick={exportCsv} disabled={!rows.length}>
              <i className="bi bi-file-earmark-excel me-1"></i>
              Excel (CSV)
            </button>
            <button type="button" className="btn btn-dark" onClick={printSheet} disabled={!rows.length}>
              <i className="bi bi-printer me-1"></i>
              Print Sheet
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="text-secondary small">Employees</div>
                <h4 className="mb-0">{rows.length}</h4>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="text-secondary small">Total payable</div>
                <h4 className="mb-0">৳ {money(totals.net_payable)}</h4>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="text-secondary small">Paid</div>
                <h4 className="text-success mb-0">৳ {money(totals.paid_amount)}</h4>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="text-secondary small">Unpaid</div>
                <h4 className="text-warning-emphasis mb-0">৳ {money(totals.unpaid_amount)}</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-lg-3 col-md-6">
                <label className="form-label" htmlFor="sheet-from">From date</label>
                <input
                  id="sheet-from"
                  type="date"
                  className="form-control"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(event) => setFromDate(event.target.value)}
                />
              </div>
              <div className="col-lg-3 col-md-6">
                <label className="form-label" htmlFor="sheet-to">To date</label>
                <input
                  id="sheet-to"
                  type="date"
                  className="form-control"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(event) => setToDate(event.target.value)}
                />
              </div>
              <div className="col-lg-3 col-md-6">
                <label className="form-label" htmlFor="sheet-status">Payment status</label>
                <select
                  id="sheet-status"
                  className="form-select"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Unpaid</option>
                </select>
              </div>
              <div className="col-lg-3 col-md-6">
                <label className="form-label" htmlFor="sheet-search">Search employee</label>
                <input
                  id="sheet-search"
                  type="search"
                  className="form-control"
                  placeholder="Employee name..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>SL</th>
                    <th>Employee ID</th>
                    <th>Employee</th>
                    <th className="text-end">Basic salary</th>
                    <th className="text-center">Days</th>
                    <th className="text-end">Deduction</th>
                    <th className="text-end">Net payable</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="8" className="text-center py-4">Loading salary sheet...</td></tr>
                  ) : rows.length ? (
                    rows.map((row, index) => {
                      const status = getStatus(row);
                      return (
                        <tr key={row.worker_id}>
                          <td>{index + 1}</td>
                          <td>EMP-{String(row.worker_id).padStart(3, "0")}</td>
                          <td>
                            <Link
                              to={`/salary/view/${row.worker_id}`}
                              className="fw-semibold text-decoration-none"
                            >
                              {row.worker_name}
                            </Link>
                          </td>
                          <td className="text-end">৳ {money(row.basic_salary)}</td>
                          <td className="text-center">{row.days}</td>
                          <td className="text-end text-danger">৳ {money(row.deduction)}</td>
                          <td className="text-end fw-semibold">৳ {money(row.net_payable)}</td>
                          <td className="text-center">
                            <span className={`badge ${badgeClass(status)}`}>{status}</span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-4">
                        No salary records found for this date range.
                      </td>
                    </tr>
                  )}
                </tbody>
                {rows.length > 0 && (
                  <tfoot className="table-light">
                    <tr>
                      <th colSpan="3">Grand total</th>
                      <th className="text-end">৳ {money(totals.basic_salary)}</th>
                      <th className="text-center">{totals.days}</th>
                      <th className="text-end">৳ {money(totals.deduction)}</th>
                      <th className="text-end">৳ {money(totals.net_payable)}</th>
                      <th></th>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Salarysheet;
