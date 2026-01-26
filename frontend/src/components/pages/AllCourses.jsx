import React, { useEffect, useState } from "react";
import Layout from "../common/Layout";
import Course from "../common/Course";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { apiUrl, token } from "../common/Config";
import { Link } from "react-router-dom";
import Loading from "../common/Loading";
import NotFound from "../common/NotFound";

const AllCourses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sort, setSort] = useState("desc");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryChecked, setCategoryChecked] = useState(() => {
    const category = searchParams.get("category");
    return category ? category.split(",") : [];
  });

  const [levelChecked, setLevelChecked] = useState(() => {
    const level = searchParams.get("level");
    return level ? level.split(",") : [];
  });

  const [languageChecked, setLanguageChecked] = useState(() => {
    const language = searchParams.get("language");
    return language ? language.split(",") : [];
  });

  const handleCategory = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCategoryChecked((prev) => [...prev, value]);
    } else {
      setCategoryChecked((prev) => prev.filter((id) => id != value));
    }
  };

  const handleLevel = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setLevelChecked((prev) => [...prev, value]);
    } else {
      setLevelChecked((prev) => prev.filter((id) => id != value));
    }
  };

  const handleLanguage = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setLanguageChecked((prev) => [...prev, value]);
    } else {
      setLanguageChecked((prev) => prev.filter((id) => id != value));
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    let search = [];
    let params = "";
    if (categoryChecked.length > 0) {
      search.push(["category", categoryChecked.join(",")]);
    }
    if (search.length > 0) {
      params = new URLSearchParams(search);
      setSearchParams(params);
    }
    //level
    if (levelChecked.length > 0) {
      search.push(["level", levelChecked.join(",")]);
    }
    if (search.length > 0) {
      params = new URLSearchParams(search);
      setSearchParams(params);
    }
    //language
    if (languageChecked.length > 0) {
      search.push(["language", languageChecked.join(",")]);
    }
    if (search.length > 0) {
      params = new URLSearchParams(search);
      setSearchParams(params);
    }
    if (keyword.length > 0) {
      search.push(["keyword", keyword]);
    }

    search.push(["sort", sort]);
    if (search.length > 0) {
      params = new URLSearchParams(search);
      setSearchParams(params);
    } else {
      setSearchParams([]);
    }
    const res = await axios.get(`${apiUrl}/all-courses?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "content-type": "application/json",
      },
    });
    if (res.data.status == 200) {
      setCourses(res.data.courses);
      setLoading(false);
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

  const clearFilters = () => {
    setCategoryChecked([]);
    setLevelChecked([]);
    setLanguageChecked([]);
    setKeyword("");

    document
      .querySelectorAll(".form-check-input")
      .forEach((element) => (element.checked = false));
  };
  useEffect(() => {
    fetchlanguages();
    fetchCategories();
    fetchLevels();
  }, []);
  useEffect(() => {
    fetchCourses();
    console.log(categoryChecked);
  }, [categoryChecked, levelChecked, languageChecked, sort]);

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
                <div className="mb-3 input-group ">
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    // TRIGGER 1: Press Enter Key
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        fetchCourses();
                      }
                    }}
                    type="text"
                    className="form-control"
                    placeholder="Search by keyword"
                  />
                  <button
                    onClick={fetchCourses}
                    className="btn btn-primary btn-sm"
                  >
                    Search
                  </button>
                </div>

                <div className="pt-3">
                  <h3 className="h5 mb-2">Category</h3>
                  <ul>
                    {categories.map((category) => {
                      return (
                        <li key={category.id}>
                          <div className="form-check">
                            <input
                              onClick={(e) => {
                                handleCategory(e);
                              }}
                              defaultChecked={
                                searchParams.get("category")
                                  ? searchParams
                                      .get("category")
                                      .includes(category.id)
                                  : false
                              }
                              className="form-check-input"
                              type="checkbox"
                              value={category.id}
                              id={`category-${category.id}`}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`category-${category.id}`}
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
                        <li key={level.id}>
                          <div className="form-check">
                            <input
                              onClick={(e) => {
                                handleLevel(e);
                              }}
                              defaultChecked={
                                searchParams.get("level")
                                  ? searchParams.get("level").includes(level.id)
                                  : false
                              }
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
                        <li key={language.id}>
                          <div className="form-check">
                            <input
                              onClick={(e) => {
                                handleLanguage(e);
                              }}
                              defaultChecked={
                                searchParams.get("language")
                                  ? searchParams
                                      .get("language")
                                      .includes(language.id)
                                  : false
                              }
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
                <Link onClick={clearFilters} href="" className="clear-filter">
                  Clear All Filters
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            <section className="section-3">
              <div className="d-flex justify-content-between mb-3 align-items-center">
                <div className="h5 mb-0">{/* 10 courses found */}</div>
                <div>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                    }}
                    className="form-select"
                  >
                    <option value="desc">Newset First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
              <div className="row gy-4 min-vh-50">
                {loading ? (
                  /* 1. Loading State */
                  <div className="col-12 py-5 d-flex justify-content-center">
                    <Loading text="Fetching courses..." />
                  </div>
                ) : courses.length === 0 ? (
                  /* 2. Empty/Not Found State */
                  <NotFound text="No Courses Found" clearFilters = {clearFilters} />
                ) : (
                  /* 3. Results State */
                  courses.map((course) => (
                    <Course
                      course={course}
                      key={course.id}
                      enrolled="10"
                      customClasses="col-lg-4 col-md-6 animate__animated animate__fadeIn"
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllCourses;
