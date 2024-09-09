// TaskCard.js
import React, { useState } from "react";
import { useDrag } from "react-dnd";
import axios from "axios";

const TaskCard = ({ task, columnId, moveTask, refreshTasks, onEdit,onView }) => {
  // Make task draggable
  const [{ isDragging }, dragRef] = useDrag({
    type: "TASK", // The type of draggable item
    item: { id: task._id, columnId }, // This data is passed when the task is dragged
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://task-manger-app-1.onrender.com/api/taskroute/tasks/${task._id}`
      );
      refreshTasks(); // Fetch tasks after deletion
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <div
      ref={dragRef}
      style={{ opacity: isDragging ? 0.75 : 1 }} // Apply uniform opacity during drag
      className={`p-4 bg-white  h-1/5 rounded-lg bg-blue-200 m-2 cursor-move`}
    >
      {
        <div>
          <h3 className="text-lg font-bold  rounded-md">{task.title}</h3>
          <p className="text-gray-800">{task.description}</p>
          <p className="text-gray-800">
            Created at: {new Date(task.createdAt).toLocaleString()}
          </p>
          <div className="flex justify-end mt-8 space-x-2 mt-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white p-2 mr-2 rounded "
            >
              Delete
            </button>
            <button
              onClick={() => onEdit(task)}
              className="bg-blue-400 text-white mr-2 p-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onView(task)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              View Details
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default TaskCard;
