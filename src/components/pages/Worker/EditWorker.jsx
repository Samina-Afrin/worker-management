import React, { useState } from "react";

const EditWorker = ({ worker, onUpdate, onClose }) => {

  const [formData, setFormData] = useState(worker);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onUpdate(formData);
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >

      <div className="modal-dialog modal-lg modal-dialog-centered">

        <div className="modal-content">

          <div className="modal-header">

            <h5 className="modal-title">
              <i className="bi bi-pencil-square me-2"></i>
              Edit Worker
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="modal-body">

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">
                    <Id></Id>
                  </label>

                  <input
                    type="text"
                    name="id"
                    className="form-control"
                    value={formData.id}
                    onChange={handleChange}
                    required
                  />
                </div>


                <div className="col-md-6">
                  <label className="form-label">
                    Worker Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    NID
                  </label>

                  <input
                    type="text"
                    name="nid"
                    className="form-control"
                    value={formData.nid}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Department
                  </label>

                  <select
                    name="department"
                    className="form-select"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Designation
                  </label>

                  <input
                    type="text"
                    name="designation"
                    className="form-control"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Joining_date
                  </label>

                  <input
                    type="date"
                    name="joining_date"
                    className="form-control"
                    value={formData.joining_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Basic_salary
                  </label>

                  <input
                    type="number"
                    name="basic_salary"
                    className="form-control"
                    value={formData.basic_salary}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Status
                  </label>

                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

              </div>

            </div>

            <div className="modal-footer">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
              >
                <i className="bi bi-check-lg me-2"></i>
                Update Worker
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default EditWorker;