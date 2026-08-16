# TaskFlow — Backend

Express + MySQL API for the TaskFlow task board. This repo is **backend only**
(no frontend included).

## Stack

- Node.js / Express
- MySQL (via `mysql2`, raw parameterized SQL — no ORM)
- Jest + Supertest for tests

## 1. Prerequisites

- Node.js 18+
- A running local MySQL server (MySQL 8+ recommended) that you can connect to
  with a user that can create databases.

## 2. Setup (from a fresh clone)

```bash
cd taskflow-backend
npm install
cp .env.example .env
```

Open `.env` and fill in your MySQL credentials (`DB_USER`, `DB_PASSWORD`,
etc). The defaults assume `root` with no password on `localhost:3306`.

Create the database, tables, and seed data in one step:

```bash
npm run db:init
```

This creates the `taskflow` database (if it doesn't exist), applies
[`schema.sql`](./schema.sql), and loads [`seed.sql`](./seed.sql). Safe to
re-run.

Start the API:

```bash
npm run dev      # with auto-reload (nodemon)
# or
npm start
```

The API listens on `http://localhost:4000` by default (override with `PORT`
in `.env`). Check it's up:

```bash
curl http://localhost:4000/api/health
```

## 3. Running the tests

Tests run against a **separate** database (`TEST_DB_NAME` in `.env`, defaults
to `taskflow_test`) so they never touch your dev data. Nothing extra to set
up — the test suite creates that database and its schema itself on first run.

```bash
npm test
```

What's covered:
- `tests/tasks.test.js` — API-level: rejects a task with an empty title,
  rejects a task with no title at all, creates a valid task, moving a task
  actually updates `column_id` (and persists), and moving to a nonexistent
  column is rejected.
- `tests/db.test.js` — hits the database layer directly: the "tasks per
  column" aggregate query and the "tasks by priority, newest first" query,
  both checked against known seed rows.

## 4. API reference

All responses are JSON. Errors come back as `{ "error": "..." }` with an
appropriate 4xx/5xx status — never a raw stack trace or a blank response.

| Method | Path | Description |
|---|---|---|
| GET | `/api/boards` | List all boards |
| GET | `/api/boards/:boardId` | Board with its columns and tasks nested. Supports `?priority=High` to filter the nested tasks. |
| GET | `/api/boards/:boardId/stats/tasks-per-column` | Count of tasks per column (query #1, see below) |
| GET | `/api/tasks?boardId=&priority=` | Flat list of tasks, optionally filtered by board and/or priority, newest first (query #2, see below) |
| POST | `/api/tasks` | Create a task. Body: `{ column_id, title, description?, priority? }`. `title` is required and validated server-side. |
| PUT | `/api/tasks/:id` | Edit a task. Body: any of `{ title, description, priority }`. |
| PATCH | `/api/tasks/:id/move` | Move a task to another column. Body: `{ column_id }`. |
| DELETE | `/api/tasks/:id` | Delete a task. |

## 5. Database

### Schema

See [`schema.sql`](./schema.sql) for the full `CREATE TABLE` statements.
Summary:

- `boards(id PK, name NOT NULL, created_at)`
- `columns_(id PK, board_id FK -> boards.id, name NOT NULL, position, created_at)`
- `tasks(id PK, column_id FK -> columns_.id, title NOT NULL, description NULL, priority ENUM('Low','Medium','High') NOT NULL DEFAULT 'Medium', created_at)`

Foreign keys cascade on delete (deleting a board removes its columns and
tasks; deleting a column removes its tasks).

The columns table is named `columns_` (trailing underscore) rather than
`columns` — purely to avoid any confusion with MySQL's own
`information_schema.columns`, not because it's a reserved word.

### The two required non-trivial queries

Both are written as real SQL against the database (see
`src/controllers/boards.controller.js` and `src/controllers/tasks.controller.js`,
and mirrored directly in `tests/db.test.js`):

1. **Count of tasks per column on a board** — `GET /api/boards/:boardId/stats/tasks-per-column`:
   ```sql
   SELECT c.id AS column_id, c.name AS column_name, COUNT(t.id) AS task_count
   FROM columns_ c
   LEFT JOIN tasks t ON t.column_id = c.id
   WHERE c.board_id = ?
   GROUP BY c.id, c.name
   ORDER BY c.position, c.id
   ```
2. **Tasks with a given priority, newest first** — `GET /api/tasks?priority=High`:
   ```sql
   SELECT t.id, t.column_id, t.title, t.description, t.priority, t.created_at
   FROM tasks t
   JOIN columns_ c ON c.id = t.column_id
   WHERE t.priority = ?
   ORDER BY t.created_at DESC, t.id DESC
   ```

### Seed data

[`seed.sql`](./seed.sql) creates one board ("Website Relaunch") with three
columns and seven tasks spread across them and across all three priorities,
so filtering and the stats endpoint have something meaningful to show on
first run.

## 6. Notes / assumptions

- **No separate `status` column on tasks.** The assignment describes a task's
  status as "which column it's in." Rather than storing a redundant status
  string that could drift out of sync with the task's actual column, status
  is simply the task's `column_id` (joined to `columns_.name` when a label is
  needed). Moving a task = updating one foreign key.
- **`priority` is a MySQL `ENUM`** rather than a free-text column, so invalid
  values are rejected by the database itself as a second line of defense
  behind the API-level validation.
- Validation (empty title, unknown `column_id`, invalid `priority`) is
  enforced in the controller *and* backed by DB constraints (`NOT NULL`,
  `ENUM`, foreign keys) — the API returns a friendly 400 before ever hitting
  a raw DB error, but the DB would reject it either way.
- This is backend-only, per your request — no frontend is included in this
  repo. CORS is enabled on all origins for local development against any
  frontend dev server.
- Out of scope, per the assignment: auth/accounts, multi-user/team support,
  real-time sync, file uploads.
- Not yet done: the two backend-test bullets I'd add next if there were more
  time are a test for editing a task and a test for the empty-database case
  on the stats endpoint (0 tasks in every column).
