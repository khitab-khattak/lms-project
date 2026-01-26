import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loading = ({text}) => {
  return (
    <div className="col-12 d-flex justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
    <div className="text-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fw-semibold animate__animated animate__pulse animate__infinite">
            {text}
        </p>
    </div>
</div>
  )
}

export default Loading