CREATE TABLE IF NOT EXISTS social_buttons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  link VARCHAR(500) NOT NULL,
  image_path VARCHAR(500) DEFAULT NULL,
  bg_color VARCHAR(20) DEFAULT '#1565c0',
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO social_buttons (title, link, image_path, bg_color, display_order, is_active) VALUES
('Zalo', 'https://zalo.me/0912817117', NULL, '#0068ff', 1, 1),
('Hotline', 'tel:0912817117', NULL, '#1565c0', 2, 1);
