const db = require('../../config/db');

const TemplateModel = {
    getAllActive: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM website_templates WHERE is_active=1 ORDER BY display_order ASC', (err, rows) => err ? reject(err) : resolve(rows));
    }),
    getAll: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM website_templates ORDER BY display_order ASC', (err, rows) => err ? reject(err) : resolve(rows));
    }),
    getById: (id) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM website_templates WHERE id=?', [id], (err, rows) => err ? reject(err) : resolve(rows[0] || null));
    }),
    create: (data) => new Promise((resolve, reject) => {
        db.query('INSERT INTO website_templates (name, category, category_label, description, image_path, uses, is_hot, display_order, is_active) VALUES (?,?,?,?,?,?,?,?,?)',
            [data.name, data.category, data.category_label, data.description, data.image_path, data.uses||0, data.is_hot, data.display_order, data.is_active],
            (err, r) => err ? reject(err) : resolve(r));
    }),
    update: (id, data) => new Promise((resolve, reject) => {
        db.query('UPDATE website_templates SET name=?, category=?, category_label=?, description=?, image_path=?, uses=?, is_hot=?, display_order=?, is_active=? WHERE id=?',
            [data.name, data.category, data.category_label, data.description, data.image_path, data.uses||0, data.is_hot, data.display_order, data.is_active, id],
            (err, r) => err ? reject(err) : resolve(r));
    }),
    delete: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM website_templates WHERE id=?', [id], (err, r) => err ? reject(err) : resolve(r));
    }),
    toggleActive: (id, val) => new Promise((resolve, reject) => {
        db.query('UPDATE website_templates SET is_active=? WHERE id=?', [val, id], (err, r) => err ? reject(err) : resolve(r));
    })
};

module.exports = TemplateModel;
