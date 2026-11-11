-- Nội dung trang liên hệ (admin chỉnh sửa)
CREATE TABLE IF NOT EXISTS contact_page (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) DEFAULT 'Liên hệ với chúng tôi',
  description TEXT DEFAULT NULL,
  image_path VARCHAR(500) DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO contact_page (title, description, image_path) VALUES
('Liên hệ với chúng tôi',
 'Hãy để lại thông tin, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất. Devora luôn sẵn sàng lắng nghe và hỗ trợ bạn.',
 NULL);

-- Lưu tin nhắn từ form liên hệ
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) DEFAULT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  subject VARCHAR(300) DEFAULT NULL,
  message TEXT DEFAULT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
