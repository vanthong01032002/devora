CREATE TABLE IF NOT EXISTS social_footer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  link VARCHAR(500) NOT NULL,
  icon_type VARCHAR(50) DEFAULT 'custom',
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO social_footer (title, link, icon_type, display_order, is_active) VALUES
('Facebook', 'https://www.facebook.com/devora.vn', 'facebook', 1, 1),
('YouTube', 'https://www.youtube.com/@devora', 'youtube', 2, 1),
('Zalo', 'https://zalo.me/0866475366', 'zalo', 3, 1);
