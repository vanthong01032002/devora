CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  position VARCHAR(200) DEFAULT NULL,
  image_path VARCHAR(500) DEFAULT NULL,
  facebook VARCHAR(500) DEFAULT NULL,
  linkedin VARCHAR(500) DEFAULT NULL,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO team_members (full_name, position, display_order, is_active) VALUES
('Nguyễn Văn A', 'CEO & Founder', 1, 1),
('Trần Thị B',   'CTO & Lead Developer', 2, 1),
('Lê Văn C',     'UI/UX Designer', 3, 1),
('Phạm Thị D',   'SEO Specialist', 4, 1);
