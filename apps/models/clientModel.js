const db = require('../../config/db');

const ClientModel = {
    getAllActive: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM clients WHERE is_active=1 ORDER BY display_order ASC', (err, rows) => err ? reject(err) : resolve(rows));
    }),
    getAll: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM clients ORDER BY display_order ASC', (err, rows) => err ? reject(err) : resolve(rows));
    }),
    getById: (id) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM clients WHERE id=?', [id], (err, rows) => err ? reject(err) : resolve(rows[0] || null));
    }),
    create: (data) => new Promise((resolve, reject) => {
        db.query('INSERT INTO clients (full_name, position, company, avatar, testimonial, rating, website, display_order, is_active) VALUES (?,?,?,?,?,?,?,?,?)',
            [data.full_name, data.position, data.company, data.avatar, data.testimonial, data.rating||5, data.website, data.display_order, data.is_active],
            (err, r) => err ? reject(err) : resolve(r));
    }),
    update: (id, data) => new Promise((resolve, reject) => {
        db.query('UPDATE clients SET full_name=?, position=?, company=?, avatar=?, testimonial=?, rating=?, website=?, display_order=?, is_active=? WHERE id=?',
            [data.full_name, data.position, data.company, data.avatar, data.testimonial, data.rating||5, data.website, data.display_order, data.is_active, id],
            (err, r) => err ? reject(err) : resolve(r));
    }),
    delete: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM clients WHERE id=?', [id], (err, r) => err ? reject(err) : resolve(r));
    }),
    toggleActive: (id, val) => new Promise((resolve, reject) => {
        db.query('UPDATE clients SET is_active=? WHERE id=?', [val, id], (err, r) => err ? reject(err) : resolve(r));
    })
};

module.exports = ClientModel;
