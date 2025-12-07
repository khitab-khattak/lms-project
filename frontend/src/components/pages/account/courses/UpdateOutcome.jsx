import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { apiUrl, token } from "../../../common/Config";

const UpdateOutcome = ({ handleClose, showOutcome, outcomes, setOutcomes, outcomeData }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (outcomeData) {
      reset({ outcome: outcomeData.text });
    }
  }, [outcomeData, reset]);

  const onSubmit = async (data) => {
    if (!data.outcome.trim()) return toast.error("Outcome cannot be empty");

    setLoading(true);
    try {
      const res = await axios.put(
        `${apiUrl}/outcome/update/${outcomeData.id}`,
        { outcome: data.outcome },
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
        const updated = outcomes.map((outcome) =>
          outcome.id === outcomeData.id ? { ...outcome, text: data.outcome } : outcome
        );
        setOutcomes(updated);

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
    <Modal show={showOutcome} onHide={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Outcome</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="outcome" className="form-label">Outcome</label>
            <input
              id="outcome"
              type="text"
              {...register("outcome", { required: "The outcome field is required" })}
              className={`form-control ${errors.outcome ? "is-invalid" : ""}`}
              placeholder="Outcome"
            />
            {errors.outcome && <p className="invalid-feedback">{errors.outcome.message}</p>}
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

export default UpdateOutcome;
