
import React from "react";
import { useParams } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";




const ViewWorker = () => {
  
  let { id } = useParams();
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
   async function fetchWorker() {
      const res= await axios.get('workers/single.php?id=' + id);
                setWorkers(res?.data?.data[0])
  }
  React.useEffect(() => {
        fetchWorker();
      }, []);

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

           
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <div className="row g-3">

             

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
                  <h6 className="mb-0">{worker.department_id}</h6>
                </div>
              </div>

              <div className="col-md-6">
                <div className="border rounded p-3">
                  <small className="text-muted">Designation</small>
                  <h6 className="mb-0">{worker.designation_id}</h6>
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
            
          </div>

        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ViewWorker;
