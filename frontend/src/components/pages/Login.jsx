import React from "react";
import Layout from "../common/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiUrl } from "../common/Config";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = (data) => {
    fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json()) // ✅ correctly parse JSON
      .then((result) => {
        console.log(result); // for debugging

        if (result.status === 200) {
          // ✅ successful login
          const userInfo = {
            name: result.name,
            id: result.id,
            token: result.token,
          };
          localStorage.setItem("userInfolms", JSON.stringify(userInfo));

          toast.success("Login successful!");
          setTimeout(() => navigate("/"), 1500);
        } 
        else {
          // ❌ wrong email/password
          toast.error(result.message);
        } 
      })
  };;
  return (
    <Layout>
      <div className="container py-5 mt-5">
        <div className="d-flex align-items-center justify-content-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card border-0 shadow login">
              <div className="card-body p-4">
                <h3 className="border-bottom pb-3 mb-3">Login</h3>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Email"
                    {...register("email", {
                      required: "Email field is required",
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                  { 
                    ...register("password",{
                      required:"password is required",
                      minLength: {
                        value:5,
                        message:"password must be 5 digits"
                      }
                    })
                  }
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ''}`}
                    placeholder="Password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <button type="submit" className="btn btn-primary">Login</button>
                  <Link to={`/account/register`} className="text-secondary">
                    Register Here
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
