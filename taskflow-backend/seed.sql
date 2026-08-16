DELETE FROM boards;
ALTER TABLE boards AUTO_INCREMENT = 1;
ALTER TABLE columns_ AUTO_INCREMENT = 1;
ALTER TABLE tasks AUTO_INCREMENT = 1;

INSERT INTO boards (id, name) VALUES
  (1, 'Sample Board');

INSERT INTO columns_ (id, board_id, name, position) VALUES
  (1, 1, 'To Do', 0),
  (2, 1, 'In Progress', 1),
  (3, 1, 'Done', 2);

INSERT INTO tasks (column_id, title, description, priority) VALUES
  (1, 'Sample Task A', 'description for task A', 'Medium'),
  (1, 'Sample Task B', 'description for task B', 'Low'),
  (1, 'Sample Task C', 'description for task C', 'High'),
  (2, 'Sample Task D', 'description for task D', 'Medium'),
  (2, 'Sample Task E', 'description for task E', 'High'),
  (3, 'Sample Task F', 'description for task F', 'Low'),
  (3, 'Sample Task G', 'description for task G', 'Medium');

