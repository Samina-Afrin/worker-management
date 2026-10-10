
import { useState } from "react";
import { Link } from "react-router";

function AddDesignation() {
  const [designation, setDesignation] = useState({
    name: "",
    description: "",
    basicSalary: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setDesignation({
      ...designation,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Designation Added:", designation);

    alert("Designation added successfully!");
  };

  return (
    <>
      <section className="hero shop-hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Add Designation</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-section before-footer-section">
        <div className="container">

          <div className="card shadow-sm">
            <div className="card-body">

              <form onSubmit={handleSubmit}>

                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label">
                      Designation Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter designation name"
                      value={designation.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Basic Salary
                    </label>

                    <input
                      type="number"
                      name="basicSalary"
                      className="form-control"
                      placeholder="Enter basic salary"
                      value={designation.basicSalary}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">
                      Description
                    </label>

                    <textarea
                      name="description"
                      className="form-control"
                      rows="4"
                      placeholder="Enter designation description"
                      value={designation.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Status
                    </label>

                    <select
                      name="status"
                      className="form-select"
                      value={designation.status}
                      onChange={handleChange}
                    >
                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
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
                    Save Designation
                  </button>

                  <Link
                    to="/designation"
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
    </>
  );
}

export default AddDesignation;
