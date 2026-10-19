import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const localDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const today = new Date();
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const Salaryadd = () => {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState(localDate(firstOfMonth));
  const [toDate, setToDate] = useState(localDate(today));
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dateRangeValid = Boolean(fromDate && toDate && fromDate <= toDate);

  useEffect(() => {
    if (!dateRangeValid) return;

    let active = true;
    const loadEligibleWorkers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `salary/preview.php?from_date=${encodeURIComponent(fromDate)}&to_date=${encodeURIComponent(toDate)}`
        );
        if (!active) return;

        if (response?.data?.status !== true) {
          throw new Error(response?.data?.message || "Could not load salary preview.");
        }
        setWorkers(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (loadError) {
        if (!active) return;
        console.error("Failed to load salary preview:", loadError);
        setWorkers([]);
        setError(
          loadError.response?.data?.message ||
            loadError.response?.data?.error ||
            loadError.message ||
            "Could not load salary preview."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadEligibleWorkers();
    return () => {
      active = false;
    };
  }, [dateRangeValid, fromDate, toDate]);

  const totalDays = workers.reduce(
    (total, worker) => total + Number(worker.present_days || 0),
    0
  );
  const totalSalary = workers.reduce(
    (total, worker) => total + Number(worker.net_salary || 0),
    0
  );
  const formatMoney = (amount) => Number(amount || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!fromDate || !toDate || fromDate > toDate) {
      setError("Select a valid date range.");
      return;
    }
    if (workers.length === 0) {
      setError("There are no unpaid present days to save in this date range.");
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append("from_date", fromDate);
      data.append("to_date", toDate);
      data.append("payment_status", paymentStatus);

      const response = await axios.post("salary/create.php", data);
      if (response?.data?.status !== true) {
        throw new Error(response?.data?.message || "Salary could not be saved.");
      }
      navigate("/salary");
    } catch (saveError) {
      console.error("Salary save failed:", saveError);
      setError(
        saveError.response?.data?.message ||
          saveError.response?.data?.error ||
          saveError.message ||
          "Failed to save salary."
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
            <h5 className="mb-0">
              <i className="bi bi-cash-stack me-2"></i>
              Create Daily Salaries
            </h5>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label" htmlFor="from-date">From date</label>
                  <input
                    id="from-date"
                    type="date"
                    className="form-control"
                    value={fromDate}
                    max={toDate}
                    onChange={(event) => {
                      setWorkers([]);
                      setLoading(false);
                      setError("");
                      setFromDate(event.target.value);
                    }}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="to-date">To date</label>
                  <input
                    id="to-date"
                    type="date"
                    className="form-control"
                    value={toDate}
                    min={fromDate}
                    onChange={(event) => {
                      setWorkers([]);
                      setLoading(false);
                      setError("");
                      setToDate(event.target.value);
                    }}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor="payment-status">Payment status</label>
                  <select
                    id="payment-status"
                    className="form-select"
                    value={paymentStatus}
                    onChange={(event) => setPaymentStatus(event.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Worker</th>
                      <th>Basic monthly salary</th>
                      <th>Eligible present days</th>
                      <th>Daily salary total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4" className="text-center py-4">Loading attendance and salary preview...</td></tr>
                    ) : workers.length ? (
                      workers.map((worker) => (
                        <tr key={worker.worker_id}>
                          <td>{worker.worker_name}</td>
                          <td>৳ {formatMoney(worker.basic_salary)}</td>
                          <td>{worker.present_days}</td>
                          <td className="text-success fw-semibold">৳ {formatMoney(worker.net_salary)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-4">
                          {!dateRangeValid
                            ? "The start date must be on or before the end date."
                            : "No eligible present days found for this date range."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {dateRangeValid && workers.length > 0 && (
                    <tfoot className="table-light">
                      <tr>
                        <th colSpan="2">Total</th>
                        <th>{totalDays} worker-days</th>
                        <th>৳ {formatMoney(totalSalary)}</th>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>

              <p className="small text-muted mb-0">
                Daily salary is calculated from each worker&apos;s monthly basic salary divided by the number of calendar days in that attendance month. Dates that already have a salary record are excluded.
              </p>
            </div>

            <div className="card-footer bg-white text-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || saving || workers.length === 0}
              >
                <i className="bi bi-save me-2"></i>
                {saving ? "Saving..." : "Save daily salaries"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Salaryadd;
