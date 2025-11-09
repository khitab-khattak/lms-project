import React from "react";
import Layout from "../../../common/Layout";
import { Link, useNavigate } from "react-router-dom";
import UserSidebar from "../../../common/UserSidebar";
import { useForm } from "react-hook-form";
import { apiUrl,token } from "../../../common/Config";
import toast from "react-hot-toast";
const CreateCourse = () => {
    const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const onSubmit = async(data)=>{
    const res = await fetch(`${apiUrl}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization':`Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });
        const result = await res.json();
        console.log(result)

      if (res.ok) {
        toast.success(result.message)
          navigate(`/account/courses/edit/${result.data.id}`)

      } else {
        toast.error(result.message)
      }
  }
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
                          Create Course
                        </li>
                      </ol>
                    </nav>
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">Create Course</h2>
                <Link
                  to="/account/my-courses/create"
                  className="btn btn-primary"
                >
                  Back
                </Link>
              </div>
            </div>
            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>
            <div className="col-lg-9">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card border-0">
                  <div className="card-body shadow-lg">
                    <div className="row">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Title
                        </label>
                        <input
                          {...register("title", {
                            required: "The Title field is required",
                          })}
                          type="text"
                          className={`form-control ${
                            errors.title ? "is-invalid" : ""
                          } `}
                          placeholder="Title"
                        />

                        {errors.title && (
                          <p className="invalid-feedback">
                            {errors.title.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <button type="submit" className="btn btn-primary">Continue</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CreateCourse;
