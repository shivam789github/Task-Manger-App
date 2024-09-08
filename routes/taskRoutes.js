// routes/taskRoutes.js
const express = require('express');
const Task = require('../Models/Task');
const authenticateToken=require("./../MiddleWare/authenticateToken");
const { useImperativeHandle } = require('react');

const router = express.Router();
router.use(authenticateToken);

// Create a task
router.post('/tasks', async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  try {
    const newTask = new Task({ title, description, status, dueDate,  user: req.user.id, });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({user:userId});
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single task by ID
router.get('/tasks/:id', async (req, res) => {
  try {
    // const userId = req.user.id;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
  const { title, description, status, dueDate, assignedUser } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, dueDate, assignedUser },
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/tasksearch', async (req, res) => {
  try {
    const { search, sortBy } = req.query;
    const userId = req.user.id;
    // console.log(req.query)
    // console.log('body',req.body)
    // console.log('params',req.params)
    // console.log('query',req.query)

    // Search query: match tasks by title (case-insensitive)
    let query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
      // 'i' for case-insensitive search
    }
    query.user=userId
// console.log('query',query)
    // Sorting logic
    let sortOption = {};
    if (sortBy === 'recent') {
      sortOption = { createdAt: -1 }; // Sort by most recent tasks (newest first)
    } else if (sortBy === 'title') {
      sortOption = { title: 1 }; // Sort alphabetically by title (A-Z)
    } else if (sortBy === 'status') {
      sortOption = { status: 1 }; // Sort by status (ascending)
    }

    // Fetch tasks based on search and sort
    const tasks = await Task.find(query).sort(sortOption);

    // Return the tasks to the frontend
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }});

module.exports = router;
