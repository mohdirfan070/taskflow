
CREATE TABLE IF NOT EXISTS boards (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS columns_ (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  board_id   INT NOT NULL,
  name       VARCHAR(255) NOT NULL,
  position   INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_columns_board
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
  INDEX idx_columns_board_id (board_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  column_id   INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT NULL,
  priority    ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_column
    FOREIGN KEY (column_id) REFERENCES columns_(id) ON DELETE CASCADE,
  INDEX idx_tasks_column_id (column_id),
  INDEX idx_tasks_priority (priority)
) ENGINE=InnoDB;
