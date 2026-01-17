import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { apiUrl, token } from "../../../common/Config";
import toast from "react-hot-toast";
import axios from "axios";

const ChapterSort = ({
  showChapterSortModal,
  handleCloseChapterSortModal,
  chapters,
  setChapters // This is the dispatch from useReducer
}) => {
  const [chaptersData, setChaptersData] = useState([]);

  // Sync internal state when the modal opens or the course data updates
  useEffect(() => {
    if (chapters) {
      setChaptersData(chapters);
    }
  }, [chapters, showChapterSortModal]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(chaptersData);
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);

    // 1. Update local state immediately so the UI reflects the movement
    setChaptersData(items);
    
    // 2. Persist to DB
    saveOrder(items);
  };

  const saveOrder = async (updatedChapters) => {
    try {
      const res = await axios.post(
        `${apiUrl}/chapter/reorder`,
        {
          items: updatedChapters, // 👈 must match backend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
  
      // axios automatically throws on non-2xx responses
      setChapters({
        type: "REORDER_CHAPTERS",
        payload: updatedChapters,
      });
  
      toast.success(res.data.message || "Chapters order updated");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to save order"
      );
      setChaptersData(course.chapters);
    }
  };
  

  return (
    <Modal show={showChapterSortModal} onHide={handleCloseChapterSortModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Sort Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="chapter-list">
            {(provided) => (
              /* Use chaptersData here, NOT course.chapters */
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {chaptersData.map((chapter, index) => (
                  <Draggable key={chapter.id.toString()} draggableId={chapter.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="border px-3 py-2 bg-white shadow-sm rounded mb-2"
                        style={{ ...provided.draggableProps.style, cursor: 'grab' }}
                      >
                        <h4 className="h5 mb-0">{chapter.chapter || chapter.title}</h4>
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

export default ChapterSort;