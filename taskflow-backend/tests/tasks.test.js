const { ensureTestDatabase } = require('./testDb');
const request = require('supertest');

let app;
let pool;
let boardId;
let todoColumnId;
let doneColumnId;

beforeAll(async () => {
  await ensureTestDatabase();
  app = require('../src/app');
  ({ pool } = require('../src/db/pool'));

  const [boardResult] = await pool.query("INSERT INTO boards (name) VALUES ('API Test Board')");
  boardId = boardResult.insertId;

  const [todoResult] = await pool.query(
    "INSERT INTO columns_ (board_id, name, position) VALUES (?, 'To Do', 0)",
    [boardId]
  );
  todoColumnId = todoResult.insertId;

  const [doneResult] = await pool.query(
    "INSERT INTO columns_ (board_id, name, position) VALUES (?, 'Done', 1)",
    [boardId]
  );
  doneColumnId = doneResult.insertId;
});

afterAll(async () => {
  // Cascades to columns_ and tasks via the FK ON DELETE CASCADE.
  await pool.query('DELETE FROM boards WHERE id = ?', [boardId]);
  await pool.end();
});

describe('POST /api/tasks', () => {
  test('rejects a task with an empty title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ column_id: todoColumnId, title: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  test('rejects a task with a missing title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ column_id: todoColumnId, description: 'no title here' });

    expect(res.status).toBe(400);
  });

  test('creates a task with a valid title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ column_id: todoColumnId, title: 'Write tests', priority: 'High' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Write tests');
    expect(res.body.column_id).toBe(todoColumnId);
  });
});

describe('PATCH /api/tasks/:id/move', () => {
  test('moving a task updates its column_id', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .send({ column_id: todoColumnId, title: 'Move me to Done' });

    const taskId = createRes.body.id;

    const moveRes = await request(app)
      .patch(`/api/tasks/${taskId}/move`)
      .send({ column_id: doneColumnId });

    expect(moveRes.status).toBe(200);
    expect(moveRes.body.column_id).toBe(doneColumnId);

    // Confirm it actually persisted, not just echoed back.
    const [rows] = await pool.query('SELECT column_id FROM tasks WHERE id = ?', [taskId]);
    expect(rows[0].column_id).toBe(doneColumnId);
  });

  test('rejects moving a task to a column that does not exist', async () => {
    const createRes = await request(app)
      .post('/api/tasks')
      .send({ column_id: todoColumnId, title: 'Stays put' });

    const moveRes = await request(app)
      .patch(`/api/tasks/${createRes.body.id}/move`)
      .send({ column_id: 999999 });

    expect(moveRes.status).toBe(400);
  });
});
