const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// Define routes
router.route('/')
  .get(getTasks)      // GET /api/tasks
  .post(createTask);  // POST /api/tasks

router.route('/:id')
  .get(getTask)       // GET /api/tasks/:id
  .put(updateTask)    // PUT /api/tasks/:id
  .delete(deleteTask); // DELETE /api/tasks/:id

module.exports = router;