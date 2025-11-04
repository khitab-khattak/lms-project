
import Layout from "../common/Layout";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiUrl } from "../common/Config";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      const result = await res.json();
      console.log(result);
  
      if (res.ok) {
        toast.success('User Registered Successfully');
        reset();
       
          navigate('/account/login')
     
      } else {
        // handle validation errors from backend
        if (result.errors) {
          Object.keys(result.errors).forEach((field) => {
            setError(field, { message: result.errors[field][0] });
          });
        }
      }
    } catch (err) {
      console.error('Something went wrong', err);
    }
  };
  
  return (
    <Layout>
      <div className="container py-5 mt-5">
        <div className="d-flex align-items-center justify-content-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card border-0 shadow register">
              <div className="card-body p-4">
                <h3 className="border-bottom pb-3 mb-3">Register</h3>


                <div className="mb-3">
                  <label className="form-label" htmlFor="name">
                    Name
                  </label>
                  <input
                    {...register("name", {
                      required: "The name field is required",
                    })}
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    } `}
                    placeholder="Name"
                  />
                  {errors.name && (
                    <p className="invalid-feedback">{errors.name.message}</p>
                  )}
                </div>

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

                <div>
                  <button type="submit" className="btn btn-primary w-100">Register</button>
                </div>

                <div className="d-flex justify-content-center py-3">
                  Already have account? &nbsp;
                  <Link className="text-secondary" to={`/account/login`}>
                    {" "}
                    Login
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

export default Register;