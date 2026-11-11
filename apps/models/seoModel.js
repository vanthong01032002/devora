const db = require('../../config/db');

const SeoModel = {
    getByKey: (key) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM seo_pages WHERE page_key = ?', [key], (err, rows) => err ? reject(err) : resolve(rows[0] || {}));
    }),

    getAll: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM seo_pages ORDER BY id ASC', (err, rows) => {
            if (err) return reject(err);
            const map = {};
            rows.forEach(r => { map[r.page_key] = r; });
            resolve(map);
        });
    }),

    save: (key, data) => new Promise((resolve, reject) => {
        const sql = `INSERT INTO seo_pages (page_key, title, keywords, description, og_image)
                     VALUES (?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE title=VALUES(title), keywords=VALUES(keywords),
                     description=VALUES(description), og_image=VALUES(og_image)`;
        db.query(sql, [key, data.title, data.keywords, data.description, data.og_image],
            (err, result) => err ? reject(err) : resolve(result));
    })
};

module.exports = SeoModel;
