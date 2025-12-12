import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import UpdateOutcome from "./UpdateOutcome";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ManageOutcome = () => {
  const [loading, setLoading] = useState(false);
  const [outcomes, setOutcomes] = useState([]);
  const [outcomeData, setOutcomeData] = useState(null);

  const [showOutcome, setShowOutcome] = useState(false);
  const handleClose = () => setShowOutcome(false);
  const handleShow = (outcome) => {
    setOutcomeData(outcome);
    setShowOutcome(true);
  };

  const params = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(outcomes);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setOutcomes(reorderedItems);
    saveOrder(reorderedItems);
  };

  const saveOrder = async (updateOutcomes) => {
    try {
      await axios.post(`${apiUrl}/outcome/reorder`, {
        items: updateOutcomes,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });
  
      toast.success("Order updated");
    } catch (error) {
      toast.error("Failed to save order");
    }
  };
  
  // Add outcome only
  const onSubmit = async (data) => {
    if (!data.outcome.trim()) return toast.error("Outcome cannot be empty");
    setLoading(true);

    try {
      const res = await axios.post(
        `${apiUrl}/outcomes`,
        { outcome: data.outcome.trim(), course_id: params.id },
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
        fetchOutcomes();
      } else {
        toast.error(res.data.message || "Failed to save outcome");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error, please try again");
    }

    setLoading(false);
  };

  // Fetch outcomes for current course
  const fetchOutcomes = async () => {
    try {
      const res = await axios.get(`${apiUrl}/outcomes?course_id=${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.data.status === 200) {
        setOutcomes(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to fetch outcomes");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error, please try again");
    }
  };

  // Delete outcome
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this outcome?"))
      return;

    try {
      const res = await axios.delete(`${apiUrl}/outcome/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.data.status === 200) {
        toast.success(res.data.message);
        fetchOutcomes();
      } else {
        toast.error(res.data.message || "Failed to delete outcome");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error, please try again");
    }
  };

  useEffect(() => {
    fetchOutcomes();
  }, []);

  return (
    <>
      <div className="card shadow-lg border-0">
        <div className="card-body p-4">
          <h4 className="h5 mb-3">Add Outcome</h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("outcome", {
                  required: "The Outcome field is required",
                })}
                type="text"
                className={`form-control mb-3 ${
                  errors.outcome ? "is-invalid" : ""
                }`}
                placeholder="Outcome"
              />
              {errors.outcome && (
                <p className="invalid-feedback">{errors.outcome.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {outcomes.map((outcome, index) => (
                    <Draggable
                      key={outcome.id}
                      draggableId={`${outcome.id}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mt-2 border bg-white shadow-lg  rounded"
                        >
                          <div className="card-body p-2 d-flex align-items-center justify-content-between">
                            <div className="me-2">
                              <MdDragIndicator size={20} />
                            </div>

                            <div className="flex-grow-1">{outcome.text}</div>

                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleShow(outcome)}
                              >
                                <BsPencilSquare />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(outcome.id)}
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
        </div>
      </div>

      <UpdateOutcome
        outcomeData={outcomeData}
        showOutcome={showOutcome}
        handleClose={handleClose}
        outcomes={outcomes}
        setOutcomes={setOutcomes}
      />
    </>
  );
};

export default ManageOutcome;
