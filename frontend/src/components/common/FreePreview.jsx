import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { apiUrl } from './Config';
import ReactPlayer from 'react-player'

const FreePreview = ({show,handleClose,freeLesson}) => {
  return (
    <Modal size='lg' show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{freeLesson.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body> <video
                src={`${apiUrl.replace("/api", "")}/uploads/lesson/videos/${freeLesson.video}`}
                controls
                controlsList='nodownload'
                onContextMenu={(e) => e.preventDefault()}
                className="w-100 mt-3 rounded"
              /></Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default FreePreview