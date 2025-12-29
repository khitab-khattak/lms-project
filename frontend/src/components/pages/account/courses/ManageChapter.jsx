import React, { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import Accordion from "react-bootstrap/Accordion";
import UpdateChapter from "./UpdateChapter";
import { Link } from "react-router-dom";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { HiMiniPencilSquare } from "react-icons/hi2";
import CreateLesson from "./CreateLesson";

const ManageChapter = ({ params, course }) => {
  const [loading, setLoading] = useState(false);
  const [chapterData, setChapterData] = useState(null);
  //update chapter
  const [showChapter, setShowChapter] = useState(false);
  const handleClose = () => setShowChapter(false);
  const handleShow = (chapter) => {
    setChapterData(chapter);
    setShowChapter(true);
  };
  //add show lesson
  const [showLesson, setShowLesson] = useState(false);
  const handleCloseLesson = () => setShowLesson(false);
  const handleShowLesson = (chapter) => {
    setChapterData(chapter);
    setShowLesson(true);
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
        setChapters({ type: "DELETE_CHAPTERS", payload: { id } });
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
          <div className="d-flex justify-content-between">
            <h4 className="h5 mb-3">Add chapter</h4>
            <Link onClick={() => handleShowLesson()}>
              <FaPlus size={12} /> <strong>Add Lesson</strong>
            </Link>
          </div>

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
                <Accordion.Header>
                  <span className="fw-bold">{chapter.title}</span>
                </Accordion.Header>
                <Accordion.Body>
                  {/* Header Section */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0 text-secondary">Lessons</h5>
                    <button className="btn btn-link btn-sm text-decoration-none fw-bold">
                      Reorder Lessons
                    </button>
                  </div>

                  {/* Lessons List */}
                  <div className="mb-4">
                    {chapter.lessons &&
                      chapter.lessons.map((lesson) => (
                        <div
                          className="card shadow-sm px-3 py-2 mb-2 border-0 bg-light-hover"
                          key={lesson.id}
                        >
                          <div className="row shadow px-3 py-2 align-items-center">
                            {/* Left Side: Lesson Title */}
                            <div className="col-md-8 col-12">
                              <h6 className="mb-0 text-dark">{lesson.title}</h6>
                            </div>

                            {/* Right Side: Metadata and Actions */}
                            <div className="col-md-4 d-flex align-items-center justify-content-md-end mt-2 mt-md-0">
                              {
                                lesson.duration > 0 &&   <small className="text-muted fw-bold me-3 text-nowrap">
                                20 mins
                              </small>
                              }
                              {
                                lesson.is_free_preview === 'yes' && <span className="badge bg-success me-3">
                                preview
                              </span>
                              }

                              {/* Action Icons with spacing */}
                              <div className="d-flex gap-2">
                                <Link>
                                <HiMiniPencilSquare className="text-primary cursor-pointer fs-5" />
                                </Link>
                                <Link>
                                <FaTrashAlt className="text-danger cursor-pointer" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <hr className="my-4 text-muted" />

                  {/* Chapter Actions */}
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      onClick={() => deleteChapter(chapter.id)}
                      className="btn btn-outline-danger btn-sm px-3"
                    >
                      Delete Chapter
                    </button>
                    <button
                      onClick={() => handleShow(chapter)}
                      className="btn btn-primary btn-sm px-3"
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
      <CreateLesson
        showLesson={showLesson}
        handleCloseLesson={handleCloseLesson}
        course={course}
      />
    </>
  );
};

export default ManageChapter;
