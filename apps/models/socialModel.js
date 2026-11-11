const db = require('../../config/db');

const SocialModel = {
    getAllActive: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM social_buttons WHERE is_active = 1 ORDER BY display_order ASC', (err, rows) => {
            err ? reject(err) : resolve(rows);
        });
    }),

    getAll: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM social_buttons ORDER BY display_order ASC', (err, rows) => {
            err ? reject(err) : resolve(rows);
        });
    }),

    getById: (id) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM social_buttons WHERE id = ?', [id], (err, rows) => {
            err ? reject(err) : resolve(rows[0] || null);
        });
    }),

    create: (data) => new Promise((resolve, reject) => {
        const sql = 'INSERT INTO social_buttons (title, link, image_path, bg_color, display_order, is_active) VALUES (?,?,?,?,?,?)';
        db.query(sql, [data.title, data.link, data.image_path, data.bg_color, data.display_order, data.is_active],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    update: (id, data) => new Promise((resolve, reject) => {
        const sql = 'UPDATE social_buttons SET title=?, link=?, image_path=?, bg_color=?, display_order=?, is_active=? WHERE id=?';
        db.query(sql, [data.title, data.link, data.image_path, data.bg_color, data.display_order, data.is_active, id],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    delete: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM social_buttons WHERE id = ?', [id], (err, result) => err ? reject(err) : resolve(result));
    }),

    toggleActive: (id, isActive) => new Promise((resolve, reject) => {
        db.query('UPDATE social_buttons SET is_active = ? WHERE id = ?', [isActive, id],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    deleteAll: () => new Promise((resolve, reject) => {
        db.query('DELETE FROM social_buttons', (err, result) => err ? reject(err) : resolve(result));
    })
};

module.exports = SocialModel;
