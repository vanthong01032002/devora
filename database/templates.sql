CREATE TABLE IF NOT EXISTS website_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'khac',
  category_label VARCHAR(100) DEFAULT 'Khác',
  description TEXT DEFAULT NULL,
  image_path VARCHAR(500) DEFAULT NULL,
  uses INT DEFAULT 0,
  is_hot TINYINT(1) DEFAULT 0,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO website_templates (name, category, category_label, uses, is_hot, display_order, is_active) VALUES
('Mẫu website BĐS 1',       'bds',     'Bất động sản', 29, 1, 1, 1),
('Mẫu website F&B 1',        'fnb',     'F&B',           28, 1, 2, 1),
('Mẫu website xây dựng 1',  'xaydung', 'Xây dựng',      19, 0, 3, 1),
('Mẫu website nội thất 1',  'noithat', 'Nội thất',       24, 0, 4, 1),
('Mẫu website F&B 4',        'fnb',     'F&B',           21, 0, 5, 1),
('Mẫu website du lịch 1',   'dulich',  'Du lịch',        26, 0, 6, 1),
('Mẫu website làm đẹp 1',   'lamdep',  'Làm đẹp',        26, 1, 7, 1),
('Mẫu website giáo dục 1',  'giaoduc', 'Giáo dục',       13, 0, 8, 1),
('Mẫu website bán hàng 1',  'banhang', 'Bán hàng',       19, 0, 9, 1);
