const db = require('../../config/db');

const PopupModel = {
    get: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM site_popup LIMIT 1', (err, rows) => err ? reject(err) : resolve(rows[0] || null));
    }),
    save: (data) => new Promise((resolve, reject) => {
        db.query(`INSERT INTO site_popup (id, title, content, link, image_path, delay_seconds, show_once, is_active)
                  VALUES (1, ?, ?, ?, ?, ?, ?, ?)
                  ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), link=VALUES(link),
                  image_path=VALUES(image_path), delay_seconds=VALUES(delay_seconds),
                  show_once=VALUES(show_once), is_active=VALUES(is_active)`,
            [data.title, data.content, data.link, data.image_path, data.delay_seconds, data.show_once, data.is_active],
            (err, r) => err ? reject(err) : resolve(r));
    })
};

module.exports = PopupModel;
