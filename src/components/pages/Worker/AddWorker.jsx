import React, { useState } from "react";
import Layout from "../../Layout";

const AddWorker = ({ onAdd, onClose }) => {

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    nid: "",
    address: "",
    department: "",
    designation: "",
    joiningDate: "",
    basicSalary: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAdd(formData);
  };

  return (
    <Layout>
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >

      <div className="modal-dialog modal-lg modal-dialog-centered">

        <div className="modal-content">

          <div className="modal-header">

            <h5 className="modal-title">
              <i className="bi bi-person-plus-fill me-2"></i>
              Add New Worker
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
                 {/* ID */}
                <div className="col-md-6">
                  <label className="form-label">
                    Id
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


                {/* Name */}
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

                {/* Phone */}
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

                {/* NID */}
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
                    required
                  />
                </div>

                {/* Address */}
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
                    required
                  />
                </div>

                {/* Department */}
                <div className="col-md-6">
                  <label className="form-label">
                    Department
                  </label>

                  <select
                    name="department"
                    className="form-select"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                {/* Designation */}
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
                    required
                  />
                </div>

                {/* Joining Date */}
                <div className="col-md-6">
                  <label className="form-label">
                    Joining Date
                  </label>

                  <input
                    type="date"
                    name="joining_date"
                    className="form-control"
                    value={formData.joining_date}
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
                    name="basic_salary"
                    className="form-control"
                    value={formData.basic_salary}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Status */}
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
                <i className="bi bi-save me-2"></i>
                Save Worker
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
    </Layout>
  );
};

export default AddWorker;