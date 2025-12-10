import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import UpdateRequirement from "./UpdateRequirement";

const ManageRequirement = () => {
    const [loading, setLoading] = useState(false);
      const [requirements, setrequirements] = useState([]);
      const [requirementData, setrequirementData] = useState(null);
    
      const [showrequirement, setShowrequirement] = useState(false);
      const handleClose = () => setShowrequirement(false);
      const handleShow = (requirement) => {
        setrequirementData(requirement);
        setShowrequirement(true);
      };
      const params = useParams();
      const { register, handleSubmit, reset, formState: { errors } } = useForm();
    
      // Add requirement only
      const onSubmit = async (data) => {
        if (!data.requirement.trim()) return toast.error("Requirement cannot be empty");
        setLoading(true);
    
        try {
          const res = await axios.post(
            `${apiUrl}/requirements`,
            { requirement: data.requirement.trim(), course_id: params.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
    
          if (res.data.status === 200) {
            toast.success(res.data.message);
            reset();
            fetchrequirements();
          } else {
            toast.error(res.data.message || "Failed to save requirement");
          }
        } catch (err) {
          console.error(err);
          toast.error("Network error, please try again");
        }
    
        setLoading(false);
      };
    
      // Fetch requirements for current course
      const fetchrequirements = async () => {
        try {
          const res = await axios.get(`${apiUrl}/requirements?course_id=${params.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });
    
          if (res.data.status === 200) {
            setrequirements(res.data.data);
          } else {
            toast.error(res.data.message || "Failed to fetch requirements");
          }
        } catch (err) {
          console.error(err);
          toast.error("Network error, please try again");
        }
      };
    
      // Delete requirement
      const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this requirement?")) return;
    
        try {
          const res = await axios.delete(`${apiUrl}/requirement/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });
    
          if (res.data.status === 200) {
            toast.success(res.data.message);
            fetchrequirements();
          } else {
            toast.error(res.data.message || "Failed to delete requirement");
          }
        } catch (err) {
          console.error(err);
          toast.error("Network error, please try again");
        }
      };
    
      useEffect(() => {
        fetchrequirements();
      }, []);
  return (
    <>
    <div className="card shadow-lg border-0 mt-4">
      <div className="card-body p-4">
        <h4 className="h5 mb-3">Add Requirement</h4>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <input
              {...register("requirement", { required: "The Requirement field is required" })}
              type="text"
              className={`form-control mb-3 ${errors.requirement ? "is-invalid" : ""}`}
              placeholder="requirement"
            />
            {errors.requirement && <p className="invalid-feedback">{errors.requirement.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>

        <div className="mt-4">
          <h5>Existing requirements:</h5>

          {requirements.length === 0 ? (
            <p className="text-muted">No requirements yet.</p>
          ) : (
            requirements.map((requirement) => (
              <div key={requirement.id} className="card mt-2">
                <div className="card-body p-2 d-flex align-items-center justify-content-between">
                  <div className="me-2">
                    <MdDragIndicator size={20} />
                  </div>

                  <div className="flex-grow-1">{requirement.text}</div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleShow(requirement)}
                    >
                      <BsPencilSquare />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(requirement.id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

    <UpdateRequirement
      requirementData={requirementData}
      showrequirement={showrequirement}
      handleClose={handleClose}
      requirements={requirements}
      setrequirements={setrequirements}
    />
  </>
  )
}

export default ManageRequirement