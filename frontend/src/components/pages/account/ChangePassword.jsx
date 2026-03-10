import Layout from "../../common/Layout";
import UserSidebar from "../../common/UserSidebar";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Loading from "../../common/Loading";
import axios from "axios";
import { apiUrl, token } from "../../common/Config";
import toast from "react-hot-toast";

const ChangePassword = () => {

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    reset,
    watch
  } = useForm();

  const newPassword = watch("new_password");

  const onSubmit = async (data) => {

    try {

      const res = await axios.post(
        `${apiUrl}/update-password`,
        {
          old_password: data.old_password,
          new_password: data.new_password
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
        reset();
      }

    } catch (error) {

      if (error.response?.status === 422) {

        const validationErrors = error.response.data.errors;

        Object.keys(validationErrors).forEach((key) => {
          setError(key, {
            type: "server",
            message: validationErrors[key][0],
          });
        });

      } else {
        toast.error("Something went wrong!");
      }

    } 

  };

  return (
    <Layout>
      <section className="section-4">
        <div className="container pb-5 pt-3">

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/account">Account</Link>
              </li>
              <li className="breadcrumb-item active">
                Change Password
              </li>
            </ol>
          </nav>

          <div className="row">

            <div className="col-md-12 mt-5 mb-3">
              <h2 className="h4">Change Password</h2>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9">

              <div className="card p-3 border-0 shadow-lg">
                <div className="card-body">

                  <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="mb-3">
                      <label className="form-label">Old Password</label>

                      <input
                        {...register("old_password", {
                          required: "Old password is required"
                        })}
                        type="password"
                        className={`form-control ${errors.old_password ? "is-invalid" : ""}`}
                        placeholder="Old Password"
                      />

                      {errors.old_password && (
                        <div className="invalid-feedback">
                          {errors.old_password.message}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">New Password</label>

                      <input
                        {...register("new_password", {
                          required: "New password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                          }
                        })}
                        type="password"
                        className={`form-control ${errors.new_password ? "is-invalid" : ""}`}
                        placeholder="New Password"
                      />

                      {errors.new_password && (
                        <div className="invalid-feedback">
                          {errors.new_password.message}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirm Password</label>

                      <input
                        {...register("confirm_password", {
                          required: "Confirm password is required",
                          validate: value =>
                            value === newPassword || "Passwords do not match"
                        })}
                        type="password"
                        className={`form-control ${errors.confirm_password ? "is-invalid" : ""}`}
                        placeholder="Confirm Password"
                      />

                      {errors.confirm_password && (
                        <div className="invalid-feedback">
                          {errors.confirm_password.message}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                    >
                      Update Password
                    </button>

                  </form>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </Layout>
  );
};

export default ChangePassword;