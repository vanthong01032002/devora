CREATE TABLE IF NOT EXISTS site_popup (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) DEFAULT NULL,
  content TEXT DEFAULT NULL,
  link VARCHAR(500) DEFAULT NULL,
  image_path VARCHAR(500) DEFAULT NULL,
  delay_seconds INT DEFAULT 3,
  show_once TINYINT(1) DEFAULT 1,
  is_active TINYINT(1) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO site_popup (title, content, link, is_active) VALUES
('Ưu đãi đặc biệt!', 'Liên hệ ngay để nhận tư vấn thiết kế website miễn phí và ưu đãi hấp dẫn.', '/lien-he', 0);
