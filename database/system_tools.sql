-- ============================================================
-- TEKORA — Công cụ hệ thống admin (Thùng rác + Lịch sử thao tác)
-- Chạy kèm devora-database-full.sql / devora-update-du-lieu.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS trash_items (
    id INT(11) NOT NULL AUTO_INCREMENT,
    item_type VARCHAR(50) NOT NULL COMMENT 'blog_post | client | file',
    item_id INT(11) DEFAULT NULL COMMENT 'ID ban ghi goc (NULL voi file)',
    title VARCHAR(500) DEFAULT NULL COMMENT 'Tieu de / duong dan hien thi',
    payload JSON DEFAULT NULL COMMENT 'Toan bo row goc hoac thong tin file',
    deleted_by VARCHAR(100) DEFAULT NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_trash_type (item_type),
    KEY idx_trash_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_logs (
    id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) DEFAULT NULL,
    action VARCHAR(20) DEFAULT NULL COMMENT 'POST | PUT | DELETE | PATCH',
    path VARCHAR(255) DEFAULT NULL,
    detail VARCHAR(255) DEFAULT NULL,
    ip VARCHAR(64) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_logs_created_at (created_at),
    KEY idx_logs_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
