import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { Link, useParams } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import { Rating } from "react-simple-star-rating";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl, token } from "./Config";
import toast from "react-hot-toast";

const LeaveRating = () => {
  const params = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [course, setCourse] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Catch the rating value
  const handleRating = (rate) => {
    setRating(rate);
  };
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${apiUrl}/save-rating/${params.id}`,
        {
          rating: rating,
          comment: data.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (rating === 0) {
        toast.error("Please select at least one star!");
        return;
      }

      if (res.data.status === 200) {
        toast.success(res.data.message);
        reset({ comment: "" });
        setRating(0);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const fetchCourse = async () => {
    const res = await axios.get(`${apiUrl}/course/${params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (res.data.status == 200) {
      setCourse(res.data.course);
      console.log(res.data.course);
    }
  };

  useEffect(() => {
    fetchCourse();
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
                Leave Rating
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="col-md-12 mt-5 mb-3">
              <h2 className="h4 mb-0">Leave Rating / {course.title}</h2>
            </div>

            <div className="col-lg-3 account-sidebar">
              <UserSidebar />
            </div>

            <div className="col-lg-9">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="card border-0 shadow-sm p-4"
              >
                <div className="mb-3">
                  <label className="form-label fw-bold">Comment</label>
                  <textarea
                    {...register("comment", {
                      required: "comment is required",
                    })}
                    className={`form-control ${errors.comment && "is-invalid"}`}
                    rows="5"
                    placeholder="What is your personal feedback?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  {errors.comment && (
                    <div className="invalid-feedback">
                      {errors.comment.message}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="d-block mb-2 fw-bold">Rating</label>
                  <Rating
                    onClick={handleRating}
                    initialValue={rating}
                    size={35}
                    transition
                    fillColor="#0d9488" // Matching your teal-500 theme
                    emptyColor="#cccccc"
                    SVGclassName="inline-block"
                  />
                </div>

                <div>
                  <button type="submit" className="btn btn-primary px-4">
                    Save Rating
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LeaveRating;
