CREATE TABLE IF NOT EXISTS seo_pages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_key VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255) DEFAULT NULL,
  keywords VARCHAR(500) DEFAULT NULL,
  description VARCHAR(500) DEFAULT NULL,
  og_image VARCHAR(500) DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO seo_pages (page_key, title, keywords, description) VALUES
('home',     'Tekora - Thiết kế website chuyên nghiệp chuẩn SEO', 'thiết kế website, website chuẩn seo, tekora', 'Tekora cung cấp dịch vụ thiết kế website chuyên nghiệp, chuẩn SEO cho doanh nghiệp Việt.'),
('services', 'Dịch vụ thiết kế website | Tekora', 'dịch vụ thiết kế website, seo tổng thể, quảng cáo google', 'Tekora cung cấp dịch vụ số toàn diện: thiết kế website, SEO, quảng cáo, branding.'),
('news',     'Blog & Tin tức | Tekora', 'blog thiết kế website, tin tức seo, kiến thức website', 'Cập nhật kiến thức thiết kế website, SEO và chuyển đổi số cho doanh nghiệp.')
ON DUPLICATE KEY UPDATE page_key = page_key;
