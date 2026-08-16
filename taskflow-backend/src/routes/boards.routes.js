const express = require('express');
const { listBoards, getBoard, getTaskCountsPerColumn } = require('../controllers/boards.controller');

const router = express.Router();

router.get('/', listBoards);
router.get('/:boardId', getBoard);
router.get('/:boardId/stats/tasks-per-column', getTaskCountsPerColumn);


module.exports = router;
