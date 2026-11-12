const SystemToolsModel = require('../models/systemToolsModel');

// Ghi lịch sử thao tác admin: chỉ ghi các request thay đổi dữ liệu (POST/PUT/PATCH/DELETE)
// vào khu vực /admin. Ghi SAU KHI response kết thúc để không làm chậm request chính.
module.exports = function adminLogger(req, res, next) {
    const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (writeMethods.includes(req.method) && req.path.startsWith('/admin')) {
        res.on('finish', () => {
            const username = (req.session && req.session.adminUser) ? req.session.adminUser.username : 'unknown';
            const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '';
            SystemToolsModel.logAdd({
                username,
                action: req.method,
                path: (req.originalUrl || req.url || '').slice(0, 255),
                detail: 'HTTP ' + res.statusCode,
                ip: ip.slice(0, 64)
            }).catch(() => { /* bảng log chưa có thì bỏ qua, không phá luồng chính */ });
        });
    }
    next();
};
