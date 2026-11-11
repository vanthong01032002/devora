const db = require('../../config/db');

// lấy danh sách user
exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users";

        db.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};