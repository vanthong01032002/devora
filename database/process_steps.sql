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
-- Dumping data for table `process_steps`
--

LOCK TABLES `process_steps` WRITE;
/*!40000 ALTER TABLE `process_steps` DISABLE KEYS */;
INSERT INTO `process_steps` VALUES (1,1,'Tư vấn khách hàng','Lắng nghe nhu cầu, tư vấn giải pháp phù hợp nhất.',NULL,'blue',1,1,'2026-11-11 14:28:38','2026-11-11 14:57:15');
INSERT INTO `process_steps` VALUES (2,2,'Thiết kế giao diện','Thiết kế UI/UX chuẩn thương hiệu, đẹp và chuyên nghiệp.',NULL,'purple',2,1,'2026-11-11 14:28:38','2026-11-11 14:57:15');
INSERT INTO `process_steps` VALUES (3,3,'Khách hàng duyệt giao diện','Khách hàng xem xét và phê duyệt giao diện thiết kế.',NULL,'red',3,1,'2026-11-11 14:28:38','2026-11-11 14:57:15');
INSERT INTO `process_steps` VALUES (4,4,'Triển khai dự án','Lập trình, tích hợp tính năng và nội dung đầy đủ.',NULL,'indigo',4,1,'2026-11-11 14:28:38','2026-11-11 14:57:15');
INSERT INTO `process_steps` VALUES (5,5,'Nghiệm thu bàn giao','Kiểm tra, nghiệm thu và bàn giao website hoàn chỉnh.',NULL,'blue',5,1,'2026-11-11 14:28:38','2026-11-11 14:57:15');
/*!40000 ALTER TABLE `process_steps` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-11 14:57:15
