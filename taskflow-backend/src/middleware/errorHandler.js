function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({ error: 'Referenced record does not exist' });
  }
  if (err.code === 'ER_BAD_NULL_ERROR') {
    return res.status(400).json({ error: 'A required field was missing' });
  }
  if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
    return res.status(503).json({ error: 'Database is unavailable, please try again shortly' });
  }

  res.status(500).json({ error: 'Something went wrong on our end. Please try again.' });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

module.exports = { errorHandler, notFoundHandler };
