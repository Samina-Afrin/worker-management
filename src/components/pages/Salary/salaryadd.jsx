
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const Salaryadd = () => {
  const { id } = useParams();

  const [workers, setWorkers] = useState([]);

  const [formData, setFormData] = useState({
    worker_id: "",
    month: "",
    year: new Date().getFullYear(),
    basic_salary: "",
    present_days: "",
    absent_days: "",
    deduction: "0",
    net_salary: "0",
    payment_status: "Pending",
  });

  const [loading, setLoading] = useState(false);

  // Fetch Workers
  async function fetchWorkers() {
    try {
      const res = await axios.get("workers/index.php");
      setWorkers(res?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    }
  }

  // Fetch Salary for Update
  async function fetchSalary() {
    try {
      const res = await axios.get("salary/single.php?id=" + id);

      const salaryData = Array.isArray(res?.data?.data)
        ? res.data.data[0]
        : res?.data?.data;

      if (salaryData) {
        setFormData((prev) => ({
          ...prev,
          ...salaryData,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch salary:", error);
    }
  }

  useEffect(() => {
    fetchWorkers();

    if (id) {
      fetchSalary();
    }
  }, [id]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate Net Salary
  const netSalary = Math.max(
    0,
    Number(formData.basic_salary || 0) -
      Number(formData.deduction || 0)
  );

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value ?? "");
    });

    data.set("net_salary", String(netSalary));

    try {
      const url = id
        ? "salary/update.php?id=" + id
        : "salary/create.php";

      await axios.post(url, data);

      //window.location.href = "/salary";
    } catch (error) {
      console.error("Salary save failed:", error);
      alert("Failed to save salary. Please check your API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">
              <i className="bi bi-cash-stack me-2"></i>
              {id ? "Update Salary" : "Add New Salary"}
            </h5>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">

                {/* Worker */}
                <div className="col-md-6">
                  <label className="form-label">Worker Name</label>
                  <select
                    name="worker_id"
                    className="form-select"
                    value={formData.worker_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Worker</option>
                    {workers.map((worker) => (
                      <option key={worker.id} value={worker.id}>
                        {worker.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Month */}
                <div className="col-md-6">
                  <label className="form-label">Salary Month</label>
                  <select
                    name="month"
                    className="form-select"
                    value={formData.month}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Month</option>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div className="col-md-6">
                  <label className="form-label">Year</label>
                  <input
                    type="number"
                    name="year"
                    className="form-control"
                    value={formData.year}
                    onChange={handleChange}
                    min="2000"
                    max="2100"
                    required
                  />
                </div>

                {/* Basic Salary */}
                <div className="col-md-6">
                  <label className="form-label">Basic Salary (৳)</label>
                  <input
                    type="number"
                    name="basic_salary"
                    className="form-control"
                    value={formData.basic_salary}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Present Days */}
                <div className="col-md-6">
                  <label className="form-label">Present Days</label>
                  <input
                    type="number"
                    name="present_days"
                    className="form-control"
                    value={formData.present_days}
                    onChange={handleChange}
                    min="0"
                    max="31"
                    required
                  />
                </div>

                {/* Absent Days */}
                <div className="col-md-6">
                  <label className="form-label">Absent Days</label>
                  <input
                    type="number"
                    name="absent_days"
                    className="form-control"
                    value={formData.absent_days}
                    onChange={handleChange}
                    min="0"
                    max="31"
                    required
                  />
                </div>

                {/* Deduction */}
                <div className="col-md-6">
                  <label className="form-label">Deduction (৳)</label>
                  <input
                    type="number"
                    name="deduction"
                    className="form-control"
                    value={formData.deduction}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Net Salary */}
                <div className="col-md-6">
                  <label className="form-label">Net Salary (৳)</label>
                  <input
                    type="number"
                    name="net_salary"
                    className="form-control"
                    value={netSalary}
                    readOnly
                  />
                </div>

                {/* Payment Status */}
                <div className="col-md-6">
                  <label className="form-label">Payment Status</label>
                  <select
                    name="payment_status"
                    className="form-select"
                    value={formData.payment_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                {/* Salary Summary */}
                <div className="col-12">
                  <div className="alert alert-info mb-0">
                    <strong>Net Salary: </strong>
                    ৳ {netSalary.toLocaleString("en-BD")}
                  </div>
                </div>

              </div>
            </div>

            <div className="card-footer bg-white text-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <i className="bi bi-save me-2"></i>
                {loading
                  ? "Saving..."
                  : id
                  ? "Update Salary"
                  : "Save Salary"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Salaryadd;
