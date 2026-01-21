import React, { useState, useEffect } from "react";
import Layout from "../../../common/Layout";
import { Link, useParams } from "react-router-dom";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import ManageOutcome from "./ManageOutcome";
import ManageRequirement from "./ManageRequirement";
import EditCover from "./EditCover";
import axios from "axios";
import ManageChapter from "./ManageChapter";

const EditCourse = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: async () => {
      try {
        const res = await fetch(`${apiUrl}/courses/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        console.log(result);
        if (result.status === 200) {
          reset({
            title: result.data.title,
            category: result.data.category_id,
            level: result.data.level_id,
            language: result.data.language_id,
            sellPrice: result.data.price,
            description: result.data.description,
            crossPrice: result.data.cross_price,
          });
          setCourse(result.data);
        } else {
          toast.error("Failed to load course metadata");
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching metadata");
      }
    },
  });

  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);

  // Fetch course metadata from API
  const courseMetaData = async () => {
    try {
      const res = await fetch(`${apiUrl}/courses/meta-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.status === 200) {
        console.log(result);
        setCategories(result.categories);
        setLanguages(result.languages);
        setLevels(result.levels);
      } else {
        toast.error("Failed to load course metadata");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching metadata");
    }
  };

  const changeStatus = async (course) => {
    try {
      const status = course.status === 1 ? 0 : 1;
  
      const res = await axios.post(
        `${apiUrl}/change-status/${params.id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
  
      if (res.data.status === 200) {
        toast.success(res.data.message);
  
        setCourse(
         {...course, status:res.data.course.status,}
        );
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  

  useEffect(() => {
    courseMetaData();
  }, []);

  // Submit course form
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/courses/update/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setLoading(false);
      if (res.status == 200) {
        toast.success(result.message);
      } else {
        if (result.errors) {
          Object.keys(result.errors).forEach((field) => {
            setError(field, { message: result.errors[field][0] });
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving course");
    }
  };

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
                Edit Course
              </li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Edit Course</h2>
               <div className="d-flex ">
               {  
                 course.status == 0 &&
                   <Link
                   className="btn btn-light border text-dark"
                   onClick={()=>{changeStatus(course)}}
                 >
                   Publish
                 </Link>
                 }
                   {  
                 course.status == 1 &&
                   <Link
                   className="btn btn-primary"
                   onClick={()=>{changeStatus(course)}}
                 >
                  Unpublish
                 </Link>
                 }
                 <Link
                   className="btn btn-secondary ms-2"
                   to={`/account/my-courses`}
                 >
                  Back
                 </Link>
               </div>
              </div>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <div className="row">
                {/* LEFT SIDE — Course Form */}
                <div className="col-md-7">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card border-0 shadow-lg">
                      <div className="card-body p-4">
                        <h4 className="h5 border-bottom pb-3 mb-3">
                          Course Details
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

                        {/* Category */}
                        <div className="mb-3">
                          <label className="form-label">Category</label>
                          <select
                            {...register("category", {
                              required: "Please select a category",
                            })}
                            className={`form-select form-control ${
                              errors.category ? "is-invalid" : ""
                            }`}
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          {errors.category && (
                            <p className="invalid-feedback">
                              {errors.category.message}
                            </p>
                          )}
                        </div>

                        {/* Level */}
                        <div className="mb-3">
                          <label className="form-label">Level</label>
                          <select
                            {...register("level", {
                              required: "Please select a level",
                            })}
                            className={`form-select form-control ${
                              errors.level ? "is-invalid" : ""
                            }`}
                          >
                            <option value="">Select Level</option>
                            {levels.map((level) => (
                              <option key={level.id} value={level.id}>
                                {level.name}
                              </option>
                            ))}
                          </select>
                          {errors.level && (
                            <p className="invalid-feedback">
                              {errors.level.message}
                            </p>
                          )}
                        </div>

                        {/* Language */}
                        <div className="mb-3">
                          <label className="form-label">Language</label>
                          <select
                            {...register("language", {
                              required: "Please select a language",
                            })}
                            className={`form-select form-control ${
                              errors.language ? "is-invalid" : ""
                            }`}
                          >
                            <option value="">Select Language</option>
                            {languages.map((lang) => (
                              <option key={lang.id} value={lang.id}>
                                {lang.name}
                              </option>
                            ))}
                          </select>
                          {errors.language && (
                            <p className="invalid-feedback">
                              {errors.language.message}
                            </p>
                          )}
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                          <label className="form-label">Description</label>
                          <textarea
                            rows="4"
                            placeholder="Enter course description"
                            {...register("description")}
                            className={`form-control`}
                          ></textarea>
                        </div>

                        {/* Pricing */}
                        <h4 className="h5 border-bottom pb-3 mb-3">Pricing</h4>
                        <div className="mb-3">
                          <label className="form-label">Sell Price ($)</label>
                          <input
                            type="number"
                            placeholder="Enter course price"
                            {...register("sellPrice", {
                              required: "The Sell Price field is required",
                            })}
                            className={`form-control ${
                              errors.sellPrice ? "is-invalid" : ""
                            }`}
                          />
                          {errors.sellPrice && (
                            <p className="invalid-feedback">
                              {errors.sellPrice.message}
                            </p>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Cross Price ($)</label>
                          <input
                            type="number"
                            placeholder="Enter original price (optional)"
                            {...register("crossPrice")}
                            className={`form-control ${
                              errors.crossPrice ? "is-invalid" : ""
                            }`}
                          />
                          {errors.crossPrice && (
                            <p className="invalid-feedback">
                              {errors.crossPrice.message}
                            </p>
                          )}
                        </div>

                        <div className="mb-3">
                          <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                          >
                            {loading == false ? "update" : "Please wait..."}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <ManageChapter course={course} params={params} />
                </div>

                {/* RIGHT SIDE — Outcome Card */}
                <div className="col-md-5">
                  <ManageOutcome />
                  <ManageRequirement />
                  <EditCover course={course} setCourse={setCourse} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditCourse;
