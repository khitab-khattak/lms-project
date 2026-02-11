import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import CourseEnrolled from "../../common/CourseEnrolled";
import UserSidebar from "../../common/UserSidebar";
import axios from "axios";
import { apiUrl, token } from "../../common/Config";
import toast from "react-hot-toast";

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const MyEnroll = async () => {
    const res = await axios.get(`${apiUrl}/my-enroll`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });

    if (res.data.status === 200) {
      setEnrollments(res.data.enroll);
      console.log(res.data.enroll);
    } else {
      console.log("something went wrong");
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
            <div className="d-flex justify-content-between  mt-5 mb-3">
              <h2 className="h4 mb-0 pb-0">My Learning</h2>
              {/* <a href="#" className='btn btn-primary'>Create</a> */}
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row gy-4">
                {enrollments.map((enrollment) => {
                  return <CourseEnrolled enrollment={enrollment}  key={enrollment.id} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MyLearning;
