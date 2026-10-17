
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const Viewdesignation = () => {
  const { id } = useParams();

  const [designation, setDesignation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Designation Details
  async function fetchDesignation() {
    try {
      setLoading(true);

      const res = await axios.get("designation/single.php?id=" + id);

      const designationData = Array.isArray(res?.data?.data)
        ? res.data.data[0]
        : res?.data?.data;

      if (designationData) {
        setDesignation(designationData);
      } else {
        setDesignation(null);
      }
    } catch (error) {
      console.error("Failed to fetch designation:", error);
      setDesignation(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDesignation();
  }, [id]);

  return (
    <Layout>
      <div className="container mt-4">
        <div className="card shadow-sm">

          {/* Header */}
          <div className="card-header bg-white py-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="mb-0">
                <i className="bi bi-person-badge me-2"></i>
                View Designation
              </h5>

              <Link
                to="/designation"
                className="btn btn-secondary"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to List
              </Link>
            </div>
          </div>

          {/* Body */}
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-primary"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading designation details...</p>
              </div>
            ) : designation ? (
              <>
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i
                      className="bi bi-person-vcard text-primary"
                      style={{ fontSize: "60px" }}
                    ></i>
                  </div>

                  <h4 className="mb-1">{designation.name}</h4>
                  <p className="text-muted mb-0">
                    Designation Details
                  </p>
                </div>

                <hr />

                <div className="row g-3">
                  {/* ID */}
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <label className="text-muted mb-2">
                        Designation ID
                      </label>
                      <h6 className="mb-0">{designation.id}</h6>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <label className="text-muted mb-2">
                        Designation Name
                      </label>
                      <h6 className="mb-0">{designation.name}</h6>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Link
                    to="/designation"
                    className="btn btn-outline-secondary"
                  >
                    Cancel
                  </Link>

                  <Link
                    to={`/designation/edit/${designation.id}`}
                    className="btn btn-primary"
                  >
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Designation
                  </Link>
                </div>
              </>
            ) : (
              <div className="alert alert-warning mb-0">
                Designation not found.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Viewdesignation;
