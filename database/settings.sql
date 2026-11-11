CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  `value` TEXT DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO site_settings (`key`, `value`) VALUES
('site_name',       'Công ty TNHH Công Nghệ Devora'),
('site_title',      'Devora - Thiết kế website chuyên nghiệp'),
('address',         '213 Chu Văn An, Phường 26, Quận Bình Thạnh, TPHCM'),
('phone',           '0866.475.366'),
('phone2',          '0909.961.037'),
('hotline',         '0866.475.366'),
('hotline2',        '0909.961.037'),
('email',           'info@devora.vn'),
('website',         'https://devora.vn'),
('zalo',            'https://zalo.me/0866475366'),
('fanpage',         'https://www.facebook.com/devora.vn'),
('google_maps',     'https://maps.google.com'),
('working_hours',   '8h00 đến 17h30 (Thứ 2 - Thứ 7)'),
('copyright',       'Copyright © 2012. Bản quyền website Devora'),
('fanpage_embed',   'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fdevora.vn&tabs=timeline&width=260&height=200&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true')
ON DUPLICATE KEY UPDATE `key` = `key`;

-- Logo và Favicon
INSERT INTO site_settings (`key`, `value`) VALUES
('logo_path',    '/images/logodavora.png'),
('favicon_path', '/images/favicon.ico')
ON DUPLICATE KEY UPDATE `key` = `key`;

INSERT INTO site_settings (`key`, `value`) VALUES
('map_embed', '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4!2d106.7!3d10.77!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzEyLjAiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2svn!4v1234567890" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>')
ON DUPLICATE KEY UPDATE `key` = `key`;

-- Script & Analytics
INSERT INTO site_settings (`key`, `value`) VALUES
('google_analytics', ''),
('google_webmaster', ''),
('head_js', ''),
('body_js', '')
ON DUPLICATE KEY UPDATE `key` = `key`;
