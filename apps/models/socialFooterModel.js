const db = require('../../config/db');

const SocialFooterModel = {
    getAllActive: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM social_footer WHERE is_active = 1 ORDER BY display_order ASC',
            (err, rows) => err ? reject(err) : resolve(rows));
    }),

    getAll: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM social_footer ORDER BY display_order ASC',
            (err, rows) => err ? reject(err) : resolve(rows));
    }),

    getById: (id) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM social_footer WHERE id = ?', [id],
            (err, rows) => err ? reject(err) : resolve(rows[0] || null));
    }),

    create: (data) => new Promise((resolve, reject) => {
        db.query('INSERT INTO social_footer (title, link, icon_type, display_order, is_active) VALUES (?,?,?,?,?)',
            [data.title, data.link, data.icon_type, data.display_order, data.is_active],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    update: (id, data) => new Promise((resolve, reject) => {
        db.query('UPDATE social_footer SET title=?, link=?, icon_type=?, display_order=?, is_active=? WHERE id=?',
            [data.title, data.link, data.icon_type, data.display_order, data.is_active, id],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    delete: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM social_footer WHERE id = ?', [id],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    toggleActive: (id, isActive) => new Promise((resolve, reject) => {
        db.query('UPDATE social_footer SET is_active = ? WHERE id = ?', [isActive, id],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    deleteAll: () => new Promise((resolve, reject) => {
        db.query('DELETE FROM social_footer', (err, result) => err ? reject(err) : resolve(result));
    })
};

module.exports = SocialFooterModel;
