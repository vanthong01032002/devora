const db = require('../../config/db');

const SettingsModel = {
    // Lấy tất cả settings dạng object { key: value }
    getAll: () => new Promise((resolve, reject) => {
        db.query('SELECT `key`, `value` FROM site_settings', (err, rows) => {
            if (err) return reject(err);
            const obj = {};
            rows.forEach(r => { obj[r.key] = r.value; });
            resolve(obj);
        });
    }),

    // Lấy một giá trị
    get: (key) => new Promise((resolve, reject) => {
        db.query('SELECT `value` FROM site_settings WHERE `key` = ?', [key], (err, rows) => {
            if (err) return reject(err);
            resolve(rows[0] ? rows[0].value : null);
        });
    }),

    // Lưu nhiều settings cùng lúc
    saveAll: (data) => new Promise((resolve, reject) => {
        const entries = Object.entries(data);
        if (!entries.length) return resolve();
        const sql = 'INSERT INTO site_settings (`key`, `value`) VALUES ? ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)';
        const values = entries.map(([k, v]) => [k, v]);
        db.query(sql, [values], (err, result) => err ? reject(err) : resolve(result));
    })
};

module.exports = SettingsModel;
