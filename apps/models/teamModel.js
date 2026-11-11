const db = require('../../config/db');

const TeamModel = {
    getAllActive: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM team_members WHERE is_active=1 ORDER BY display_order ASC', (err, rows) => err ? reject(err) : resolve(rows));
    }),
    getAll: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM team_members ORDER BY display_order ASC', (err, rows) => err ? reject(err) : resolve(rows));
    }),
    getById: (id) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM team_members WHERE id=?', [id], (err, rows) => err ? reject(err) : resolve(rows[0] || null));
    }),
    create: (data) => new Promise((resolve, reject) => {
        db.query('INSERT INTO team_members (full_name, position, image_path, facebook, linkedin, display_order, is_active) VALUES (?,?,?,?,?,?,?)',
            [data.full_name, data.position, data.image_path, data.facebook, data.linkedin, data.display_order, data.is_active],
            (err, r) => err ? reject(err) : resolve(r));
    }),
    update: (id, data) => new Promise((resolve, reject) => {
        db.query('UPDATE team_members SET full_name=?, position=?, image_path=?, facebook=?, linkedin=?, display_order=?, is_active=? WHERE id=?',
            [data.full_name, data.position, data.image_path, data.facebook, data.linkedin, data.display_order, data.is_active, id],
            (err, r) => err ? reject(err) : resolve(r));
    }),
    delete: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM team_members WHERE id=?', [id], (err, r) => err ? reject(err) : resolve(r));
    }),
    toggleActive: (id, val) => new Promise((resolve, reject) => {
        db.query('UPDATE team_members SET is_active=? WHERE id=?', [val, id], (err, r) => err ? reject(err) : resolve(r));
    })
};

module.exports = TeamModel;
