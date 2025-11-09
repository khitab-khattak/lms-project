import React, { useState, useEffect } from "react";
import Layout from "../../../common/Layout";
import { Link, useNavigate } from "react-router-dom";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";

const EditCourse = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

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
        console.log(result)
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

  useEffect(() => {
    courseMetaData();
  }, []);

  // Submit course form
  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${apiUrl}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
        navigate(`/account/courses/edit/${result.data.id}`);
      } else {
        toast.error(result.message || "Failed to save course");
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
              <li className="breadcrumb-item"><Link to="/account">Account</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Edit Course</li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Edit Course</h2>
                <Link to="/account/my-courses/create" className="btn btn-primary">Back</Link>
              </div>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              <div className="col-md-7">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="card border-0 shadow-lg">
                    <div className="card-body p-4">
                      <h4 className="h5 border-bottom pb-3 mb-3">Course Details</h4>

                      {/* Title */}
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                          {...register("title", { required: "The Title field is required" })}
                          type="text"
                          className={`form-control ${errors.title ? "is-invalid" : ""}`}
                          placeholder="Title"
                        />
                        {errors.title && <p className="invalid-feedback">{errors.title.message}</p>}
                      </div>

                      {/* Category */}
                      <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select
                          {...register("category", { required: "Please select a category" })}
                          className={`form-select form-control ${errors.category ? "is-invalid" : ""}`}
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.id}  value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        {errors.category && <p className="invalid-feedback">{errors.category.message}</p>}
                      </div>

                                            {/* Level */}
                                            <div className="mb-3">
                        <label className="form-label">Level</label>
                        <select
                          {...register("level", { required: "Please select a level" })}
                          className={`form-select form-control ${errors.level ? "is-invalid" : ""}`}
                        >
                          <option value="">Select Level</option>
                          {levels.map((level) => (
                            <option key={level.id} value={level.id}>{level.name}</option>
                          ))}
                        </select>
                        {errors.level && <p className="invalid-feedback">{errors.level.message}</p>}
                      </div>

                      {/* Language */}
                      <div className="mb-3">
                        <label className="form-label">Language</label>
                        <select
                          {...register("language", { required: "Please select a language" })}
                          className={`form-select form-control ${errors.language ? "is-invalid" : ""}`}
                        >
                          <option value="">Select Language</option>
                          {languages.map((lang) => (
                            <option key={lang.id} value={lang.id}>{lang.name}</option>
                          ))}
                        </select>
                        {errors.language && <p className="invalid-feedback">{errors.language.message}</p>}
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          rows="4"
                          placeholder="Enter course description"
                          {...register("description", { required: "The Description field is required" })}
                          className={`form-control ${errors.description ? "is-invalid" : ""}`}
                        ></textarea>
                        {errors.description && <p className="invalid-feedback">{errors.description.message}</p>}
                      </div>

                      {/* Pricing */}
                      <h4 className="h5 border-bottom pb-3 mb-3">Pricing</h4>
                      <div className="mb-3">
                        <label className="form-label">Sell Price ($)</label>
                        <input
                          type="number"
                          placeholder="Enter course price"
                          {...register("sellPrice", { required: "The Sell Price field is required" })}
                          className={`form-control ${errors.sellPrice ? "is-invalid" : ""}`}
                        />
                        {errors.sellPrice && <p className="invalid-feedback">{errors.sellPrice.message}</p>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Cross Price ($)</label>
                        <input
                          type="number"
                          placeholder="Enter original price (optional)"
                          {...register("crossPrice")}
                          className={`form-control ${errors.crossPrice ? "is-invalid" : ""}`}
                        />
                        {errors.crossPrice && <p className="invalid-feedback">{errors.crossPrice.message}</p>}
                      </div>

                      <div className="mb-3">
                        <button type="submit" className="btn btn-primary">Update</button>
                      </div>

                    </div>
                  </div>
                </form>
              </div>
              <div className="col-md-5"></div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EditCourse;
