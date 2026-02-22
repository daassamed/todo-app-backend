const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import controller functions
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// Protect all routes with authentication
router.route('/')
  .get(protect, getTasks)      // Must be logged in
  .post(protect, createTask);  // Must be logged in

router.route('/:id')
  .get(protect, getTask)       // Must be logged in
  .put(protect, updateTask)    // Must be logged in
  .delete(protect, deleteTask); // Must be logged in

module.exports = router;