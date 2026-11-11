CREATE TABLE IF NOT EXISTS visitor_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip VARCHAR(50) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  browser VARCHAR(100) DEFAULT NULL,
  device VARCHAR(50) DEFAULT 'Desktop',
  page VARCHAR(500) DEFAULT NULL,
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ip (ip),
  INDEX idx_visited (visited_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
