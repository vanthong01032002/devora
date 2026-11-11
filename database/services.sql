CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  tags VARCHAR(500) DEFAULT NULL,
  image_path VARCHAR(500) DEFAULT NULL,
  icon_color VARCHAR(50) DEFAULT 'blue',
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `services` VALUES (1,'Thiết kế website chuẩn SEO','Chúng tôi thiết kế website chuyên nghiệp, chuẩn SEO phù hợp cho từng ngành nghề, mang đến giao diện mượt mà trên mọi thiết bị và trải nghiệm người dùng trực quan.','Responsive,Chuẩn SEO,Tốc độ cao,Dễ quản trị','https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop','blue',1,1,'2026-11-11 15:31:50','2026-11-11 15:33:03');
INSERT INTO `services` VALUES (2,'SEO tổng thể','Devora triển khai SEO tổng thể từ cấu trúc website, nội dung đến hành trình người dùng. Chúng tôi tập trung tạo traffic chất lượng, phục vụ tăng trưởng kinh doanh ổn định và bền vững.','On-page SEO,Off-page SEO,Technical SEO,Báo cáo định kỳ','https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=1200&auto=format&fit=crop','green',2,1,'2026-11-11 15:31:50','2026-11-11 15:32:52');
INSERT INTO `services` VALUES (3,'Quảng cáo Google & Facebook','Chúng tôi triển khai quảng cáo để doanh nghiệp tiếp cận đúng khách hàng mục tiêu, tối ưu ngân sách và tăng cơ hội chuyển đổi.','Google Ads,Facebook Ads,Tối ưu ngân sách,Báo cáo ROI','https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&auto=format&fit=crop','orange',3,1,'2026-11-11 15:31:50','2026-11-11 15:32:52');
INSERT INTO `services` VALUES (4,'Thiết kế Logo, Branding','Chúng tôi tạo nên hình ảnh thương hiệu rõ ràng và đồng bộ từ logo, banner đến toàn bộ nhận diện thương hiệu.','Logo,Brand Identity,Banner,Ấn phẩm','https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop','purple',4,1,'2026-11-11 15:31:50','2026-11-11 15:32:52');
INSERT INTO `services` VALUES (5,'Quản trị và bảo trì Website','Chúng tôi theo dõi, bảo trì và cập nhật website định kỳ để đảm bảo hoạt động ổn định và hiệu quả.','Bảo trì định kỳ,Backup dữ liệu,Hỗ trợ 24/7,Cập nhật nội dung','https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1200&auto=format&fit=crop','teal',5,1,'2026-11-11 15:31:50','2026-11-11 15:33:03');
INSERT INTO `services` VALUES (6,'Content Marketing','Chúng tôi không chỉ viết nội dung, mà kể câu chuyện về doanh nghiệp bằng ngôn ngữ gần gũi và chân thật.','Bài viết SEO,Social Media,Video Content,Email Marketing','https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop','pink',6,1,'2026-11-11 15:31:50','2026-11-11 15:32:52');;
