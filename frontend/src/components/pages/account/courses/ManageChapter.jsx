import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import Accordion from "react-bootstrap/Accordion";
import UpdateChapter from "./UpdateChapter";

const ManageChapter = ({ params, course }) => {
  const [loading, setLoading] = useState(false);
  const [chapterData, setChapterData] = useState(null);

  const [showChapter, setShowChapter] = useState(false);
  const handleClose = () => setShowChapter(false);
  const handleShow = (chapter) => {
    setChapterData(chapter);
    setShowChapter(true);
  };

  const chapterReducer = (state, action) => {
    switch (action.type) {
      case "SET_CHAPTERS":
        return action.payload;
      case "ADD_CHAPTERS":
        return [...state, action.payload];
      case "UPDATE_CHAPTERS":
        return state.map((chapter) =>
          chapter.id === action.payload.id ? action.payload : chapter
        );

      case "DELETE_CHAPTERS":
        return state.filter((chapter) => chapter.id != action.payload.id);
      default:
        return state;
    }
  };

  const [chapters, setChapters] = useReducer(chapterReducer, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Add chapter only
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${apiUrl}/chapters`,
        { chapter: data.chapter.trim(), course_id: params.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (res.data.status === 200) {
        setChapters({
          type: "ADD_CHAPTERS",
          payload: res.data.data, // backend must return chapter
        });

        toast.success(res.data.message);
        reset();
      } else {
        toast.error(res.data.message || "Failed to save chapter");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error, please try again");
    }

    setLoading(false);
  };

  const deleteChapter = async (id) => {
    if (!window.confirm("Are you sure you want to delete this outcome?"))
      return;

    try {
      const res = await axios.delete(`${apiUrl}/chapter/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.data.status === 200) {
        setChapters({ type: "DELETE_CHAPTERS", payload: {id} });
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to delete chapter");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error, please try again");
    }
  };
  useEffect(() => {
    if (course.chapters) {
      setChapters({ type: "SET_CHAPTERS", payload: course.chapters });
    }
    return;
  }, [course]);

  return (
    <>
      <div className="card shadow-lg border-0 mt-3">
        <div className="card-body p-4">
          <h4 className="h5 mb-3">Add chapter</h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("chapter", {
                  required: "The chapter field is required",
                })}
                type="text"
                className={`form-control mb-3 ${
                  errors.chapter ? "is-invalid" : ""
                }`}
                placeholder="Chapter"
              />
              {errors.chapter && (
                <p className="invalid-feedback">{errors.chapter.message}</p>
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
          <Accordion className="mt-4" defaultActiveKey="0">
            {chapters.map((chapter, index) => (
              <Accordion.Item eventKey={index} key={chapter.id}>
                <Accordion.Header>{chapter.title}</Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex">
                    <button onClick={()=>deleteChapter(chapter.id)} className="btn btn-danger btn-sm">Delete Chapter</button>
                    <button
                      onClick={() => handleShow(chapter)}
                      className="btn btn-primary btn-sm ms-4"
                    >
                      Update Chapter
                    </button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
      <UpdateChapter
        chapterData={chapterData}
        showChapter={showChapter}
        handleClose={handleClose}
        setChapters={setChapters}
      />
    </>
  );
};

export default ManageChapter;
