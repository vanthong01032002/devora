CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  position VARCHAR(200) DEFAULT NULL,
  company VARCHAR(200) DEFAULT NULL,
  avatar VARCHAR(500) DEFAULT NULL,
  testimonial TEXT DEFAULT NULL,
  rating TINYINT DEFAULT 5,
  website VARCHAR(500) DEFAULT NULL,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO clients (full_name, position, company, testimonial, rating, display_order, is_active) VALUES
('Chinatown Karaoke', 'Chuỗi KTV', 'Chinatown Karaoke', 'Website song ngữ Việt – Trung giúp khách hàng Trung Quốc tìm thấy và liên hệ đặt phòng dễ dàng hơn hẳn. Đội ngũ hỗ trợ nhanh, chỉnh sửa tận tâm theo đúng nhu cầu vận hành của chuỗi.', 5, 1, 1),
('90S House - Private Lounge', 'Karaoke & Lounge', '90S House - Private Lounge', 'Trang web tải nhanh, giao diện đúng chất lounge cao cấp, khách xem phòng và gọi đặt bàn ngay trên điện thoại rất tiện. Từ ngày có website, lượng khách biết đến quán qua Google tăng rõ rệt.', 5, 2, 1),
('Golden Jazz KTV', 'KTV phục vụ khách Hoa', 'Golden Jazz KTV', 'Devora quản trị nội dung và làm SEO đều tay cho quán, bài viết lên đều, khách quốc tế tìm thấy quán qua Google nhiều hơn trước. Có vấn đề gì nhắn là được hỗ trợ ngay.', 5, 3, 1);
