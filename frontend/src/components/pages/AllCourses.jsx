import React, { useEffect, useState } from "react";
import Layout from "../common/Layout";
import Course from "../common/Course";
import axios from "axios";
import { apiUrl, token } from "../common/Config";

const AllCourses = () => {
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const fetchCourses = async () => {
    const res = await axios.get(`${apiUrl}/featured-courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "content-type": "application/json",
      },
    });
    if (res.data.status == 200) {
      setCourses(res.data.courses);
      console.log(res.data.courses);
    } else {
      console.log("something went wrong");
    }
  };
  const fetchCategories = async () => {
    const res = await axios.get(`${apiUrl}/fetch-categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "content-type": "application/json",
      },
    });
    if (res.data.status == 200) {
      setCategories(res.data.categories);
    } else {
      console.log("something went wrong");
    }
  };

  const fetchLevels = async () => {
    const res = await axios.get(`${apiUrl}/levels`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "content-type": "application/json",
      },
    });
    if (res.data.status == 200) {
      setLevels(res.data.levels);
    } else {
      console.log("something went wrong");
    }
  };

  const fetchlanguages = async () => {
    const res = await axios.get(`${apiUrl}/languages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "content-type": "application/json",
      },
    });
    if (res.data.status == 200) {
      setLanguages(res.data.languages);
    } else {
      console.log("something went wrong");
    }
  };
 
  useEffect(() => {
    fetchCourses();
    fetchlanguages();
    fetchCategories();
    fetchLevels();
  },[]);
  return (
    <Layout>
      <div className="container pb-5 pt-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Courses
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-lg-3">
            <div className="sidebar mb-5 card border-0">
              <div className="card-body shadow">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by keyword"
                />

                <div className="pt-3">
                  <h3 className="h5 mb-2">Category</h3>
                  <ul>
                    {categories.map((category) => {
                      return (
                        <li key={category.id}>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value=""
                              id="flexCheckDefault"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="flexCheckDefault"
                            >
                              {category.name}
                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="mb-3">
                  <h3 className="h5 mb-2">Level</h3>
                  <ul>
                    {levels.map((level) => {
                      return (
                        <li>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={level.id}
                              id={`level-${level.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`level-${level.id}`}
                            >
                              {level.name}
                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="mb-3">
                  <h3 className="h5 mb-2">Language</h3>
                  <ul>
                    {languages.map((language) => {
                      return (
                        <li>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={language.id}
                              id={`language-${language.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`language-${language.id}`}
                            >
                              {language.name}
                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <a href="" className="clear-filter">
                  Clear All Filters
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <section className="section-3">
              <div className="d-flex justify-content-between mb-3 align-items-center">
                <div className="h5 mb-0">{/* 10 courses found */}</div>
                <div>
                  <select name="" id="" className="form-select">
                    <option value="0">Newset First</option>
                    <option value="1">Oldest First</option>
                  </select>
                </div>
              </div>
              <div className="row gy-4">
                {courses.map((course) => {
                  return (
                    <Course
                      course={course}
                      key={course.id}
                      enrolled="10"
                      customClasses="col-lg-4 col-md-6"
                    />
                  );
                })}
               
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllCourses;
