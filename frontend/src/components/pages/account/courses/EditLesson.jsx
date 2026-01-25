import React, { useEffect, useState, useRef, useMemo } from "react";
import Layout from "../../../common/Layout";
import { Link, useParams } from "react-router-dom";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, token } from "../../../common/Config";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import LessonVideo from "./LessonVideo";

const EditLesson = ({ placeholder }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState([]); // Kept your original state name
  const editor = useRef(null);
  const [checked, setChecked] = useState(false);
  const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typings...",
    }),
    [placeholder]
  );

  const params = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await axios.put(
        `${apiUrl}/lesson/update/${params.id}`,
        {
          title: data.title,
          chapter_id: data.chapter_id, // This ensures chapter actually changes
          duration: data.duration,
          description: content,
          status: data.status,
          free_preview: data.free_preview ? true : false,
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
        getLessons();
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error, please try again");
    }

    setLoading(false);
  };

  const getChapters = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/chapters?course_id=${params.courseId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 200) {
        setChapters(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const getLessons = async () => {
    try {
      const response = await axios.get(`${apiUrl}/lesson/show/${params.id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {
        const lessonData = response.data.data;
        setLessons(lessonData);

        reset({
          title: lessonData.title,
          chapter_id: lessonData.chapter_id,
          duration: lessonData.duration,
          status: lessonData.status,
        });

        setChecked(lessonData.is_free_preview === "yes" ? true : false);
        setContent(lessonData.description || "");
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast.error("Error fetching lesson data");
    }
  };

  useEffect(() => {
    getChapters();
    getLessons();
  }, [params.courseId, params.id]);

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-transparent p-0 mb-0">
              <li className="breadcrumb-item">
                <Link to="/account">Account</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Edit Lesson
              </li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Edit Lesson</h2>
                <Link
                  to={`/account/courses/edit/${params.courseId}`}
                  className="btn btn-primary"
                >
                  Back
                </Link>
              </div>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row">
                {/* LEFT SIDE — lesson Form */}
                <div className="col-md-8">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card border-0 shadow-lg">
                      <div className="card-body p-4">
                        <h4 className="h5 border-bottom pb-3 mb-3">
                          Basic Information
                        </h4>

                        {/* Title */}
                        <div className="mb-3">
                          <label className="form-label">Title</label>
                          <input
                            {...register("title", {
                              required: "The Title field is required",
                            })}
                            type="text"
                            className={`form-control ${
                              errors.title ? "is-invalid" : ""
                            }`}
                            placeholder="Title"
                          />
                          {errors.title && (
                            <p className="invalid-feedback">
                              {errors.title.message}
                            </p>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Chapter</label>

                          <select
                            {...register("chapter_id", {
                              required: "Please select a chapter",
                            })}
                            className={`form-select ${
                              errors.chapter_id ? "is-invalid" : ""
                            }`}
                          >
                            <option value="">-- Choose Chapter --</option>

                            {chapters.map((chapter) => (
                              <option key={chapter.id} value={chapter.id}>
                                {chapter.chapter || chapter.title}
                              </option>
                            ))}
                          </select>

                          {errors.chapter_id && (
                            <p className="invalid-feedback">
                              {errors.chapter_id.message}
                            </p>
                          )}
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Duration (mins)</label>
                          <input
                            {...register("duration", {
                              required: "The Duration field is required",
                              valueAsNumber: true, // ensures the input is treated as a number
                              min: {
                                value: 1, // minimum value > 0
                                message: "Duration must be greater than 0",
                              },
                            })}
                            type="number"
                            className={`form-control ${
                              errors.duration ? "is-invalid" : ""
                            }`}
                            placeholder="Duration"
                          />
                          {errors.duration && (
                            <p className="invalid-feedback">
                              {errors.duration.message}
                            </p>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Description</label>
                          <JoditEditor
                            ref={editor}
                            value={content}
                            config={{
                              ...config,
                              placeholder: content ? "" : "Start typing...", // hide placeholder if content exists
                            }}
                            tabIndex={1} // tabIndex of textarea
                            onBlur={(newContent) => setContent(newContent)}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Status</label>
                          <select
                            {...register("status")}
                            className="form-select"
                          >
                            <option value="">-- Select Status --</option>
                            <option value="1">Active</option>
                            <option value="0">Block</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <div className="form-check">
                            <input
                              {...register("free_preview")}
                              type="checkbox"
                              className="form-check-input border-secondary"
                              id="free_preview"
                              checked={checked}
                              onChange={(e) => setChecked(e.target.checked)}
                            />
                            <label
                              className="form-check-label  ms-2"
                              htmlFor="free_preview"
                            >
                              Free Lesson
                            </label>
                          </div>
                          <button
                            className="btn btn-primary mt-4"
                            disabled={loading}
                          >
                            {loading ? "Updating..." : "Update"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-md-4">
                  <LessonVideo lessons={lessons} setLessons={setLessons} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditLesson;
