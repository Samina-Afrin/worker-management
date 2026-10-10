
import { useState } from "react";
import { Link } from "react-router";

function SalaryAdd() {
  const [salary, setSalary] = useState({
    workerName: "",
    month: "",
    basicSalary: "",
    presentDays: "",
    bonus: "",
    deduction: "",
    status: "Unpaid",
  });

  const handleChange = (e) => {
    setSalary({
      ...salary,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const totalSalary =
      Number(salary.basicSalary) +
      Number(salary.bonus || 0) -
      Number(salary.deduction || 0);

    console.log({
      ...salary,
      totalSalary,
    });

    alert("Salary added successfully!");
  };

  return (
    <section className="product-section before-footer-section">
      <div className="container">

        <div className="row mb-4">
          <div className="col-12">
            <h2 className="mb-1">Add Salary</h2>
            <p className="text-muted">
              Add monthly salary information for a worker
            </p>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">

            <form onSubmit={handleSubmit}>

              <div className="row g-3">

                {/* Worker */}
                <div className="col-md-6">
                  <label className="form-label">
                    Worker Name
                  </label>

                  <select
                    name="workerName"
                    className="form-select"
                    value={salary.workerName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Worker
                    </option>
                    <option value="Samina Afrin">
                      Samina Afrin
                    </option>
                    <option value="Abu Bakkar">
                      Abu Bakkar
                    </option>
                    <option value="Tasfia Saba">
                      Tasfia Saba
                    </option>
                  </select>
                </div>

                {/* Month */}
                <div className="col-md-6">
                  <label className="form-label">
                    Salary Month
                  </label>

                  <input
                    type="month"
                    name="month"
                    className="form-control"
                    value={salary.month}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Basic Salary */}
                <div className="col-md-6">
                  <label className="form-label">
                    Basic Salary
                  </label>

                  <input
                    type="number"
                    name="basicSalary"
                    className="form-control"
                    placeholder="Enter basic salary"
                    value={salary.basicSalary}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Present Days */}
                <div className="col-md-6">
                  <label className="form-label">
                    Present Days
                  </label>

                  <input
                    type="number"
                    name="presentDays"
                    className="form-control"
                    placeholder="Enter present days"
                    value={salary.presentDays}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Bonus */}
                <div className="col-md-6">
                  <label className="form-label">
                    Bonus
                  </label>

                  <input
                    type="number"
                    name="bonus"
                    className="form-control"
                    placeholder="Enter bonus"
                    value={salary.bonus}
                    onChange={handleChange}
                  />
                </div>

                {/* Deduction */}
                <div className="col-md-6">
                  <label className="form-label">
                    Deduction
                  </label>

                  <input
                    type="number"
                    name="deduction"
                    className="form-control"
                    placeholder="Enter deduction"
                    value={salary.deduction}
                    onChange={handleChange}
                  />
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label">
                    Payment Status
                  </label>

                  <select
                    name="status"
                    className="form-select"
                    value={salary.status}
                    onChange={handleChange}
                  >
                    <option value="Unpaid">
                      Unpaid
                    </option>

                    <option value="Paid">
                      Paid
                    </option>
                  </select>
                </div>

              </div>

              <div className="mt-4 d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <i className="bi bi-save me-2"></i>
                  Save Salary
                </button>

                <Link
                  to="/salary"
                  className="btn btn-secondary"
                >
                  Cancel
                </Link>

              </div>

            </form>

          </div>
        </div>

      </div>
    </section>
  );
}

export default SalaryAdd;
