// TaskBoard.js
import React, { useState, useEffect } from "react";
import Column from "./Column"; // Columns for tasks
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import TaskModal from "./TaskModal";
import TaskCard from "./TaskCard";

const TaskBoard = () => {
  // Sample tasks (In a real app, fetch from API)
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // For task creation modal
  const [editingTask, setEditingTask] = useState(null); // For task editing
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [viewDetails,setViewDetails]=useState(false)
  // Fetch tasks from backend
  const fetchTasks = async () => {
    const { data } = await axios.get(
      "https://task-manger-app-1.onrender.com/api/taskroute/tasks"
    );
    const categorizedTasks = {
      todo: data.filter((task) => task.status === "todo"),
      inProgress: data.filter((task) => task.status === "inProgress"),
      done: data.filter((task) => task.status === "done"),
    };
    setTasks(categorizedTasks);
    // console.log('categorizedTasks',tasks)
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle moving tasks between columns
  const moveTask = async (taskId, fromColumn, toColumn) => {
    const taskToMove = tasks[fromColumn].find((task) => task._id === taskId);
    // console.log("taskToMove", taskToMove);
    // console.log("fromColumn", fromColumn);
    // console.log("toColumn", toColumn);
    // console.log("tasks", tasks);
    // console.log("taskId", taskId);
    if (taskToMove) {
      await axios.put(`https://task-manger-app-1.onrender.com/api/taskroute/tasks/${taskId}`, {
        ...taskToMove,
        status: toColumn,
      });
      setTasks((prevTasks) => ({
        ...prevTasks,
        [fromColumn]: prevTasks[fromColumn].filter(
          (task) => task._id !== taskId
        ),
        [toColumn]: [
          ...prevTasks[toColumn],
          { ...taskToMove, status: toColumn },
        ],
      }));
    }
  };
  const handleEditTask = (task) => {
    setEditingTask(task);
    setViewDetails(false)
    setIsModalOpen(true); // Open modal for editing task
  };
  const handleViewTask = (task) => {
    setEditingTask(task);
    setViewDetails(true)
    setIsModalOpen(true); // Open modal for editing task
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null); // Reset editing task state
  };
  // console.log("categorizedTasks2", tasks);

  const fetchTasks2 = async () => {
    // console.log("searchTerm", searchTerm);
    // console.log("sortOption", sortOption);
    const { data } = await axios.get(
      `https://task-manger-app-1.onrender.com/api/taskroute/tasksearch?search=${searchTerm}&sortBy=${sortOption}`,
      { search: searchTerm, sortBy: sortOption }
    );
    const categorizedTasks = {
      todo: data.filter((task) => task.status === "todo"),
      inProgress: data.filter((task) => task.status === "inProgress"),
      done: data.filter((task) => task.status === "done"),
    };
    setTasks(categorizedTasks);
    // console.log('res',res)
    console.log("tasks2", tasks);
  };

  useEffect(() => {
    fetchTasks2();
  }, [searchTerm, sortOption]);
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    // Redirect to login page (you can use react-router)
    window.location.href = '/';
  };

  return (
    <div className="bg-gray-100 h-full">
      <div className="bg-blue-500 ml-2 mr-2 mb-4 mt-3 flex justify-end h-10">
        <button className="bg-red-500 text-white text-center text-semibold p-2 mb-1 mt-1 mr-64 rounded-md" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white p-1 rounded w-1/6 hover:bg-blue-600 ml-2 mt-4 h-8"
      >
        Add Task
      </button>
      <div className="flex justify-between bg-white text-center shadow mt-2 rounded-md h-12 m-2 mt-3">
        <div className="ml-6 mt-3">
          <text className="text-gray-800 font-bold">Search:</text>
          <input
            type="text"
            placeholder="Search by task title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar rounded border-2 border-gray-400 ml-4 "
          />
        </div>
        <div className="mt-3">
          <text className="text-gray-800 font-bold">Sort By:</text>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="rounded border-2 border-gray-400 ml-4 mr-2"
          >
            <option value="recent">Recent</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      {/* Reusable Task Modal for both adding and editing */}
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          closeModal={handleCloseModal}
          refreshTasks={fetchTasks}
          task={editingTask} 
          viewDetails={viewDetails}// If editingTask is null, it will act as "Add Task"
        />
      )}

      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-row justify-around space-x-4">
          <Column
            title="TODO"
            tasks={tasks.todo}
            columnId="todo"
            moveTask={moveTask}
            refreshTasks={fetchTasks}
            handleEditTask={handleEditTask}
            handleViewTask={handleViewTask} // Pass edit handler to column
          />
          <Column
            title="IN PROGRESS"
            tasks={tasks.inProgress}
            columnId="inProgress"
            moveTask={moveTask}
            refreshTasks={fetchTasks}
            handleEditTask={handleEditTask}
            handleViewTask={handleViewTask} // Pass edit handler to column
          />
          <Column
            title="DONE"
            tasks={tasks.done}
            columnId="done"
            moveTask={moveTask}
            refreshTasks={fetchTasks}
            handleEditTask={handleEditTask}
            handleViewTask={handleViewTask} // Pass edit handler to column
          />
        </div>
      </DndProvider>
    </div>
  );
};

export default TaskBoard;
