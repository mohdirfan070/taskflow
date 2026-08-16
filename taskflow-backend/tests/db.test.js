const { ensureTestDatabase } = require('./testDb');

let pool;
let boardId;
let columnA;
let columnB;

beforeAll(async () => {
  await ensureTestDatabase();
  ({ pool } = require('../src/db/pool'));

  const [boardResult] = await pool.query("INSERT INTO boards (name) VALUES ('DB Test Board')");
  boardId = boardResult.insertId;

  const [colAResult] = await pool.query(
    "INSERT INTO columns_ (board_id, name, position) VALUES (?, 'Column A', 0)",
    [boardId]
  );
  columnA = colAResult.insertId;

  const [colBResult] = await pool.query(
    "INSERT INTO columns_ (board_id, name, position) VALUES (?, 'Column B', 1)",
    [boardId]
  );
  columnB = colBResult.insertId;

  await pool.query(
    `INSERT INTO tasks (column_id, title, priority) VALUES
      (?, 'A task 1', 'Low'),
      (?, 'A task 2', 'High'),
      (?, 'B task 1', 'Medium')`,
    [columnA, columnA, columnB]
  );
});

afterAll(async () => {
  await pool.query('DELETE FROM boards WHERE id = ?', [boardId]);
  await pool.end();
});

test('tasks-per-column query returns the right counts for known seed data', async () => {
  const [rows] = await pool.query(
    `SELECT c.id AS column_id, c.name AS column_name, COUNT(t.id) AS task_count
     FROM columns_ c
     LEFT JOIN tasks t ON t.column_id = c.id
     WHERE c.board_id = ?
     GROUP BY c.id, c.name
     ORDER BY c.position, c.id`,
    [boardId]
  );

  const a = rows.find((r) => r.column_id === columnA);
  const b = rows.find((r) => r.column_id === columnB);

  expect(Number(a.task_count)).toBe(2);
  expect(Number(b.task_count)).toBe(1);
});

test('priority query returns only matching tasks, newest first', async () => {
  const [rows] = await pool.query(
    `SELECT t.id, t.title, t.priority, t.created_at
     FROM tasks t
     JOIN columns_ c ON c.id = t.column_id
     WHERE c.board_id = ? AND t.priority = ?
     ORDER BY t.created_at DESC, t.id DESC`,
    [boardId, 'High']
  );

  expect(rows).toHaveLength(1);
  expect(rows[0].title).toBe('A task 2');
});
