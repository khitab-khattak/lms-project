import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { apiUrl,token } from "../../../common/Config";
import toast from "react-hot-toast";
import axios from "axios";

const LessonSort = ({
  showLessonSortModal,
  handleCloseLessonSortModal,
  LessonsData,
  setChapters
}) => {
  const [lessons, setLessons] = useState([]);
  
  useEffect(() => {
    // Correctly extracting the array from the object passed in LessonsData
    if (LessonsData && LessonsData.LessonsData) {
      setLessons(LessonsData.LessonsData);
    }
  }, [LessonsData]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(lessons);
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);

    setLessons(items);
    saveOrder(items)
  };
  const saveOrder = async (updateLessons) => {
    try {
      await axios.post(`${apiUrl}/lessons/reorder`, {
        items: updateLessons,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });
  
      setChapters({
        type: "REORDER_LESSONS",
        payload: {
          chapterId: LessonsData.chapterId,
          lessons: updateLessons,
        },
      });
      toast.success("Lessons Order updated");
    } catch (error) {
      toast.error("Failed to save order");
    }
  };

  return (
    <Modal
      show={showLessonSortModal}
      onHide={handleCloseLessonSortModal}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Sort Order</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="lesson-list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {lessons.map((lesson, index) => (
                  <Draggable
                    key={lesson.id.toString()}
                    draggableId={lesson.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border px-3 py-2 bg-white shadow-sm rounded mb-2"
                        style={{
                          ...provided.draggableProps.style,
                          cursor: 'grab'
                        }}
                      >
                        <h4 className="h5">{lesson.title}</h4>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Modal.Body>
    </Modal>
  );
};

export default LessonSort;