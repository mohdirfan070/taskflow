const express = require('express');
const cors = require('cors');

const boardsRoutes = require('./routes/boards.routes');
const tasksRoutes = require('./routes/tasks.routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({origin:[process.env.FORNTEND_URL, "http://localhost:5173"],credentials:true}));
app.use(express.json());

app.get('/api/health', (req, res) => res.status(200).json({ msg: 'Server is running fine.' }));

app.use('/api/boards', boardsRoutes);
app.use('/api/tasks', tasksRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
