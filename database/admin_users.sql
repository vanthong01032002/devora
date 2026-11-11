CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(200) DEFAULT 'Administrator',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tài khoản mặc định: admin / Admin@123
-- Hash bcrypt của "Admin@123"
INSERT INTO admin_users (username, password, full_name) VALUES
('admin', '$2b$10$gXy2j2EdAW3wejbz.idxy.gZGdMBLQIQ.hUVOFFUWgJFXKDtS0Zym', 'Administrator')
ON DUPLICATE KEY UPDATE username = username;
