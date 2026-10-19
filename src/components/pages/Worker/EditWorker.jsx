import React from "react";
import { useParams, useNavigate } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const EditWorker = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const [worker, setWorkers] = React.useState({
    name: "",
    phone: "",
    nid: "",
    address: "",
    department_id: "",
    designation_id: "",
    joining_date: "",
    basic_salary: "",
    status: "Active",
  });
  const [departments, setDepartments] = React.useState([]);
  const [designations, setDesignations] = React.useState([]);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  async function fetchWorker() {
    const res = await axios.get("workers/single.php?id=" + id);
    setWorkers(res?.data?.data[0]);
  }

  // Department & Designation list (endpoint tomar project er moto change kore nio)
  async function fetchDepartments() {
    try {
      const res = await axios.get("departments/index.php");
      setDepartments(res?.data?.data || []);
    } catch (e) {
      setDepartments([]);
    }
  }

  async function fetchDesignations() {
    try {
      const res = await axios.get("designations/index.php");
      setDesignations(res?.data?.data || []);
    } catch (e) {
      setDesignations([]);
    }
  }

  React.useEffect(() => {
    fetchWorker();
    fetchDepartments();
    fetchDesignations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await axios.post("workers/update.php?id="+id, { ...worker, id });
      navigate("/workers");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Update failed. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

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
            <form onSubmit={handleSubmit}>
              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit Worker
                </h5>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={worker.name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={worker.phone || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">NID</label>
                    <input
                      type="text"
                      name="nid"
                      className="form-control"
                      value={worker.nid || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      value={worker.address || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Department</label>
                    {departments.length > 0 ? (
                      <select
                        name="department_id"
                        className="form-select"
                        value={worker.department_id || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="department_id"
                        className="form-control"
                        value={worker.department_id || ""}
                        onChange={handleChange}
                      />
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Designation</label>
                    {designations.length > 0 ? (
                      <select
                        name="designation_id"
                        className="form-select"
                        value={worker.designation_id || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select Designation</option>
                        {designations.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="designation_id"
                        className="form-control"
                        value={worker.designation_id || ""}
                        onChange={handleChange}
                      />
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Joining Date</label>
                    <input
                      type="date"
                      name="joining_date"
                      className="form-control"
                      value={worker.joining_date || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">
                      Basic Salary (৳)
                    </label>
                    <input
                      type="number"
                      name="basic_salary"
                      className="form-control"
                      value={worker.basic_salary || ""}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={worker.status || "Active"}
                      onChange={handleChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Update Worker"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditWorker;
