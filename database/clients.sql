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
('Mr. Lưu Phước Nguyên', 'CEO', 'Nội thất Mộc Nguyên Cường', 'Devora làm việc khá kỹ trong khâu tư vấn và hiểu rõ đặc thù ngành nội thất. Website sau khi hoàn thiện thể hiện được sản phẩm, hình ảnh và phong cách mà chúng tôi mong muốn.', 5, 1, 1),
('Ms. Trần Hương', 'Giám đốc', 'Spa Thiên Nhiên', 'Đội ngũ Devora rất chuyên nghiệp, tư vấn tận tình và giao website đúng hạn. Chúng tôi rất hài lòng với kết quả nhận được.', 5, 2, 1),
('Mr. Minh Khoa', 'Chủ chuỗi', 'Nhà hàng Mộc Chay', 'Website sau khi làm xong đã giúp chúng tôi tăng đơn hàng online rõ rệt. SEO lên top nhanh hơn mong đợi, rất đáng đầu tư.', 5, 3, 1);
