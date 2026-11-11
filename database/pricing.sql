-- Tạo bảng pricing (bảng giá dịch vụ)
CREATE TABLE IF NOT EXISTS pricing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  price DECIMAL(15,0) NOT NULL DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'gói',
  features TEXT DEFAULT NULL,
  badge VARCHAR(100) DEFAULT NULL,
  is_featured TINYINT(1) DEFAULT 0,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu mẫu (features lưu dạng JSON string)
INSERT INTO pricing (name, description, price, unit, features, badge, is_featured, display_order, is_active) VALUES
('Gói Cơ Bản', 'Phù hợp cho doanh nghiệp nhỏ, startup mới bắt đầu', 3500000, 'gói', '["Thiết kế giao diện chuẩn", "Responsive mobile", "Tối ưu SEO cơ bản", "5 trang nội dung", "Hỗ trợ 3 tháng", "Bàn giao mã nguồn"]', NULL, 0, 1, 1),
('Gói Tiêu Chuẩn', 'Giải pháp toàn diện cho doanh nghiệp vừa và nhỏ', 7500000, 'gói', '["Thiết kế giao diện cao cấp", "Responsive mobile", "SEO tổng thể", "10 trang nội dung", "Tích hợp Google Analytics", "Hỗ trợ 6 tháng", "Bàn giao mã nguồn", "Đào tạo quản trị"]', 'Phổ biến', 1, 2, 1),
('Gói Nâng Cao', 'Dành cho doanh nghiệp lớn, yêu cầu cao', 15000000, 'gói', '["Thiết kế riêng theo thương hiệu", "Responsive mobile", "SEO tổng thể nâng cao", "Không giới hạn trang", "Tích hợp CRM/ERP", "Hỗ trợ 12 tháng", "Bàn giao mã nguồn", "Đào tạo quản trị", "Bảo trì định kỳ", "Tư vấn chiến lược số"]', 'Cao cấp', 0, 3, 1);
