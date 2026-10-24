import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../Layout.jsx";
import axios from "../../../Lib/axios";

// Ekhane tomar company-r nam, address o contact likho
const COMPANY_NAME = "Your Company Name";
const COMPANY_ADDRESS = "Company Address, City, Bangladesh";
const COMPANY_CONTACT = "Phone: 01XXXXXXXXX  |  Email: info@company.com";

/* ---------------------------------------------------------------- helpers */

const localDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const displayDate = (value) => {
  if (!value) return "-";
  const [year, month, day] = String(value).slice(0, 10).split("-");
  if (!year || !month || !day) return String(value);
  return `${day}/${month}/${year}`;
};

const escapeHtml = (text) =>
  String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const money = (amount) =>
  Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// cell string/number hote pare, othoba { text, badge } object
const cellText = (cell) =>
  cell !== null && typeof cell === "object" ? cell.text : cell;

const periodText = (fromDate, toDate) => {
  if (fromDate && toDate) return `${displayDate(fromDate)} to ${displayDate(toDate)}`;
  if (fromDate) return `From ${displayDate(fromDate)}`;
  if (toDate) return `Up to ${displayDate(toDate)}`;
  return "All records";
};

/* ---------------------------------------------------------------- data hook */

const useReportData = (url, label) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setError("");
        const res = await axios.get(url);
        if (!active) return;
        if (res?.data?.status === false) {
          throw new Error(res?.data?.message || `Could not load ${label}.`);
        }
        const payload = res?.data;
        const records = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.records)
          ? payload.records
          : [];
        setData(records);
      } catch (fetchError) {
        if (!active) return;
        console.error(`Failed to fetch ${label}:`, fetchError);
        setData([]);
        setError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            `Failed to load ${label}.`
        );
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [url, label]);

  return { data, loading, error };
};

/* ------------------------------------------------------- print / csv export */

