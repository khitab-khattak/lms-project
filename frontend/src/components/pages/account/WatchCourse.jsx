import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../common/Layout";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Accordion, ProgressBar } from "react-bootstrap";
import { MdSlowMotionVideo } from "react-icons/md";
import { useParams } from "react-router-dom";
import { apiUrl, token } from "../../common/Config";
import axios from "axios";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";

const WatchCourse = () => {
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  // ===============================
  // Fetch Course + Activity
  // ===============================
  const enrollCourse = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/enroll/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.status === 200) {
        setCourse(res.data.course);
        setActiveLesson(res.data.activitylesson);
        setCompletedLessons(res.data.completedLessons);
        setLoading(false);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    enrollCourse();
  }, [params.id]);

  // ===============================
  // Save Watching Activity
  // ===============================
  const showLesson = async (lesson) => {
    setActiveLesson(lesson);

    try {
      await axios.post(
        `${apiUrl}/save-activity`,
        {
          lesson_id: lesson.id,
          chapter_id: lesson.chapter_id,
          course_id: params.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // ===============================
  // Mark Lesson Complete
  // ===============================
  const markAsComplete = async () => {
    if (!activeLesson) return;

    try {
      const res = await axios.post(
        `${apiUrl}/mark-as-complete`,
        {
          lesson_id: activeLesson.id,
          chapter_id: activeLesson.chapter_id,
          course_id: params.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (res.status === 200) {
        setCompletedLessons((prev) => {
          if (!prev.includes(activeLesson.id)) {
            return [...prev, activeLesson.id];
          }
          return prev;
        });
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // ===============================
  // Progress Calculation
  // ===============================
  const totalLessons = useMemo(() => {
    if (!course) return 0;

    return course.chapters?.reduce((total, chapter) => {
      return total + (chapter.lessons?.length || 0);
    }, 0);
  }, [course]);

  const progress = useMemo(() => {
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons.length / totalLessons) * 100);
  }, [completedLessons, totalLessons]);

  // ===============================
  // Loading State
  // ===============================
  if (loading) {
    return (
      <Layout>
        <div className="container my-5 text-center">
          <h4>Loading course content...</h4>
        </div>
      </Layout>
    );
  }
  if (!course || !activeLesson) {
    return (
      <Layout>
        <div className="container my-5 text-center">
          <h4>No video content uploaded for this course...</h4>
        </div>
      </Layout>
    );
  }

  const videoUrl = `${apiUrl.replace("/api", "")}/uploads/lesson/videos/${
    activeLesson.video
  }`;

  return (
    <Layout>
      <section className="section-5 my-5">
        <div className="container">
          <div className="row">
            {/* ================= Video Section ================= */}
            <div className="col-md-8">
              <div
                className="video-player-wrapper mb-4"
                style={{
                  position: "relative",
                  paddingTop: "56.25%",
                  backgroundColor: "#000",
                }}
              >
                <ReactPlayer
                  key={activeLesson.id}
                  src={videoUrl}
                  width="100%"
                  height="100%"
                  controls
                  playing
                  muted
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              </div>

              <div className="meta-content">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <h4>{activeLesson.title}</h4>

                  <button
                    disabled={completedLessons.includes(activeLesson.id)}
                    onClick={markAsComplete}
                    className="btn btn-primary px-3"
                  >
                    {completedLessons.includes(activeLesson.id)
                      ? "Completed ✓"
                      : "Mark as Complete"}
                  </button>
                </div>

                <div
                  dangerouslySetInnerHTML={{
                    __html: activeLesson.description,
                  }}
                />
              </div>
            </div>

            {/* ================= Sidebar ================= */}
            <div className="col-md-4">
              <div className="card rounded-0 shadow-sm">
                <div className="card-body">
                  <div className="h6">
                    <strong>{course.title}</strong>
                  </div>

                  {/* Progress */}
                  <div className="py-2">
                    <ProgressBar now={progress} variant="success" />
                    <div className="pt-2 small">{progress}% complete</div>
                  </div>

                  <Accordion flush defaultActiveKey={activeLesson.chapter_id}>
                    {course.chapters?.map((chapter) => (
                      <Accordion.Item eventKey={chapter.id} key={chapter.id}>
                        <Accordion.Header>
                          <strong>{chapter.title}</strong>
                        </Accordion.Header>

                        <Accordion.Body className="p-0">
                          <ul className="list-group list-group-flush">
                            {chapter.lessons?.map((lesson) => (
                              <li
                                key={lesson.id}
                                className={`list-group-item list-group-item-action border-0 ${
                                  activeLesson.id === lesson.id
                                    ? "bg-light text-primary"
                                    : ""
                                }`}
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => showLesson(lesson)}
                              >
                                <MdSlowMotionVideo size={18} className="me-2" />

                                {lesson.title}

                                {completedLessons.includes(lesson.id) && (
                                  <IoMdCheckmarkCircleOutline
                                    size={18}
                                    className="text-success float-end"
                                  />
                                )}
                              </li>
                            ))}
                          </ul>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WatchCourse;
