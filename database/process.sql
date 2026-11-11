CREATE TABLE IF NOT EXISTS process_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  step_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  image_path VARCHAR(500) DEFAULT NULL,
  color VARCHAR(20) DEFAULT 'blue',
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO process_steps (step_number, title, description, image_path, color, display_order, is_active) VALUES
(1, 'Tư vấn khách hàng',       'Lắng nghe nhu cầu, tư vấn giải pháp phù hợp nhất.',                    '/images/tab-combo1.png', 'blue',   1, 1),
(2, 'Thiết kế giao diện',      'Thiết kế UI/UX chuẩn thương hiệu, đẹp và chuyên nghiệp.',              '/images/tab-combo2.png', 'purple', 2, 1),
(3, 'Khách hàng duyệt giao diện','Khách hàng xem xét và phê duyệt giao diện thiết kế.',               '/images/tab-monchay.png','red',    3, 1),
(4, 'Triển khai dự án',        'Lập trình, tích hợp tính năng và nội dung đầy đủ.',                    '/images/tab-combo1.png', 'indigo', 4, 1),
(5, 'Nghiệm thu bàn giao',     'Kiểm tra, nghiệm thu và bàn giao website hoàn chỉnh.',                 '/images/tab-combo2.png', 'blue',   5, 1);
