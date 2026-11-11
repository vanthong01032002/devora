const db = require('../../config/db');

const ProcessModel = {
    getAllActive: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM process_steps WHERE is_active=1 ORDER BY display_order ASC', (err, rows) => err ? reject(err) : resolve(rows));
    }),
    getAll: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM process_steps ORDER BY display_order ASC', (err, rows) => err ? reject(err) : resolve(rows));
    }),
    getById: (id) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM process_steps WHERE id=?', [id], (err, rows) => err ? reject(err) : resolve(rows[0] || null));
    }),
    create: (data) => new Promise((resolve, reject) => {
        db.query('INSERT INTO process_steps (step_number,title,description,image_path,color,display_order,is_active) VALUES(?,?,?,?,?,?,?)',
            [data.step_number, data.title, data.description, data.image_path, data.color, data.display_order, data.is_active],
            (err, r) => err ? reject(err) : resolve(r));
    }),
    update: (id, data) => new Promise((resolve, reject) => {
        db.query('UPDATE process_steps SET step_number=?,title=?,description=?,image_path=?,color=?,display_order=?,is_active=? WHERE id=?',
            [data.step_number, data.title, data.description, data.image_path, data.color, data.display_order, data.is_active, id],
            (err, r) => err ? reject(err) : resolve(r));
    }),
    delete: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM process_steps WHERE id=?', [id], (err, r) => err ? reject(err) : resolve(r));
    }),
    toggleActive: (id, val) => new Promise((resolve, reject) => {
        db.query('UPDATE process_steps SET is_active=? WHERE id=?', [val, id], (err, r) => err ? reject(err) : resolve(r));
    })
};

module.exports = ProcessModel;
