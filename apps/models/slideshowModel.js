const db = require('../../config/db');

const SlideshowModel = {
    // Lấy tất cả slides đang active
    getAllActive: () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM slideshow WHERE is_active = 1 ORDER BY display_order ASC';
            db.query(sql, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    // Lấy tất cả slides (admin)
    getAll: () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM slideshow ORDER BY display_order ASC';
            db.query(sql, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    },

    // Lấy slide theo ID
    getById: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM slideshow WHERE id = ?';
            db.query(sql, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    },

    // Thêm slide mới
    create: (data) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO slideshow (title, image_path, link, display_order, is_active) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [data.title, data.image_path, data.link, data.display_order, data.is_active], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    // Cập nhật slide
    update: (id, data) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE slideshow SET title = ?, image_path = ?, link = ?, display_order = ?, is_active = ? WHERE id = ?';
            db.query(sql, [data.title, data.image_path, data.link, data.display_order, data.is_active, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    // Xóa slide
    delete: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM slideshow WHERE id = ?';
            db.query(sql, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    },

    // Toggle active status
    toggleActive: (id, isActive) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE slideshow SET is_active = ? WHERE id = ?';
            db.query(sql, [isActive, id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
};

module.exports = SlideshowModel;
