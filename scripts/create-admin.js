/**
 * Chạy: node scripts/create-admin.js
 * Tạo tài khoản admin với mật khẩu tùy chỉnh
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../config/db');

const USERNAME = 'admin';
const PASSWORD = 'Admin@123';
const FULL_NAME = 'Administrator';

async function main() {
    const hash = await bcrypt.hash(PASSWORD, 10);
    db.query(
        'INSERT INTO admin_users (username, password, full_name) VALUES (?,?,?) ON DUPLICATE KEY UPDATE password=?, full_name=?',
        [USERNAME, hash, FULL_NAME, hash, FULL_NAME],
        (err) => {
            if (err) { console.error('Lỗi:', err.message); }
            else { console.log(`✅ Tạo tài khoản thành công!\n   Username: ${USERNAME}\n   Password: ${PASSWORD}`); }
            process.exit();
        }
    );
}

main();
