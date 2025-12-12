import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { apiUrl, token } from "../../../common/Config";

const UpdateRequirement =  ({ handleClose, showrequirement, requirements, setrequirements, requirementData }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
    useEffect(() => {
      if (requirementData) {
        reset({ requirement: requirementData.text });
      }
    }, [requirementData, reset]);
  
    const onSubmit = async (data) => {
      if (!data.requirement.trim()) return toast.error("requirement cannot be empty");
  
      setLoading(true);
      try {
        const res = await axios.put(
          `${apiUrl}/requirement/update/${requirementData.id}`,
          { requirement: data.requirement },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
  
        if (res.data.status === 200) {
          // Update UI instantly
          const updated = requirements.map((requirement) =>
            requirement.id === requirementData.id ? { ...requirement, text: data.requirement } : requirement
          );
          setrequirements(updated);
  
          toast.success(res.data.message);
          handleClose();
          reset();
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        toast.error("Network error, please try again");
      }
      setLoading(false);
    };
  
    return (
      <Modal show={showrequirement} onHide={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Requirement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="requirement" className="form-label">Requirement</label>
              <input
                id="requirement"
                type="text"
                {...register("requirement", { required: "The Requirement field is required" })}
                className={`form-control ${errors.requirement ? "is-invalid" : ""}`}
                placeholder="Requirement"
              />
              {errors.requirement && <p className="invalid-feedback">{errors.requirement.message}</p>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  };
  

export default UpdateRequirement