import React from "react";
import Course from "./Course";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl, token } from "./Config";

const FeaturedCourses = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const fetchfeaturedCourses = async () => {
    const res = await axios.get(`${apiUrl}/featured-courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (res.data.status === 200) {
      setFeaturedCourses(res.data.courses);
      console.log(res.data.courses);
    }
  };

  useEffect(() => {
    fetchfeaturedCourses();
  }, []);
  return (
    <section className="section-3 my-5">
      <div className="container">
        <div className="section-title py-3  mt-4">
          <h2 className="h3">Featured Courses</h2>
          <p>
            Discover courses designed to help you excel in your professional and
            personal growth.
          </p>
        </div>
        <div className="row gy-4">
          {featuredCourses.map((course) => {
            return <Course key={course.id} course={course} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
