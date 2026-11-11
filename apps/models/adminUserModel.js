const db = require('../../config/db');
const bcrypt = require('bcrypt');

const AdminUserModel = {
    findByUsername: (username) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM admin_users WHERE username = ? AND is_active = 1', [username],
            (err, rows) => err ? reject(err) : resolve(rows[0] || null));
    }),

    verifyPassword: (plain, hash) => bcrypt.compare(plain, hash),

    // Tạo hash cho password mới
    hashPassword: (plain) => bcrypt.hash(plain, 10),

    updatePassword: (id, hash) => new Promise((resolve, reject) => {
        db.query('UPDATE admin_users SET password = ? WHERE id = ?', [hash, id],
            (err, r) => err ? reject(err) : resolve(r));
    })
};

module.exports = AdminUserModel;
