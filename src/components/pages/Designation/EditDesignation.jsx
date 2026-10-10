
import { useState } from "react";
import { Link, useParams } from "react-router";

function EditDesignation() {
  const { id } = useParams();

  const [designation, setDesignation] = useState({
    id: id,
    name: "Software Developer",
    description: "Develops and maintains software applications",
    basicSalary: 40000,
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

    console.log("Designation Updated:", designation);

    alert("Designation updated successfully!");
  };

  return (
    <>
      <section className="hero shop-hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Edit Designation</h1>
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
                    className="btn btn-warning"
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Update Designation
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

export default EditDesignation;