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
  const [showChapter, setShowChapter] = useState(false);
  const handleClose = () => setShowChapter(false);
  const handleShow = (chapter) => {
    setChapterData(chapter);
    setShowChapter(true);
  };

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
      case "ADD_LESSON_TO_CHAPTER":
        return state.map((ch) => {
          if (ch.id === parseInt(action.payload.chapter_id)) {
            return {
              ...ch,
              lessons: [...(ch.lessons || []), action.payload.lesson],
            };
          }
          return ch;
        });
      case "DELETE_LESSON":
        return state.map((chapter) => ({
          ...chapter,
          lessons: chapter.lessons
            ? chapter.lessons.filter(
                (lesson) => lesson.id !== action.payload.id
              )
            : [],
        }));
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
          },
        }
      );

      if (res.data.status === 200) {
        setChapters({ type: "ADD_CHAPTERS", payload: res.data.data });
        toast.success(res.data.message);
        reset();
      }
    } catch (err) {
      toast.error("Network error, please try again");
    }
    setLoading(false);
  };
  const deleteChapter = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this chapter? All lessons inside will be lost."
      )
    )
      return;

    try {
      const res = await axios.delete(`${apiUrl}/chapter/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.data.status === 200) {
        setChapters({ type: "DELETE_CHAPTERS", payload: { id } });
        toast.success(res.data.message || "Chapter deleted successfully");
      } else {
        toast.error(res.data.message || "Failed to delete chapter");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error, please try again");
    }
  };
  const deleteLesson = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const res = await axios.delete(`${apiUrl}/lesson/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (res.data.status === 200) {
        setChapters({ type: "DELETE_LESSON", payload: { id } });
        toast.success(res.data.message || "Lesson deleted");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };
  useEffect(() => {
    if (course.chapters) {
      setChapters({ type: "SET_CHAPTERS", payload: course.chapters });
    }
  }, [course.chapters]);

  return (
    <>
      <div className="card shadow-lg border-0 mt-3">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between">
            <h4 className="h5 mb-3">Add chapter</h4>
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => handleShowLesson()}
            >
              <FaPlus size={12} /> <strong>Add Lesson</strong>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <input
                {...register("chapter", { required: "Required" })}
                type="text"
                className={`form-control ${errors.chapter ? "is-invalid" : ""}`}
                placeholder="Chapter"
              />
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
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0 h5">Lessons</h4>
                    <a className="text-primary" href=""><strong>Reorder Lessons</strong></a>
                  </div>

                  {/* Lessons List */}
                  <div className="mb-4">
                    {chapter.lessons && chapter.lessons.length > 0 ? (
                      chapter.lessons.map((lesson) => (
                        <div
                          className="card shadow px-3 py-2 mb-2 border-0 bg-light-hover"
                          key={lesson.id}
                        >
                          <div className="row align-items-center">
                            {/* Left */}
                            <div className="col-md-8 col-12">
                              <h6 className="mb-0 text-dark">{lesson.title}</h6>
                            </div>

                            {/* Right */}
                            <div className="col-md-4 d-flex align-items-center justify-content-md-end mt-2 mt-md-0">
                              {lesson.duration > 0 && (
                                <small className="text-muted fw-bold me-3 text-nowrap">
                                  {lesson.duration} mins
                                </small>
                              )}

                              {lesson.is_free_preview === "yes" && (
                                <span className="badge bg-success me-3">
                                  preview
                                </span>
                              )}

                              <div className="d-flex gap-2">
                                <Link
                                  to={`/account/lesson/edit/${params.id}/${lesson.id}`}
                                >
                                  <HiMiniPencilSquare className="text-primary fs-5" />
                                </Link>

                                <button
                                  className="btn btn-link p-0"
                                  onClick={() => deleteLesson(lesson.id)}
                                >
                                  <FaTrashAlt className="text-danger" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No lessons added yet.</p>
                    )}
                  </div>

                  <hr className="my-4 text-muted" />

                  {/* Chapter Actions */}
                  <div className="d-flex  gap-2">
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
        chapters={chapters}
        setChapters={setChapters}
        params={params}
      />
    </>
  );
};
export default ManageChapter;
