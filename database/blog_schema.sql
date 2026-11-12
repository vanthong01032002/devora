-- ============================================================
-- DEVORA — Thêm cột Schema JSON-LD cho bài viết (blog_posts)
-- Cột schema_json: chứa đoạn JSON-LD thô (không gồm thẻ <script>),
-- được render vào trang chi tiết bài viết khi hợp lệ.
-- ============================================================

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS schema_json TEXT NULL AFTER seo_keyword_main;
