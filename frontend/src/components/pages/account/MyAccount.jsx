import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import UserSidebar from "../../common/UserSidebar";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loading from "../../common/Loading";
import axios from "axios";
import { apiUrl, token } from "../../common/Config";
import toast from "react-hot-toast";

const MyAccount = () => {
  const [User, setUser] = useState({});
  const [loading, setloading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  // Fetch user data
  const fetchUser = async () => {
    setloading(true);
    try {
      const res = await axios.get(`${apiUrl}/fetch-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.data.status === 200) {
        setUser(res.data.user);
        // Pre-fill form with user data
        reset({
          name: res.data.user.name,
          email: res.data.user.email,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user data");
    } finally {
      setloading(false);
    }
  };

  // Update user profile
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${apiUrl}/update-user`,
        {
          name: data.name,
          email: data.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (res.data.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        // Set React Hook Form errors
        Object.keys(validationErrors).forEach((key) => {
          setError(key, { type: "server", message: validationErrors[key][0] });
        });
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/account">Account</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                My Profile
              </li>
            </ol>
          </nav>

          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <div className="d-flex justify-content-between">
                <h2 className="h4 mb-0 pb-0">My Profile</h2>
              </div>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              {loading && <Loading />}
              {!loading && (
                <div className="card p-3 border-0 shadow-lg">
                  <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          {...register("name", {
                            required: "The name field is required",
                          })}
                          type="text"
                          className={`form-control ${
                            errors.name ? "is-invalid" : ""
                          }`}
                          placeholder="Name"
                        />
                        {errors.name && (
                          <div className="invalid-feedback">
                            {errors.name.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          {...register("email", {
                            required: "The email field is required",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Invalid email address",
                            },
                          })}
                          type="email"
                          className={`form-control ${
                            errors.email ? "is-invalid" : ""
                          }`}
                          placeholder="Email"
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                            {errors.email.message}
                          </div>
                        )}
                      </div>

                      <button type="submit" className="btn btn-primary px-4">
                        Update
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MyAccount;
