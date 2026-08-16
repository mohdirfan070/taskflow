# TaskFlow Frontend

```bash
cd taskflow-frontend
npm install

```

### 2. Configure environment variables

Create a `.env` file.

* VITE_API_URL=http://localhost:8080/api


# TaskFlow Backend

Backend API for a simple task management board built with **Node.js, Express, and MySQL**.

## Tech Stack

* Node.js
* Express.js
* MySQL
* mysql2
* Jest & Supertest

## Getting Started

### 1. Install dependencies

```bash
cd taskflow-backend

npm install
```

### 2. Configure environment variables

Create a `.env` 

```env
PORT=8080

DB_HOST=localhost
DB_PORT=3306
DB_NAME=taskflow
DB_USER=root
DB_PASSWORD=
```

Update the database credentials according to your local MySQL setup.

### 3. Initialize the database

Run:

```bash
npm run db:init
```

This will create the database, tables, and some sample data.

### 4. Start the server

For development:

```bash
npm run dev
```

Or run normally:

```bash
npm start
```

The API will be available at:

```text
http://localhost:8080
```

You can check if the server is running with:

```bash
curl http://localhost:8080/api/health
```

## API Endpoints

### Boards

| Method | Endpoint                                      | Description                            |
| ------ | --------------------------------------------- | -------------------------------------- |
| GET    | `/api/boards`                                 | Get all boards                         |
| GET    | `/api/boards/:boardId`                        | Get a board with its columns and tasks |
| GET    | `/api/boards/:boardId/stats/tasks-per-column` | Get task count for each column         |

### Tasks

| Method | Endpoint              | Description                   |
| ------ | --------------------- | ----------------------------- |
| GET    | `/api/tasks`          | Get tasks                     |
| POST   | `/api/tasks`          | Create a task                 |
| PUT    | `/api/tasks/:id`      | Update a task                 |
| PATCH  | `/api/tasks/:id/move` | Move a task to another column |
| DELETE | `/api/tasks/:id`      | Delete a task                 |

Tasks can also be filtered by board or priority:

```text
GET /api/tasks?boardId=1&priority=High
```

### Create a Task

```json
{
  "column_id": 1,
  "title": "Complete homepage",
  "description": "Finish the homepage design",
  "priority": "High"
}
```

`title` and `column_id` are required.

## Database

The project uses three main tables:

* `boards` – stores task boards
* `columns_` – stores columns belonging to a board
* `tasks` – stores tasks and their details

A task's current status is determined by the column it belongs to. Moving a task simply updates its `column_id`.

## Testing

Run the test suite with:

```bash
npm test
```

The tests cover the main task APIs and database queries.

## Project Structure

```text
taskflow-backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── db/
│   └── app.js
├── tests/
├── schema.sql
├── seed.sql
├── .env.example
├── package.json
└── README.md
```

## Notes

* MySQL is required to run the project.
* The backend is designed to work with a separate frontend.
* CORS is enabled for local development.
* Authentication and multi-user features are not included.



