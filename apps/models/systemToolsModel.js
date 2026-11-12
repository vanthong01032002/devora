const db = require('../../config/db');

// Payload JSON lưu Date thành chuỗi ISO ('2026-11-12T00:54:40.000Z') —
// MariaDB strict mode không nhận định dạng này, cần đổi về 'YYYY-MM-DD HH:mm:ss' giờ local.
function toMysqlValue(v) {
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
        const d = new Date(v);
        if (!isNaN(d.getTime())) {
            const p = (n) => String(n).padStart(2, '0');
            return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' +
                   p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
        }
    }
    return v;
}

// ===== Model cho Thùng rác (trash_items) + Lịch sử thao tác (admin_logs) =====
const SystemToolsModel = {
    // ---------- THÙNG RÁC ----------
    trashAdd: (item) => new Promise((resolve, reject) => {
        const sql = 'INSERT INTO trash_items (item_type, item_id, title, payload, deleted_by) VALUES (?,?,?,?,?)';
        db.query(sql, [item.item_type, item.item_id || null, item.title || null,
            item.payload ? JSON.stringify(item.payload) : null, item.deleted_by || null],
            (err, r) => err ? reject(err) : resolve(r));
    }),

    trashGetAll: () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM trash_items ORDER BY deleted_at DESC, id DESC',
            (err, rows) => err ? reject(err) : resolve(rows));
    }),

    trashGetById: (id) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM trash_items WHERE id = ?', [id],
            (err, rows) => err ? reject(err) : resolve(rows[0] || null));
    }),

    trashRemove: (id) => new Promise((resolve, reject) => {
        db.query('DELETE FROM trash_items WHERE id = ?', [id],
            (err, r) => err ? reject(err) : resolve(r));
    }),

    // Chèn lại 1 row vào bảng gốc từ payload (lọc theo danh sách cột cho phép)
    restoreRow: (table, payload, allowedCols) => new Promise((resolve, reject) => {
        const data = {};
        allowedCols.forEach(c => { if (payload[c] !== undefined) data[c] = toMysqlValue(payload[c]); });
        db.query('INSERT INTO ?? SET ?', [table, data],
            (err, r) => err ? reject(err) : resolve(r));
    }),

    // ---------- LỊCH SỬ ----------
    logAdd: (log) => new Promise((resolve, reject) => {
        const sql = 'INSERT INTO admin_logs (username, action, path, detail, ip) VALUES (?,?,?,?,?)';
        db.query(sql, [log.username || null, log.action || null, log.path || null, log.detail || null, log.ip || null],
            (err, r) => err ? reject(err) : resolve(r));
    }),

    logGetLatest: (limit = 200) => new Promise((resolve, reject) => {
        db.query('SELECT * FROM admin_logs ORDER BY id DESC LIMIT ?', [parseInt(limit)],
            (err, rows) => err ? reject(err) : resolve(rows));
    })
};

// Parse payload JSON (MariaDB JSON = LONGTEXT nên có thể là string)
SystemToolsModel.parsePayload = (item) => {
    if (!item || item.payload == null) return null;
    if (typeof item.payload === 'string') {
        try { return JSON.parse(item.payload); } catch { return null; }
    }
    return item.payload;
};

module.exports = SystemToolsModel;
