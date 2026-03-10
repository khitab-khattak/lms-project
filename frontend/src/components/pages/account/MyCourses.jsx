import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import { Link } from "react-router-dom";
import UserSidebar from "../../common/UserSidebar";
import { apiUrl, token } from "../../common/Config";
import toast from "react-hot-toast";
import axios from "axios";
import CourseEdit from "../../common/CourseEdit";
import Loading from "../../common/Loading";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Course?"))
      return;

    try {
      const res = await axios.delete(`${apiUrl}/course/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.data.status === 200) {
        toast.success(res.data.message);
        fetchCourses();
      } else {
        toast.error(res.data.message || "Failed to delete course");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const fetchCourses = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${apiUrl}/my-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.data.status === 200) {
        setCourses(res.data.courses);
      }
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><Link to="/account">Account</Link></li>
                      <li className="breadcrumb-item active" aria-current="page">My Courses</li>
                    </ol>
                  </nav>
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">My Courses</h2>
                <Link to="/account/courses/create" className="btn btn-primary">
                  Create
                </Link>
              </div>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              <div className="row gy-4">

                {loading ? (
                 <Loading/>
                ) : courses?.length > 0 ? (
                  courses.map((course) => (
                    <CourseEdit
                      key={course.id}
                      course={course}
                      handleDelete={handleDelete}
                    />
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <p>No courses registered</p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MyCourses;