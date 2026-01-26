import React from "react";

const NotFound = ({ text, clearFilters }) => {
  return (
    <div className="col-12">
      <div className="card shadow-sm border-0 py-5 px-4 text-center bg-white rounded-4">
        <div className="card-body">
          {/* 1. Visual Element */}
          <div className="mb-4">
            <div
              className="bg-light d-inline-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "80px", height: "80px" }}
            >
              <i className="bi bi-search text-muted opacity-50 fs-1"></i>
            </div>
          </div>

          {/* 2. Heading */}
          <h5 className="fw-bold text-dark mb-2">
            {text ? text : "No Records Found"}
          </h5>

          {/* 3. Subtext */}
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: "400px" }}>
            We couldn't find any matching records. Please adjust your search or
            filters and try again to find what you're looking for.
          </p>

          {/* 4. Action Button (The most important part) */}
          <button
            className="btn btn-primary px-4 py-2 rounded-pill shadow-sm fw-bold"
            onClick={clearFilters}
          >
            <i className="bi bi-arrow-counterclockwise me-2"></i>
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
