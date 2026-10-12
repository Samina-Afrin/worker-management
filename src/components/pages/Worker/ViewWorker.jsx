
import React from "react";
import Layout from "../../Layout";

const ViewWorker = ({ worker, onClose }) => {
  if (!worker) return null;

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

          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person-vcard me-2"></i>
              Worker Details
            </h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <div className="row g-3">

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">ID</small>
                  <h6 className="mb-0">{worker.id}</h6>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">Name</small>
                  <h6 className="mb-0">{worker.name}</h6>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">Phone</small>
                  <h6 className="mb-0">{worker.phone}</h6>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">NID</small>
                  <h6 className="mb-0">{worker.nid}</h6>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">Address</small>
                  <h6 className="mb-0">{worker.address}</h6>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">Department</small>
                  <h6 className="mb-0">{worker.department}</h6>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">Designation</small>
                  <h6 className="mb-0">{worker.designation}</h6>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">Joining Date</small>
                  <h6 className="mb-0">{worker.joining_date}</h6>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">Basic Salary</small>
                  <h6 className="mb-0">
                    ৳ {Number(worker.basic_salary || 0).toLocaleString()}
                  </h6>
                </div>
              </div>

              <div className="col-12">
                <div className="border rounded p-3">
                  <small className="text-muted">Status</small>

                  <div>
                    <span
                      className={`badge ${
                        worker.status === "Active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {worker.status}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ViewWorker;
