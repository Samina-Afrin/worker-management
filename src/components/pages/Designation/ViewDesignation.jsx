
import { Link, useParams } from "react-router";

function ViewDesignation() {
  const { id } = useParams();

  const designations = [
    {
      id: 1,
      name: "Software Developer",
      description: "Develops and maintains software applications",
      basicSalary: 40000,
      status: "Active",
    },
    {
      id: 2,
      name: "HR Officer",
      description: "Handles employee and HR activities",
      basicSalary: 35000,
      status: "Active",
    },
    {
      id: 3,
      name: "Accountant",
      description: "Manages company accounts",
      basicSalary: 30000,
      status: "Inactive",
    },
  ];

  const designation = designations.find(
    (item) => item.id === Number(id)
  );

  if (!designation) {
    return (
      <div className="container py-5">

        <div className="alert alert-warning">
          Designation not found.
        </div>

        <Link
          to="/designation"
          className="btn btn-secondary"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Designation
        </Link>

      </div>
    );
  }

  return (
    <>
      <section className="hero shop-hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Designation Details</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-section before-footer-section">
        <div className="container">

          <div className="card shadow-sm">

            <div className="card-body">

              <div className="row g-4">

                <div className="col-md-6">
                  <div className="border rounded p-3">
                    <small className="text-muted">
                      Designation Name
                    </small>

                    <h5 className="mt-2 mb-0">
                      {designation.name}
                    </h5>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3">
                    <small className="text-muted">
                      Basic Salary
                    </small>

                    <h5 className="mt-2 mb-0">
                      ৳{" "}
                      {Number(
                        designation.basicSalary
                      ).toLocaleString()}
                    </h5>
                  </div>
                </div>

                <div className="col-12">
                  <div className="border rounded p-3">
                    <small className="text-muted">
                      Description
                    </small>

                    <p className="mt-2 mb-0">
                      {designation.description}
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3">
                    <small className="text-muted">
                      Status
                    </small>

                    <div className="mt-2">

                      <span
                        className={`badge ${
                          designation.status === "Active"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {designation.status}
                      </span>

                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-4 d-flex gap-2">

                <Link
                  to={`/designation/edit/${designation.id}`}
                  className="btn btn-warning"
                >
                  <i className="bi bi-pencil me-2"></i>
                  Edit
                </Link>

                <Link
                  to="/designation"
                  className="btn btn-secondary"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>
    </>
  );
}

export default ViewDesignation;
