// TaskModal.js
import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

// Set root element for accessibility (required by react-modal)
Modal.setAppElement("#root");
axios.defaults.withCredentials = true;

const TaskModal = ({
  isOpen,
  closeModal,
  refreshTasks,
  task = null,
  viewDetails,
}) => {
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(task ? task.description : "");
  const [status, setStatus] = useState(task ? task.status : "todo"); // Default to "todo"
  // const [createdAt, setCreatedAt] = useState(task ? {new Date(task.createdAt).toLocaleString()} : ""); // Default to "todo"
  const [error, setError] = useState(null);

  // Handle adding or updating a task
  const handleSubmit = async () => {
    if (!title || !description) {
      setError("Title and description are required");
      return;
    }

    const taskData = { title, description, status };

    try {
      if (task) {
        // Update task
        await axios.put(
          `https://task-manger-app-1.onrender.com/api/taskroute/tasks/${task._id}`,
          taskData
        );
      } else {
        // Create new task
        await axios.post("https://task-manger-app-1.onrender.com/api/taskroute/tasks", taskData);
      }
      refreshTasks(); // Refresh tasks after adding/editing
      closeModal(); // Close the modal after success
    } catch (err) {
      setError("Failed to submit task");
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel={task ? "Edit Task" : "Add Task"}
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50"
    >
      {viewDetails ? (
        <div>
          <h2 className="text-xl mb-4 font-bold text-2xl">Task Details</h2>
          <div>
            <text className="font-bold">Title:</text>
            {title}
            </div>
          <div>
          <text className="font-bold">Description:</text>
            {description}
            </div>
          <div>Created at: {new Date(task.createdAt).toLocaleString()}</div>
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl mb-4">{task ? "Edit Task" : "Add Task"}</h2>
          {error && <p className="text-red-500">{error}</p>}
          <text className="text-gray-800 font-semibold">Title</text>
          <input
            type="text"
            placeholder="Task Title"
            className="border p-2 w-full mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <text className="text-gray-800 font-semibold">Description</text>
          <textarea
            placeholder="Task Description"
            className="border p-2 w-full mb-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <text className="text-gray-800 font-semibold">Status</text>
          <select
            className="border p-2 w-full mb-4"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white p-2 rounded mr-2"
            >
              {task ? "Save Changes" : "Add Task"}
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TaskModal;
