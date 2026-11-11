const db = require('../../config/db');

const ContactModel = {
    getPage: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM contact_page LIMIT 1', (err, rows) => err ? reject(err) : resolve(rows[0] || {}));
    }),

    updatePage: (data) => new Promise((resolve, reject) => {
        db.query('UPDATE contact_page SET title=?, description=?, image_path=? WHERE id=1',
            [data.title, data.description, data.image_path],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    saveMessage: (data) => new Promise((resolve, reject) => {
        db.query('INSERT INTO contact_messages (full_name, email, phone, subject, message) VALUES (?,?,?,?,?)',
            [data.full_name, data.email, data.phone, data.subject, data.message],
            (err, result) => err ? reject(err) : resolve(result));
    }),

    getMessages: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM contact_messages ORDER BY created_at DESC', (err, rows) => err ? reject(err) : resolve(rows));
    }),

    markRead: (id) => new Promise((resolve, reject) => {
        db.query('UPDATE contact_messages SET is_read=1 WHERE id=?', [id], (err, r) => err ? reject(err) : resolve(r));
    }),

    deleteMessage: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM contact_messages WHERE id=?', [id], (err, r) => err ? reject(err) : resolve(r));
    })
};

module.exports = ContactModel;
