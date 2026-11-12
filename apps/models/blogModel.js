const db = require('../../config/db');

const BlogModel = {
    getAll: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM blog_posts ORDER BY display_order ASC, created_at DESC', (err, rows) => err ? reject(err) : resolve(rows));
    }),

    getAllActive: (limit = null) => new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM blog_posts WHERE is_active = 1 ORDER BY created_at DESC' + (limit ? ` LIMIT ${parseInt(limit)}` : '');
        db.query(sql, (err, rows) => err ? reject(err) : resolve(rows));
    }),

    getById: (id) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM blog_posts WHERE id = ?', [id], (err, rows) => err ? reject(err) : resolve(rows[0] || null));
    }),

    getBySlug: (slug) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM blog_posts WHERE slug = ? AND is_active = 1', [slug], (err, rows) => err ? reject(err) : resolve(rows[0] || null));
    }),

    getFeatured: (limit = 3) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM blog_posts WHERE is_active = 1 AND is_featured = 1 ORDER BY created_at DESC LIMIT ?', [limit], (err, rows) => err ? reject(err) : resolve(rows));
    }),

    create: (data) => new Promise((resolve, reject) => {
        const sql = `INSERT INTO blog_posts (title, slug, description, content, thumbnail, is_featured, is_active, display_order, seo_title, seo_keywords, seo_description, seo_keyword_main, schema_json)
                     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        db.query(sql, [data.title, data.slug, data.description, data.content, data.thumbnail,
            data.is_featured, data.is_active, data.display_order,
            data.seo_title, data.seo_keywords, data.seo_description, data.seo_keyword_main, data.schema_json],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    update: (id, data) => new Promise((resolve, reject) => {
        const sql = `UPDATE blog_posts SET title=?, slug=?, description=?, content=?, thumbnail=?, is_featured=?, is_active=?, display_order=?, seo_title=?, seo_keywords=?, seo_description=?, seo_keyword_main=?, schema_json=? WHERE id=?`;
        db.query(sql, [data.title, data.slug, data.description, data.content, data.thumbnail,
            data.is_featured, data.is_active, data.display_order,
            data.seo_title, data.seo_keywords, data.seo_description, data.seo_keyword_main, data.schema_json, id],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    delete: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM blog_posts WHERE id = ?', [id], (err, result) => err ? reject(err) : resolve(result));
    }),

    toggleActive: (id, val) => new Promise((resolve, reject) => {
        db.query('UPDATE blog_posts SET is_active = ? WHERE id = ?', [val, id], (err, r) => err ? reject(err) : resolve(r));
    }),

    toggleFeatured: (id, val) => new Promise((resolve, reject) => {
        db.query('UPDATE blog_posts SET is_featured = ? WHERE id = ?', [val, id], (err, r) => err ? reject(err) : resolve(r));
    }),

    incrementViews: (id) => new Promise((resolve, reject) => {
        db.query('UPDATE blog_posts SET views = views + 1 WHERE id = ?', [id], (err, r) => err ? reject(err) : resolve(r));
    }),

    slugExists: (slug, excludeId = null) => new Promise((resolve, reject) => {
        const sql = excludeId
            ? 'SELECT id FROM blog_posts WHERE slug = ? AND id != ?'
            : 'SELECT id FROM blog_posts WHERE slug = ?';
        const params = excludeId ? [slug, excludeId] : [slug];
        db.query(sql, params, (err, rows) => err ? reject(err) : resolve(rows.length > 0));
    })
};

module.exports = BlogModel;
