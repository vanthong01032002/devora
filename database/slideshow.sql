-- Tạo bảng slideshow
CREATE TABLE IF NOT EXISTS slideshow (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_path VARCHAR(500) NOT NULL,
  link VARCHAR(500) DEFAULT NULL,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert dữ liệu mẫu
INSERT INTO slideshow (title, image_path, link, display_order, is_active) VALUES
('Slide 1', '/images/banner_main.jpg', '#', 1, 1),
('Slide 2', '/images/hero-main.png', '#', 2, 1),
('Slide 3', '/images/hero-small.png', '#', 3, 1);
