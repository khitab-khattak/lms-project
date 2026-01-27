import React, { useEffect } from "react";
import Layout from "../common/Layout";
import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { Accordion, Badge, ListGroup, Card } from "react-bootstrap";
import axios from "axios";
import { apiUrl, token, convertMinutesToHours } from "../common/Config";
import { useParams } from "react-router-dom";
import { LuMonitorPlay } from "react-icons/lu";
import { Link } from "react-router-dom";
import FreePreview from "../common/FreePreview";

const Detail = () => {
  const [show, setShow] = useState(false);
  const [freeLesson, setFreeLesson] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = (lesson) => {
    setFreeLesson(lesson);
    setShow(true);
  };
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const fetchCourse = async (courseId) => {
    try {
      const res = await axios.get(`${apiUrl}/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (res.data.status === 200) {
        setCourse(res.data.course);
        console.log(res.data.course);
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };
  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
    }
  }, [courseId]);

  const [rating, setRating] = useState(4.0);
  return (
    <Layout>
      {freeLesson && (
        <FreePreview
          show={show}
          freeLesson={freeLesson}
          handleClose={handleClose}
        />
      )}
      <div className="container pb-5 pt-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/courses">Courses</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {course.title}
            </li>
          </ol>
        </nav>
        <div className="row my-5">
          <div className="col-lg-8">
            <h2>{course.title}</h2>
            <div className="d-flex">
              <div className="mt-1">
                <span className="badge bg-green">
                  {course?.category?.name || "Uncategorized"}
                </span>
              </div>
              <div className="d-flex ps-3">
                <div className="text pe-2 pt-1">5.0</div>
                <Rating initialValue={rating} size={20} />
              </div>
            </div>
            <div className="row mt-4">
              {/* <div className="col">
                            <span className="text-muted d-block">Last Updates</span>
                            <span className="fw-bold">Aug 2021</span>
                        </div> */}
              <div className="col">
                <span className="text-muted d-block">Level</span>
                <span className="fw-bold">
                  {course?.levels?.name || "No Level Set"}
                </span>
              </div>
              <div className="col">
                <span className="text-muted d-block">Students</span>
                <span className="fw-bold">150,668</span>
              </div>
              <div className="col">
                <span className="text-muted d-block">Language</span>
                <span className="fw-bold">
                  {course?.language?.name || "English"}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mt-4">
                <div className="border bg-white rounded-3 p-4">
                  <h3 className="mb-3  h4">Overview</h3>
                  <p>{course.description}</p>
                </div>
              </div>
              <div className="col-md-12 mt-4">
                <div className="border bg-white rounded-3 p-4">
                  <h3 className="mb-3 h4">What you will learn</h3>
                  <ul className="list-unstyled mt-3">
                    {course.outcomes &&
                      course.outcomes.map((outcome) => {
                        return (
                          <li className="d-flex align-items-center mb-2">
                            <span className="text-success me-2">&#10003;</span>
                            <span>{outcome.text}</span>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>

              <div className="col-md-12 mt-4">
                <div className="border bg-white rounded-3 p-4">
                  <h3 className="mb-3 h4">Requirements</h3>
                  <ul className="list-unstyled mt-3">
                    {course.requirements &&
                      course.requirements.map((req) => {
                        return (
                          <li className="d-flex align-items-center mb-2">
                            <span className="text-success me-2">&#10003;</span>
                            <span>{req.text}</span>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>

              <div className="col-md-12 mt-4">
                <div className="border bg-white rounded-3 p-4">
                  <h3 className="h4 mb-3">Course Structure</h3>
                  <div>
                    {course?.chapters_count !== undefined && (
                      <p>
                        {course.chapters_count} Chapters - {course.totallessons}{" "}
                        Lectures -{" "}
                        {convertMinutesToHours(course.total_duration)}
                      </p>
                    )}
                  </div>
                  <Accordion defaultActiveKey="0" id="courseAccordion">
                    {/* Module 1 */}
                    {course.chapters &&
                      course.chapters.map((chapter, index) => {
                        return (
                            <Accordion.Item eventKey={index.toString()} key={chapter.id}>
                            <Accordion.Header>
                              <div className="d-flex align-items-center w-100">
                                <span className="fw-bold">Module {index + 1}: {chapter.title}</span>
                                <span className="ms-auto text-muted small me-3">
                                  {chapter.lessons_count} lectures • {convertMinutesToHours(chapter.lessons_sum_duration)}
                                </span>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body className="bg-light p-2 mt-4">
                              {chapter.lessons && chapter.lessons.map((lesson) => (
                                /* ✅ THE KEY GOES ON THE OUTERMOST ELEMENT OF THE MAP */
                                <div 
                                  key={lesson.id} 
                                  className="d-flex justify-content-between align-items-center bg-white border rounded-2 p-2 mb-2 shadow-sm border-primary border-top-0 border-bottom-0 border-end-0"
                                  style={{ borderLeftWidth: '4px' }}
                                >
                                  {/* Left: Icon & Title */}
                                  <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
                                    <div className="text-primary ps-1 me-2">
                                      <LuMonitorPlay size={16} />
                                    </div>
                                    <div className="small fw-semibold text-dark text-truncate">
                                      {lesson.title}
                                    </div>
                                  </div>
                          
                                  {/* Right: Preview & Time */}
                                  <div className="d-flex align-items-center flex-shrink-0 ms-2">
                                    {lesson.is_free_preview === "yes" && (
                                      <button
                                        className="btn btn-sm btn-link text-primary fw-bold text-decoration-none p-0 me-3"
                                        style={{ fontSize: '11px' }}
                                        onClick={() => handleShow(lesson)}
                                      >
                                        PREVIEW
                                      </button>
                                    )}
                                    
                                    <span className="text-muted border-start ps-2" style={{ fontSize: '11px', minWidth: '55px' }}>
                                      <i className="bi bi-clock me-1"></i>
                                      {convertMinutesToHours(lesson.duration)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </Accordion.Body>
                          </Accordion.Item>
                        );
                      })}
                  </Accordion>
                </div>
              </div>

              <div className="col-md-12 mt-4">
                <div className="border bg-white rounded-3 p-4">
                  <h3 className="mb-3 h4">Reviews</h3>
                  <p>Our student says about this course</p>

                  <div className="mt-4">
                    <div className="d-flex align-items-start mb-4 border-bottom pb-3">
                      <img
                        src="https://placehold.co/50"
                        alt="User"
                        className="rounded-circle me-3"
                      />
                      <div>
                        <h6 className="mb-0">
                          Mohit Singh{" "}
                          <span className="text-muted fs-6">Jan 2, 2025</span>
                        </h6>
                        <div className="text-warning mb-2">
                          <Rating initialValue={rating} size={20} />
                        </div>
                        <p className="mb-0">
                          Quisque et quam lacus amet. Tincidunt auctor phasellus
                          purus faucibus lectus mattis.
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-4  pb-3">
                      <img
                        src="https://placehold.co/50"
                        alt="User"
                        className="rounded-circle me-3"
                      />
                      <div>
                        <h6 className="mb-0">
                          mark Doe{" "}
                          <span className="text-muted fs-6">Jan 10, 2025</span>
                        </h6>
                        <div className="text-warning mb-2">
                          <Rating initialValue={rating} size={20} />
                        </div>
                        <p className="mb-0">
                          Quisque et quam lacus amet. Tincidunt auctor phasellus
                          purus faucibus lectus mattis.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="border rounded-3 bg-white p-4 shadow-sm">
              <Card.Img
                src={course?.course_small_image || "/placeholder.png"}
              />
              <Card.Body className="mt-3">
                <h3 className="fw-bold">${course.price}</h3>
                <div className="text-muted text-decoration-line-through">
                  ${course.cross_price}
                </div>
                {/* Buttons */}
                <div className="mt-4">
                  <button className="btn btn-primary w-100">
                    <i className="bi bi-ticket"></i> Buy Now
                  </button>
                </div>
              </Card.Body>
              <Card.Footer className="mt-4">
                <h6 className="fw-bold">This course includes</h6>
                <ListGroup variant="flush">
                  <ListGroup.Item className="ps-0">
                    <i className="bi bi-infinity text-primary me-2"></i>
                    Full lifetime access
                  </ListGroup.Item>
                  <ListGroup.Item className="ps-0">
                    <i className="bi bi-tv text-primary me-2"></i>
                    Access on mobile and TV
                  </ListGroup.Item>
                  <ListGroup.Item className="ps-0">
                    <i className="bi bi-award-fill text-primary me-2"></i>
                    Certificate of completion
                  </ListGroup.Item>
                </ListGroup>
              </Card.Footer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Detail;
