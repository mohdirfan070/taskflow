const { pool } = require('../db/pool');

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

function validateTaskInput({ title, priority }, { partial = false } = {}) {
  const errors = [];

  if (!partial || title !== undefined) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('title is required and cannot be empty');
    }
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }

  return errors;
}

async function listTasks(req, res, next) {
  try {
    const { priority, boardId } = req.query;

    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        error: `Invalid priority filter. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
      });
    }

    let sql = `
      SELECT t.id, t.column_id, t.title, t.description, t.priority, t.created_at
      FROM tasks t
      JOIN columns_ c ON c.id = t.column_id
      WHERE 1 = 1
    `;
    const params = [];

    if (boardId) {
      sql += ' AND c.board_id = ?';
      params.push(boardId);
    }
    if (priority) {
      sql += ' AND t.priority = ?';
      params.push(priority);
    }
    sql += ' ORDER BY t.created_at DESC, t.id DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const { column_id, title, description, priority } = req.body || {};

    const errors = validateTaskInput({ title, priority });
    if (!column_id) errors.push('column_id is required');
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    // Check column exists and get its board_id
    const [columnRows] = await pool.query('SELECT id, board_id FROM columns_ WHERE id = ?', [column_id]);
    if (columnRows.length === 0) {
      return res.status(400).json({ error: `column_id ${column_id} does not exist` });
    }
    const { board_id } = columnRows[0];

    // Insert task with both board_id and column_id
    const [result] = await pool.query(
      'INSERT INTO tasks (board_id, column_id, title, description, priority) VALUES (?, ?, ?, ?, ?)',
      [board_id, column_id, title.trim(), description || null, priority || 'Medium']
    );

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, priority } = req.body || {};

    const errors = validateTaskInput({ title, priority }, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    const [existingRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const existing = existingRows[0];

    const nextTitle = title !== undefined ? title.trim() : existing.title;
    const nextDescription = description !== undefined ? description : existing.description;
    const nextPriority = priority !== undefined ? priority : existing.priority;

    await pool.query(
      'UPDATE tasks SET title = ?, description = ?, priority = ? WHERE id = ?',
      [nextTitle, nextDescription, nextPriority, id]
    );

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function moveTask(req, res, next) {
  try {
    const { id } = req.params;
    const { column_id } = req.body || {};

    if (!column_id) {
      return res.status(400).json({ error: 'column_id is required' });
    }

    const [existingRows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const [columnRows] = await pool.query('SELECT id FROM columns_ WHERE id = ?', [column_id]);
    if (columnRows.length === 0) {
      return res.status(400).json({ error: `column_id ${column_id} does not exist` });
    }

    await pool.query('UPDATE tasks SET column_id = ? WHERE id = ?', [column_id, id]);

    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listTasks, createTask, updateTask, moveTask, deleteTask, validateTaskInput };
