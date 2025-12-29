import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { apiUrl, token } from "../../../common/Config";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const UpdateChapter = ({
  showChapter,
  handleClose,
  chapterData,
  setChapters,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (chapterData) {
      reset({ chapter: chapterData.title });
    }
  }, [chapterData, reset]);

  const onSubmit = async (data) => {
    if (!data.chapter.trim()) return toast.error("chapter cannot be empty");

    setLoading(true);
    try {
      const res = await axios.put(
        `${apiUrl}/chapter/update/${chapterData.id}`,
        { chapter: data.chapter },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (res.data.status === 200) {
        setChapters({ type: "UPDATE_CHAPTERS", payload: res.data.data });

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
    <>
      <Modal show={showChapter} onHide={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Update chapter</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label htmlFor="chapter" className="form-label">
                chapter
              </label>
              <input
                id="chapter"
                type="text"
                {...register("chapter", {
                  required: "The chapter field is required",
                })}
                className={`form-control ${errors.chapter ? "is-invalid" : ""}`}
                placeholder="chapter"
              />
              {errors.chapter && (
                <p className="invalid-feedback">{errors.chapter.message}</p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default UpdateChapter;