// Alada iframe diye print, tai Layout-er sidebar kono problem kore na
const printReport = ({ title, period, columns, rows, footer, summary }) => {
  const head = columns.map((col) => `<th>${escapeHtml(col.label)}</th>`).join("");

  const body = rows
    .map(
      (row) =>
        `<tr>${row
          .map(
            (cell, i) =>
              `<td class="${columns[i].align || "l"}">${escapeHtml(cellText(cell))}</td>`
          )
          .join("")}</tr>`
    )
    .join("");

  const foot = footer
    ? `<tfoot><tr>${footer
        .map(
          (cell, i) =>
            `<td class="${columns[i].align || "l"}">${escapeHtml(cell)}</td>`
        )
        .join("")}</tr></tfoot>`
    : "";

  const summaryBoxes = summary.length
    ? `<div class="summary">${summary
        .map(
          (item) =>
            `<div class="box"><span>${escapeHtml(item.label)}</span><b>${escapeHtml(
              item.value
            )}</b></div>`
        )
        .join("")}</div>`
    : "";

  const now = new Date();
  const refNo = `RPT-${title.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase()}-${localDate(
    now
  ).replace(/-/g, "")}`;

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)} - ${escapeHtml(period)}</title>
<style>
  @page { size: A4 portrait; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111; font-size: 12px; margin: 0; }
  .head { text-align: center; padding-bottom: 8px; border-bottom: 3px double #111; }
  .head h1 { margin: 0; font-size: 22px; letter-spacing: 1.5px; text-transform: uppercase; }
  .head p { margin: 2px 0; color: #444; font-size: 11px; }
  .title { text-align: center; margin: 14px 0 4px; }
  .title h2 { display: inline-block; margin: 0; padding: 4px 22px; font-size: 14px; letter-spacing: 1px;
              text-transform: uppercase; border: 1.5px solid #111; }
  .meta { display: flex; justify-content: space-between; margin: 10px 0; font-size: 11px; color: #333; }
  .summary { display: flex; gap: 8px; margin-bottom: 12px; }
  .summary .box { flex: 1; border: 1px solid #555; padding: 6px 8px; background: #f8f9fa; }
  .summary .box span { display: block; font-size: 10px; color: #555; text-transform: uppercase; }
  .summary .box b { font-size: 14px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #555; padding: 6px 8px; }
  th { background: #1f2937; color: #fff; text-align: center; font-size: 11px; text-transform: uppercase; }
  tbody tr:nth-child(even) td { background: #f5f6f7; }
  td.c { text-align: center; }
  td.r { text-align: right; }
  tfoot td { font-weight: bold; background: #e9ecef; }
  tr { page-break-inside: avoid; }
  thead { display: table-header-group; }
  .sign { display: flex; justify-content: space-between; margin-top: 70px; text-align: center; }
  .sign div { width: 22%; border-top: 1px solid #111; padding-top: 5px; font-weight: bold; font-size: 11px; }
  .foot { margin-top: 22px; padding-top: 6px; border-top: 1px solid #999; font-size: 9px; color: #666;
          display: flex; justify-content: space-between; }
</style>
</head>
<body>
  <div class="head">
    <h1>${escapeHtml(COMPANY_NAME)}</h1>
    <p>${escapeHtml(COMPANY_ADDRESS)}</p>
    <p>${escapeHtml(COMPANY_CONTACT)}</p>
  </div>
  <div class="title"><h2>${escapeHtml(title)}</h2></div>
  <div class="meta">
    <div>Period: <b>${escapeHtml(period)}</b></div>
    <div>Ref No: <b>${escapeHtml(refNo)}</b> &nbsp;|&nbsp; Date: <b>${displayDate(localDate(now))}</b></div>
  </div>
  ${summaryBoxes}
  <table>
    <thead><tr>${head}</tr></thead>
    <tbody>${body}</tbody>
    ${foot}
  </table>
  <div class="sign">
    <div>Prepared By</div><div>Checked By</div><div>Accounts</div><div>Approved By</div>
  </div>
  <div class="foot">
    <span>Confidential - for internal use only</span>
    <span>Printed on: ${displayDate(localDate(now))} ${now.toLocaleTimeString()}</span>
  </div>
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

  // iframe ekbar-i remove hobe (ager moto duibar remove korle error hoto)
  const cleanup = () => {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
  };

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  // print ekbar-i chalbe, onload age fire hoye gele 500ms por fallback e chalbe
  let printed = false;
  const runPrint = () => {
    if (printed) return;
    printed = true;
    const win = iframe.contentWindow;
    if (!win) return;
    win.onafterprint = cleanup;
    win.focus();
    win.print();
    setTimeout(cleanup, 60000);
  };

  iframe.onload = runPrint;
  setTimeout(runPrint, 500);
};

const exportCsv = ({ filename, columns, rows, footer }) => {
  const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const lines = [columns.map((col) => quote(col.label))];
  rows.forEach((row) => lines.push(row.map((cell) => quote(cellText(cell)))));
  if (footer) lines.push(footer.map((cell) => quote(cell)));
  const csv = lines.map((line) => line.join(",")).join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

/* --------------------------------------------------------- shared UI pieces */

const Field = ({ id, label, className = "col-lg-3 col-md-6", children }) => (
  <div className={className}>
    <label className="form-label" htmlFor={id}>
      {label}
    </label>
    {children}
  </div>
);

const ReportShell = ({
  title,
  fileName,
  period,
  filters,
  onClear,
  summary,
  columns,
  rows,
  footer,
  loading,
  error,
  emptyText,
}) => {
  const handlePrint = () => printReport({ title, period, columns, rows, footer, summary });
  const handleCsv = () =>
    exportCsv({
      filename: `${fileName}-${localDate(new Date())}.csv`,
      columns,
      rows,
      footer,
    });

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        {summary.map((item) => (
          <div className="col-lg-3 col-md-6" key={item.label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body py-3">
                <div className="text-secondary small">{item.label}</div>
                <h5 className="mb-0">{item.value}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 align-items-end mb-4">
        {filters}
        <div className="col-auto">
          <button type="button" className="btn btn-outline-secondary" onClick={onClear}>
            Clear
          </button>
        </div>
        <div className="col-auto ms-auto d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={handleCsv}
            disabled={!rows.length}
          >
            <i className="bi bi-file-earmark-excel me-1"></i>
            Excel (CSV)
          </button>
          <button
            type="button"
            className="btn btn-dark"
            onClick={handlePrint}
            disabled={!rows.length}
          >
            <i className="bi bi-printer me-1"></i>
            Print
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">{title}</h5>
        <span className="text-muted small">{period}</span>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.label}
                  className={col.align === "r" ? "text-end" : col.align === "c" ? "text-center" : ""}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, i) => {
                    const align =
                      columns[i].align === "r"
                        ? "text-end"
                        : columns[i].align === "c"
                        ? "text-center"
                        : "";
                    return (
                      <td key={i} className={align}>
                        {cell !== null && typeof cell === "object" ? (
                          <span className={`badge ${cell.badge}`}>{cell.text}</span>
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center text-muted py-4">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
          {footer && rows.length > 0 && (
            <tfoot className="table-light">
              <tr>
                {footer.map((cell, i) => (
                  <th
                    key={i}
                    className={
                      columns[i].align === "r"
                        ? "text-end"
                        : columns[i].align === "c"
                        ? "text-center"
                        : ""
                    }
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ salary report */

const SalaryReport = () => {
  const { data, loading, error } = useReportData("salary/index.php", "salary report");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const list = useMemo(() => {
    const query = search.trim().toLowerCase();
    return data.filter((salary) => {
      const recordDate = salary.salary_date ? String(salary.salary_date).slice(0, 10) : "";
      if (fromDate && (!recordDate || recordDate < fromDate)) return false;
      if (toDate && (!recordDate || recordDate > toDate)) return false;
      const paymentStatus = salary.payment_status === "Paid" ? "Paid" : "Pending";
      if (status && paymentStatus !== status) return false;
      return (salary.worker_name || "").toLowerCase().includes(query);
    });
  }, [data, search, status, fromDate, toDate]);

  let paid = 0;
  let pending = 0;
  list.forEach((salary) => {
    const amount = Number(salary.net_salary || 0);
    if (salary.payment_status === "Paid") paid += amount;
    else pending += amount;
  });

  const columns = [
    { label: "SL", align: "c" },
    { label: "Worker" },
    { label: "Salary date", align: "c" },
    { label: "Net salary (BDT)", align: "r" },
    { label: "Payment", align: "c" },
  ];

  const rows = list.map((salary, index) => {
    const isPaid = salary.payment_status === "Paid";
    return [
      index + 1,
      salary.worker_name || "-",
      displayDate(salary.salary_date),
      money(salary.net_salary),
      { text: isPaid ? "Paid" : "Unpaid", badge: isPaid ? "bg-success" : "bg-warning text-dark" },
    ];
  });

  const footer = ["", "Grand total", "", money(paid + pending), ""];

  return (
    <ReportShell
      title="Salary Report"
      fileName="salary-report"
      period={periodText(fromDate, toDate)}
      onClear={() => {
        setSearch("");
        setStatus("");
        setFromDate("");
        setToDate("");
      }}
      filters={
        <>
          <Field id="sr-search" label="Search worker">
            <input
              id="sr-search"
              type="search"
              className="form-control"
              placeholder="Worker name..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Field>
          <Field id="sr-status" label="Payment" className="col-lg-2 col-md-4">
            <select
              id="sr-status"
              className="form-select"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Unpaid</option>
            </select>
          </Field>
          <Field id="sr-from" label="From date" className="col-lg-2 col-md-4">
            <input
              id="sr-from"
              type="date"
              className="form-control"
              value={fromDate}
              max={toDate || undefined}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </Field>
          <Field id="sr-to" label="To date" className="col-lg-2 col-md-4">
            <input
              id="sr-to"
              type="date"
              className="form-control"
              value={toDate}
              min={fromDate || undefined}
              onChange={(event) => setToDate(event.target.value)}
            />
          </Field>
        </>
      }
      summary={[
        { label: "Records", value: list.length },
        { label: "Paid (BDT)", value: money(paid) },
        { label: "Unpaid (BDT)", value: money(pending) },
        { label: "Total (BDT)", value: money(paid + pending) },
      ]}
      columns={columns}
      rows={rows}
      footer={footer}
      loading={loading}
      error={error}
      emptyText="No salary records found for these filters."
    />
  );
};

/* ---------------------------------------------------------------- main page */

const Reports = () => (
  <Layout>
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h3 className="mb-1"> Report</h3>
        <p className="text-muted mb-0">View, filter, export and print salary records</p>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <SalaryReport />
        </div>
      </div>
    </div>
  </Layout>
);

export default Reports;
