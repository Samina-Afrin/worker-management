import React from "react";
import { useParams, useNavigate } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const EditDesignation = () => {
  let { id } = useParams();
  const navigate = useNavigate();

  const [designation, setDesignation] = React.useState({
    name: "",
    description: "",
    status: "Active",
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  async function fetchDesignation() {
    const res = await axios.get("designations/single.php?id=" + id);
    setDesignation(res?.data?.data[0]);
  }

  React.useEffect(() => {
    fetchDesignation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDesignation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await axios.post("designations/update.php?id=" + id, {
        ...designation,
        id,
      });
      navigate("/designation");
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
                  Edit Designation
                </h5>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted">
                      Designation Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={designation.name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={designation.status || "Active"}
                      onChange={handleChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      value={designation.description || ""}
                      onChange={handleChange}
                    />
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
                  {saving ? "Saving..." : "Update Designation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditDesignation;
