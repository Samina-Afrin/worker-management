
import { Link } from "react-router";

function SalaryDetails({ salary }) {
  if (!salary) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Salary information not found.
        </div>

        <Link to="/salary" className="btn btn-secondary">
          Back to Salary List
        </Link>
      </div>
    );
  }

  return (
    <section className="product-section before-footer-section">
      <div className="container">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Salary Details</h2>
            <p className="text-muted mb-0">
              Detailed salary information
            </p>
          </div>

          <Link
            to="/salary"
            className="btn btn-secondary"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </Link>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">

            <div className="row g-4">

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">
                    Worker Name
                  </small>

                  <h5 className="mb-0 mt-1">
                    {salary.workerName}
                  </h5>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">
                    Salary Month
                  </small>

                  <h5 className="mb-0 mt-1">
                    {salary.month}
                  </h5>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">
                    Basic Salary
                  </small>

                  <h5 className="mb-0 mt-1">
                    ৳ {Number(salary.basicSalary).toLocaleString()}
                  </h5>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">
                    Present Days
                  </small>

                  <h5 className="mb-0 mt-1">
                    {salary.presentDays} Days
                  </h5>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">
                    Bonus
                  </small>

                  <h5 className="mb-0 mt-1 text-success">
                    + ৳ {Number(salary.bonus || 0).toLocaleString()}
                  </h5>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">
                    Deduction
                  </small>

                  <h5 className="mb-0 mt-1 text-danger">
                    - ৳ {Number(salary.deduction || 0).toLocaleString()}
                  </h5>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">
                    Total Salary
                  </small>

                  <h4 className="mb-0 mt-1">
                    ৳ {Number(salary.totalSalary).toLocaleString()}
                  </h4>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">
                    Payment Status
                  </small>

                  <div className="mt-2">
                    <span
                      className={`badge ${
                        salary.status === "Paid"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {salary.status}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default SalaryDetails;
