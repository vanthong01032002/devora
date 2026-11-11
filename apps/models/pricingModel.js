const db = require('../../config/db');

const PricingModel = {
    getAllActive: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM pricing WHERE is_active = 1 ORDER BY display_order ASC', (err, rows) => {
            if (err) return reject(err);
            resolve(rows.map(r => ({ ...r, features: parseFeatures(r.features) })));
        });
    }),

    getAll: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM pricing ORDER BY display_order ASC', (err, rows) => {
            if (err) return reject(err);
            resolve(rows.map(r => ({ ...r, features: parseFeatures(r.features) })));
        });
    }),

    getById: (id) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM pricing WHERE id = ?', [id], (err, rows) => {
            if (err) return reject(err);
            if (!rows[0]) return resolve(null);
            resolve({ ...rows[0], features: parseFeatures(rows[0].features) });
        });
    }),

    create: (data) => new Promise((resolve, reject) => {
        const sql = `INSERT INTO pricing (name, description, price, unit, features, badge, is_featured, display_order, is_active)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [
            data.name, data.description, data.price, data.unit,
            JSON.stringify(data.features), data.badge,
            data.is_featured, data.display_order, data.is_active
        ], (err, result) => err ? reject(err) : resolve(result));
    }),

    update: (id, data) => new Promise((resolve, reject) => {
        const sql = `UPDATE pricing SET name=?, description=?, price=?, unit=?, features=?, badge=?, is_featured=?, display_order=?, is_active=? WHERE id=?`;
        db.query(sql, [
            data.name, data.description, data.price, data.unit,
            JSON.stringify(data.features), data.badge,
            data.is_featured, data.display_order, data.is_active, id
        ], (err, result) => err ? reject(err) : resolve(result));
    }),

    delete: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM pricing WHERE id = ?', [id], (err, result) => err ? reject(err) : resolve(result));
    }),

    toggleActive: (id, isActive) => new Promise((resolve, reject) => {
        db.query('UPDATE pricing SET is_active = ? WHERE id = ?', [isActive, id], (err, result) => err ? reject(err) : resolve(result));
    })
};

function parseFeatures(raw) {
    try { return JSON.parse(raw || '[]'); } catch { return []; }
}

module.exports = PricingModel;
