
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const Salaryview = () => {
  const { id } = useParams();

  const [salary, setSalary] = useState({
    worker_id: "",
    worker_name: "",
    month: "",
    year: "",
    basic_salary: "",
    present_days: "",
    absent_days: "",
    deduction: "",
    net_salary: "",
    payment_status: "Pending",
  });

  const [loading, setLoading] = useState(true);

  const months = [
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
  ];

  async function fetchSalary() {
    try {
      const res = await axios.get("salary/single.php?id=" + id);

      const salaryData = Array.isArray(res?.data?.data)
        ? res.data.data[0]
        : res?.data?.data;

      if (salaryData) {
        setSalary((prev) => ({
          ...prev,
          ...salaryData,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch salary:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSalary();
  }, [id]);

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-BD");

  const monthName =
    Number(salary.month) >= 1 && Number(salary.month) <= 12
      ? months[Number(salary.month) - 1]
      : salary.month || "N/A";

  const paymentStatus = salary.payment_status || "Pending";

  return (
    <Layout>
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-cash-stack me-2"></i>
                Salary Details
              </h5>

              <Link
                to="/salary"
                className="btn-close"
                aria-label="Close"
              ></Link>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {loading ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary"></div>
                  <p className="mt-2 mb-0">
                    Loading salary details...
                  </p>
                </div>
              ) : (
                <div className="row g-3">

                  {/* Worker Name */}
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">
                        Worker Name
                      </small>
                      <h6 className="mb-0">
                        {salary.worker_name || salary.worker_id || "N/A"}
                      </h6>
                    </div>
                  </div>

                  {/* Salary Month */}
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">
                        Salary Month
                      </small>
                      <h6 className="mb-0">{monthName}</h6>
                    </div>
                  </div>

                  {/* Year */}
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">Year</small>
                      <h6 className="mb-0">
                        {salary.year || "N/A"}
                      </h6>
                    </div>
                  </div>

                  {/* Basic Salary */}
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">
                        Basic Salary
                      </small>
                      <h6 className="mb-0">
                        ৳ {formatMoney(salary.basic_salary)}
                      </h6>
                    </div>
                  </div>

                  {/* Present Days */}
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">
                        Present Days
                      </small>
                      <h6 className="mb-0">
                        {salary.present_days ?? "N/A"}
                      </h6>
                    </div>
                  </div>

                  {/* Absent Days */}
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">
                        Absent Days
                      </small>
                      <h6 className="mb-0">
                        {salary.absent_days ?? "N/A"}
                      </h6>
                    </div>
                  </div>

                  {/* Deduction */}
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">
                        Deduction
                      </small>
                      <h6 className="mb-0 text-danger">
                        ৳ {formatMoney(salary.deduction)}
                      </h6>
                    </div>
                  </div>

                  {/* Net Salary */}
                  <div className="col-md-6">
                    <div className="border rounded p-3">
                      <small className="text-muted">
                        Net Salary
                      </small>
                      <h6 className="mb-0 text-success">
                        ৳ {formatMoney(salary.net_salary)}
                      </h6>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="col-12">
                    <div className="border rounded p-3">
                      <small className="text-muted">
                        Payment Status
                      </small>

                      <div>
                        <span
                          className={`badge ${
                            paymentStatus === "Paid"
                              ? "bg-success"
                              : paymentStatus === "Pending"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <Link to="/salary" className="btn btn-secondary">
                <i className="bi bi-arrow-left me-1"></i>
                Back
              </Link>

              <Link
                to={`/salary/edit/${id}`}
                className="btn btn-primary"
              >
                <i className="bi bi-pencil-square me-1"></i>
                Edit Salary
              </Link>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Salaryview;
