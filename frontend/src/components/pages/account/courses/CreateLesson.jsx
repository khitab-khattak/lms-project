import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { apiUrl, token } from "../../../common/Config";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const CreateLesson = ({ course, showLesson, handleCloseLesson }) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${apiUrl}/lessons`,
        {
          chapter_id: data.chapter_id,
          lesson: data.lesson,
          status: data.status,
        },
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
        handleCloseLesson();
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
    <>
      <Modal show={showLesson} onHide={handleCloseLesson}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Lesson</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Chapter */}
            <div className="mb-3">
              <label htmlFor="chapter_id" className="form-label">
                Chapter
              </label>

              <select
                id="chapter_id"
                {...register("chapter_id", {
                  required: "Please select a chapter",
                })}
                className={`form-select ${
                  errors.chapter_id ? "is-invalid" : ""
                }`}
              >
                <option value="">Select chapter</option>
                {course?.chapters?.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>

              {errors.chapter_id && (
                <div className="invalid-feedback">
                  {errors.chapter_id.message}
                </div>
              )}
            </div>

            {/* Lesson */}
            <div className="mb-3">
              <label htmlFor="lesson" className="form-label">
                Lesson
              </label>

              <input
                id="lesson"
                type="text"
                {...register("lesson", {
                  required: "The Lesson field is required",
                })}
                className={`form-control ${errors.lesson ? "is-invalid" : ""}`}
                placeholder="Lesson name"
              />

              {errors.lesson && (
                <div className="invalid-feedback">{errors.lesson.message}</div>
              )}
            </div>

            {/* Status */}
            <div className="mb-3">
              <label htmlFor="status" className="form-label">
                Status
              </label>

              <select
                id="status"
                {...register("status", {
                  required: "Please select a status",
                })}
                className={`form-select ${errors.status ? "is-invalid" : ""}`}
              >
                <option value="">Select status</option>
                <option value="1">Active</option>
                <option value="0">Block</option>
              </select>

              {errors.status && (
                <div className="invalid-feedback">{errors.status.message}</div>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default CreateLesson;
