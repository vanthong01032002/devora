const db = require('../../config/db');

function detectBrowser(ua) {
    if (!ua) return 'Unknown';
    if (/Edg\//i.test(ua))     return 'Edge';
    if (/OPR\//i.test(ua))     return 'Opera';
    if (/Chrome\//i.test(ua))  return 'Chrome';
    if (/Firefox\//i.test(ua)) return 'Firefox';
    if (/Safari\//i.test(ua))  return 'Safari';
    if (/MSIE|Trident/i.test(ua)) return 'IE';
    return 'Other';
}

function detectDevice(ua) {
    if (!ua) return 'Desktop';
    if (/Mobile|Android.*Mobile|iPhone|iPod/i.test(ua)) return 'Mobile';
    if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua))    return 'Tablet';
    return 'Desktop';
}

const VisitorModel = {
    log: (ip, userAgent, page) => new Promise((resolve) => {
        const browser = detectBrowser(userAgent);
        const device  = detectDevice(userAgent);
        db.query('INSERT INTO visitor_logs (ip, user_agent, browser, device, page) VALUES (?,?,?,?,?)',
            [ip, userAgent, browser, device, page],
            () => resolve());
    }),

    getTopIPs: (limit = 10) => new Promise((resolve, reject) => {
        db.query(`SELECT ip, COUNT(*) as visits FROM visitor_logs
                  WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                  GROUP BY ip ORDER BY visits DESC LIMIT ?`, [limit],
            (err, rows) => err ? reject(err) : resolve(rows));
    }),

    getBrowserStats: () => new Promise((resolve, reject) => {
        db.query(`SELECT browser, COUNT(*) as count FROM visitor_logs
                  WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                  GROUP BY browser ORDER BY count DESC`,
            (err, rows) => err ? reject(err) : resolve(rows));
    }),

    getDeviceStats: () => new Promise((resolve, reject) => {
        db.query(`SELECT device, COUNT(*) as count FROM visitor_logs
                  WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                  GROUP BY device ORDER BY count DESC`,
            (err, rows) => err ? reject(err) : resolve(rows));
    }),

    getTotalToday: () => new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) as total FROM visitor_logs WHERE DATE(visited_at) = CURDATE()`,
            (err, rows) => err ? reject(err) : resolve(rows[0]?.total || 0));
    }),

    getTotalMonth: () => new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) as total FROM visitor_logs WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
            (err, rows) => err ? reject(err) : resolve(rows[0]?.total || 0));
    })
};

module.exports = { VisitorModel, detectBrowser, detectDevice };
