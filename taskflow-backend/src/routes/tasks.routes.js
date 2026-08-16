const express = require('express');
const {
  listTasks,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} = require('../controllers/tasks.controller');

const router = express.Router();

router.get('/', listTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/move', moveTask);
router.delete('/:id', deleteTask);

module.exports = router;
