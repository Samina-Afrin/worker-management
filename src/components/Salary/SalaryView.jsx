
import { Link, useParams } from "react-router";

function SalaryView() {
  const { id } = useParams();

  const salaries = [
    {
      id: 1,
      workerName: "Samina Afrin",
      month: "2026-09",
      basicSalary: 40000,
      presentDays: 26,
      bonus: 3000,
      deduction: 1000,
      totalSalary: 42000,
      paymentDate: "2026-09-30",
      status: "Paid",
    },
    {
      id: 2,
      workerName: "Abu Bakkar",
      month: "2026-09",
      basicSalary: 100000,
      presentDays: 24,
      bonus: 5000,
      deduction: 2000,
      totalSalary: 103000,
      paymentDate: "",
      status: "Unpaid",
    },
    {
      id: 3,
      workerName: "Tasfia Saba",
      month: "2026-09",
      basicSalary: 50000,
      presentDays: 25,
      bonus: 2000,
      deduction: 500,
      totalSalary: 51500,
      paymentDate: "2026-09-30",
      status: "Paid",
    },
  ];

  const salary = salaries.find(
    (item) => item.id === Number(id)
  );

  if (!salary) {
    return (
      <div className="container py-5">

        <div className="alert alert-warning">
          Salary record not found.
        </div>

        <Link
          to="/salary"
          className="btn btn-secondary"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Salary List
        </Link>

      </div>
    );
  }

  return (
    <section className="product-section before-footer-section">
      <div className="container">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="mb-1">
              Salary Slip
            </h2>

            <p className="text-muted mb-0">
              Monthly salary details
            </p>
          </div>

          <div className="d-flex gap-2">

            <button
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              <i className="bi bi-printer me-2"></i>
              Print
            </button>

            <Link
              to="/salary"
              className="btn btn-secondary"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </Link>

          </div>

        </div>

        {/* Salary Slip */}
        <div className="card shadow-sm">

          <div className="card-body p-4">

            <div className="text-center mb-4">

              <h3>
                Employee Salary Slip
              </h3>

              <p className="text-muted mb-0">
                Salary Month: {salary.month}
              </p>

            </div>

            <hr />

            <div className="row mb-4">

              <div className="col-md-6">
                <p className="mb-2">
                  <strong>Worker Name:</strong>{" "}
                  {salary.workerName}
                </p>

                <p className="mb-0">
                  <strong>Salary Month:</strong>{" "}
                  {salary.month}
                </p>
              </div>

              <div className="col-md-6 text-md-end">

                <p className="mb-2">
                  <strong>Payment Date:</strong>{" "}
                  {salary.paymentDate || "Not Paid"}
                </p>

                <p className="mb-0">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      salary.status === "Paid"
                        ? "bg-success"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {salary.status}
                  </span>
                </p>

              </div>

            </div>

            <div className="table-responsive">

              <table className="table table-bordered">

                <thead className="table-light">
                  <tr>
                    <th>Description</th>
                    <th className="text-end">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>
                      Basic Salary
                    </td>

                    <td className="text-end">
                      ৳{" "}
                      {Number(
                        salary.basicSalary
                      ).toLocaleString()}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Present Days
                    </td>

                    <td className="text-end">
                      {salary.presentDays} Days
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Bonus
                    </td>

                    <td className="text-end text-success">
                      + ৳{" "}
                      {Number(
                        salary.bonus
                      ).toLocaleString()}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      Deduction
                    </td>

                    <td className="text-end text-danger">
                      - ৳{" "}
                      {Number(
                        salary.deduction
                      ).toLocaleString()}
                    </td>
                  </tr>

                  <tr className="table-light">

                    <th>
                      Total Salary
                    </th>

                    <th className="text-end">
                      ৳{" "}
                      {Number(
                        salary.totalSalary
                      ).toLocaleString()}
                    </th>

                  </tr>

                </tbody>

              </table>

            </div>

            <div className="text-center mt-4">

              <p className="text-muted mb-0">
                This is a computer generated salary slip.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default SalaryView;
