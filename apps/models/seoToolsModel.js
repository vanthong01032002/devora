const db = require('../../config/db');

function q(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params || [], (err, rows) => err ? reject(err) : resolve(rows));
    });
}

const SeoToolsModel = {
    // ===== Link noi dung (auto-link) =====
    getAllLinks: () => q('SELECT * FROM seo_links ORDER BY id DESC'),
    getActiveLinks: () => q('SELECT * FROM seo_links WHERE is_active = 1 ORDER BY CHAR_LENGTH(keyword) DESC'),
    getLink: async (id) => (await q('SELECT * FROM seo_links WHERE id = ?', [id]))[0] || null,
    createLink: (d) => q('INSERT INTO seo_links (keyword, url, max_links, is_active) VALUES (?, ?, ?, ?)',
        [d.keyword, d.url, d.max_links || 1, d.is_active ? 1 : 0]),
    updateLink: (id, d) => q('UPDATE seo_links SET keyword = ?, url = ?, max_links = ?, is_active = ? WHERE id = ?',
        [d.keyword, d.url, d.max_links || 1, d.is_active ? 1 : 0, id]),
    deleteLink: (id) => q('DELETE FROM seo_links WHERE id = ?', [id]),
    toggleLink: (id) => q('UPDATE seo_links SET is_active = 1 - is_active WHERE id = ?', [id]),

    // ===== Dieu huong link (redirect) =====
    getAllRedirects: () => q('SELECT * FROM seo_redirects ORDER BY id DESC'),
    getActiveRedirects: () => q('SELECT * FROM seo_redirects WHERE is_active = 1'),
    getRedirect: async (id) => (await q('SELECT * FROM seo_redirects WHERE id = ?', [id]))[0] || null,
    createRedirect: (d) => q('INSERT INTO seo_redirects (from_path, to_url, type, is_active) VALUES (?, ?, ?, ?)',
        [d.from_path, d.to_url, d.type || 301, d.is_active ? 1 : 0]),
    updateRedirect: (id, d) => q('UPDATE seo_redirects SET from_path = ?, to_url = ?, type = ?, is_active = ? WHERE id = ?',
        [d.from_path, d.to_url, d.type || 301, d.is_active ? 1 : 0, id]),
    deleteRedirect: (id) => q('DELETE FROM seo_redirects WHERE id = ?', [id]),
    toggleRedirect: (id) => q('UPDATE seo_redirects SET is_active = 1 - is_active WHERE id = ?', [id]),
};

module.exports = SeoToolsModel;
