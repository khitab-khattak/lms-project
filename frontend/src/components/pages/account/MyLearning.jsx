import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import CourseEnrolled from "../../common/CourseEnrolled";
import UserSidebar from "../../common/UserSidebar";
import axios from "axios";
import { apiUrl, token } from "../../common/Config";
import toast from "react-hot-toast";

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const MyEnroll = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${apiUrl}/my-enroll`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.data.status === 200) {
        setEnrollments(res.data.enroll);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    MyEnroll();
  }, []);

  return (
    <Layout>
      <section className="section-4">
        <div className="container">
          <div className="row">
            <div className="d-flex justify-content-between mt-5 mb-3">
              <h2 className="h4 mb-0 pb-0">My Learning</h2>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              <div className="row gy-4">
                
                {loading ? (
                  <div className="col-12 text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : enrollments.length > 0 ? (
                  enrollments.map((enrollment) => (
                    <CourseEnrolled
                      enrollment={enrollment}
                      key={enrollment.id}
                    />
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <p className="text-muted">
                      You have not enrolled in any courses yet.
                    </p>
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

export default MyLearning;