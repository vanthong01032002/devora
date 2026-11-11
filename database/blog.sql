CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  content LONGTEXT DEFAULT NULL,
  thumbnail VARCHAR(500) DEFAULT NULL,
  is_featured TINYINT(1) DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  display_order INT DEFAULT 0,
  seo_title VARCHAR(70) DEFAULT NULL,
  seo_keywords VARCHAR(70) DEFAULT NULL,
  seo_description VARCHAR(160) DEFAULT NULL,
  seo_keyword_main VARCHAR(100) DEFAULT NULL,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO blog_posts (title, slug, description, content, is_featured, is_active, display_order, seo_title, seo_description) VALUES
('Thiết kế website chuẩn SEO là gì?', 'thiet-ke-website-chuan-seo-la-gi',
 'Tìm hiểu về thiết kế website chuẩn SEO và tại sao doanh nghiệp cần đầu tư vào nó.',
 '<h2>Thiết kế website chuẩn SEO</h2><p>Nội dung bài viết mẫu...</p>',
 1, 1, 1,
 'Thiết kế website chuẩn SEO là gì? | Devora',
 'Tìm hiểu về thiết kế website chuẩn SEO và tại sao doanh nghiệp cần đầu tư vào nó ngay hôm nay.'),
('5 lý do doanh nghiệp cần website chuyên nghiệp', '5-ly-do-doanh-nghiep-can-website-chuyen-nghiep',
 '5 lý do quan trọng giải thích tại sao mọi doanh nghiệp đều cần một website chuyên nghiệp.',
 '<h2>5 lý do cần website</h2><p>Nội dung bài viết mẫu...</p>',
 0, 1, 2,
 '5 lý do doanh nghiệp cần website chuyên nghiệp | Devora',
 '5 lý do quan trọng giải thích tại sao mọi doanh nghiệp đều cần một website chuyên nghiệp.');
