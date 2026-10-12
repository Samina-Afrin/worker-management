import React, { useState } from "react";
import { useParams } from "react-router";
import Layout from "../../Layout";
import axios from "../../../Lib/axios";

const AddWorker = () => {
  
  let { id } = useParams();
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);

  async function fetchDepartment() {
      const res= await axios.get('department/index.php');
                setDepartment(res.data.data)
        
    }

  async function fetchDesignation() {
      const res= await axios.get('designation/index.php');
                setDesignation(res.data.data)
  }
  async function fetchWorker() {
      const res= await axios.get('workers/single.php?id=' + id);
                setFormData(res?.data?.data[0])
  }
    React.useEffect(() => {
        fetchDepartment();
        fetchDesignation();
        if (id) {
            fetchWorker();
        }
    }, []);

  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

   const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
      
        // const data = Object.fromEntries(formData.entries());
        let url = '';
        if (id) {
            url = 'workers/update.php?id=' + id;
        } else {
            url = 'workers/create.php';
        }
        let response = await axios.post(url, formData);

        window.location.href = '/workers';
    };

  return (
    <Layout>
    

      <div className="modal-dialog modal-lg modal-dialog-centered">

        <div className="modal-content">

          <div className="modal-header">

            <h5 className="modal-title">
              <i className="bi bi-person-plus-fill me-2"></i>
              Add New Worker
            </h5>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="modal-body">

              <div className="row g-3">
                
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
                    name="department_id"
                    className="form-select"
                    value={formData.department_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {department && department.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Designation */}
                <div className="col-md-6">
                  <label className="form-label">
                    Designation
                  </label>

                  <select
                    name="designation_id"
                    className="form-select"
                    value={formData.designation_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Designation</option>
                    {designation && designation.map((des) => (
                      <option key={des.id} value={des.id}>
                        {des.name}
                      </option>
                    ))}
                  </select>

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
                type="submit"
                className="btn btn-primary"
              >
                <i className="bi bi-save me-2"></i>
                {id ? "Update Worker" : "Save Worker"}
              </button>

            </div>

          </form>

        </div>

      </div>
    </Layout>
  );
};

export default AddWorker;