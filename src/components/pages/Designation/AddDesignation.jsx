
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const Adddesignation = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);


  // Fetch Designation for Update
  async function fetchDesignation() {
    try {
      const res = await axios.get("designation/single.php?id=" + id);

      const designationData = Array.isArray(res?.data?.data)
        ? res.data.data[0]
        : res?.data?.data;

      if (designationData) {
        setFormData({
          name: designationData.name || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch designation:", error);
    }
  }

  useEffect(() => {
    if (id) {
      fetchDesignation();
    }
  }, [id]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);

    try {
      const url = id
        ? "designation/update.php?id=" + id
        : "designation/create.php";

      const res = await axios.post(url, data);

      if (
        res?.data?.status === true ||
        res?.data?.status === "success" ||
        res?.data?.status === 1
      ) {
        window.location.href = "/designation";
      } else {
        alert(res?.data?.message || "Failed to save designation.");
      }
    } catch (error) {
      console.error("Designation save failed:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      alert(`Failed to save designation: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">
              <i className="bi bi-person-badge me-2"></i>
              {id ? "Update Designation" : "Add New Designation"}
            </h5>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">

                {/* ID */}
                {id && (
                  <div className="col-md-6">
                    <label className="form-label">ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={id}
                      readOnly
                    />
                  </div>
                )}

                {/* Designation Name */}
                <div className="col-md-6">
                  <label className="form-label">
                    Designation Name
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

              </div>
            </div>

            <div className="card-footer bg-white text-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <i className="bi bi-save me-2"></i>
                {loading
                  ? "Saving..."
                  : id
                  ? "Update Designation"
                  : "Save Designation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Adddesignation;
