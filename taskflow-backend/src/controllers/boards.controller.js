const { pool } = require('../db/pool');




async function listBoards(req, res, next) {
  try {
    const [boards] = await pool.query(
      'SELECT id, name, created_at FROM boards ORDER BY id'
    );
    res.json(boards);
  } catch (err) {
    next(err);
  }
}

async function getBoard(req, res, next) {
  try {
    const { boardId } = req.params;
    const { priority } = req.query;

    const [boardRows] = await pool.query(
      'SELECT id, name, created_at FROM boards WHERE id = ?',
      [boardId]
    );
    if (boardRows.length === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const [columnRows] = await pool.query(
      'SELECT id, board_id, name, position FROM columns_ WHERE board_id = ? ORDER BY position, id',
      [boardId]
    );

    let taskSql =
      'SELECT id, column_id, title, description, priority, created_at ' +
      'FROM tasks WHERE column_id IN (SELECT id FROM columns_ WHERE board_id = ?)';
    const taskParams = [boardId];

    if (priority) {
      const validPriorities = ['Low', 'Medium', 'High'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          error: `Invalid priority filter. Must be one of: ${validPriorities.join(', ')}`,
        });
      }
      taskSql += ' AND priority = ?';
      taskParams.push(priority);
    }
    taskSql += ' ORDER BY created_at DESC, id DESC';

    const [taskRows] = await pool.query(taskSql, taskParams);

    const columns = columnRows.map((col) => ({
      ...col,
      tasks: taskRows.filter((t) => t.column_id === col.id),
    }));

    res.json({ ...boardRows[0], columns });
  } catch (err) {
    next(err);
  }
}

async function getTaskCountsPerColumn(req, res, next) {
  try {
    const { boardId } = req.params;

    const [boardRows] = await pool.query('SELECT id FROM boards WHERE id = ?', [boardId]);
    if (boardRows.length === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const sql = `
      SELECT c.id AS column_id, c.name AS column_name, COUNT(t.id) AS task_count
      FROM columns_ c
      LEFT JOIN tasks t ON t.column_id = c.id
      WHERE c.board_id = ?
      GROUP BY c.id, c.name
      ORDER BY c.position, c.id
    `;
    const [rows] = await pool.query(sql, [boardId]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { listBoards, getBoard, getTaskCountsPerColumn  };
