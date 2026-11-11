const db = require('../../config/db');

const ServicesModel = {
    getAllActive: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC', (err, rows) => {
            if (err) return reject(err);
            resolve(rows.map(parseTags));
        });
    }),

    getAll: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM services ORDER BY display_order ASC', (err, rows) => {
            if (err) return reject(err);
            resolve(rows.map(parseTags));
        });
    }),

    getById: (id) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM services WHERE id = ?', [id], (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0] ? parseTags(rows[0]) : null);
        });
    }),

    create: (data) => new Promise((resolve, reject) => {
        const sql = `INSERT INTO services (title, description, tags, image_path, icon_color, display_order, is_active)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [data.title, data.description, data.tags, data.image_path, data.icon_color, data.display_order, data.is_active],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    update: (id, data) => new Promise((resolve, reject) => {
        const sql = `UPDATE services SET title=?, description=?, tags=?, image_path=?, icon_color=?, display_order=?, is_active=? WHERE id=?`;
        db.query(sql, [data.title, data.description, data.tags, data.image_path, data.icon_color, data.display_order, data.is_active, id],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    delete: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM services WHERE id = ?', [id], (err, result) => err ? reject(err) : resolve(result));
    }),

    toggleActive: (id, isActive) => new Promise((resolve, reject) => {
        db.query('UPDATE services SET is_active = ? WHERE id = ?', [isActive, id], (err, result) => err ? reject(err) : resolve(result));
    })
};

function parseTags(row) {
    return { ...row, tagsArray: (row.tags || '').split(',').map(t => t.trim()).filter(Boolean) };
}

module.exports = ServicesModel;
