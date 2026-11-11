/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.14-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: Chainnews
-- ------------------------------------------------------
-- Server version	10.11.14-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `pricing`
--

LOCK TABLES `pricing` WRITE;
/*!40000 ALTER TABLE `pricing` DISABLE KEYS */;
INSERT INTO `pricing` VALUES (1,'Landing Page','Trang giới thiệu sản phẩm / chiến dịch, tối ưu chuyển đổi.',3500000,'trọn gói','[\"1 trang dài, tối đa 8 khối nội dung\",\"Thiết kế độc bản theo thương hiệu\",\"Form thu lead + thông báo email\",\"Tối ưu tốc độ & mobile\",\"Bàn giao toàn bộ mã nguồn\"]',NULL,0,1,1,'2026-11-11 14:28:38','2026-11-11 14:46:09');
INSERT INTO `pricing` VALUES (2,'Website Doanh Nghiệp','Website giới thiệu công ty, dịch vụ, dự án — tự quản trị dễ dàng.',7500000,'trọn gói','[\"Đến 10 trang nội dung\",\"UI/UX trên Figma trước khi code\",\"Blog / tin tức chuẩn SEO\",\"Đa ngôn ngữ (tuỳ chọn)\",\"Bảo hành trọn đời\",\"Bàn giao mã nguồn & quyền quản trị\"]','Được chọn nhiều nhất',1,2,1,'2026-11-11 14:28:38','2026-11-11 14:46:09');
INSERT INTO `pricing` VALUES (3,'Thương Mại Điện Tử','Bán hàng online với giỏ hàng, thanh toán, quản lý đơn & kho.',15000000,'trọn gói','[\"Danh mục & bộ lọc sản phẩm\",\"Thanh toán online, vận chuyển\",\"Quản lý đơn hàng, khuyến mãi\",\"Báo cáo doanh thu\",\"Bảo hành trọn đời\"]',NULL,0,3,1,'2026-11-11 14:28:38','2026-11-11 14:46:09');
/*!40000 ALTER TABLE `pricing` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-11 14:46:49
