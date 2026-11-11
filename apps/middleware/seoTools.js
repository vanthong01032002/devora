const SeoToolsModel = require('../models/seoToolsModel');

// Cache quy tac SEO (link noi dung + redirect) trong 30 giay
let cache = { ts: 0, links: [], redirects: [] };
async function loadRules(force) {
    if (!force && Date.now() - cache.ts < 30000) return cache;
    try {
        const [links, redirects] = await Promise.all([
            SeoToolsModel.getActiveLinks(),
            SeoToolsModel.getActiveRedirects(),
        ]);
        cache = { ts: Date.now(), links, redirects };
    } catch (e) { /* bang chua ton tai -> bo qua, khong lam sap site */ }
    return cache;
}
function invalidate() { cache.ts = 0; }

function normalizePath(p) {
    try { p = decodeURIComponent(p || '/'); } catch (e) { /* giu nguyen */ }
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    return p;
}

// Middleware: ap dung redirect truoc khi vao route trang
async function seoRedirectMiddleware(req, res, next) {
    try {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        const p = req.path || '/';
        if (p.startsWith('/admin') || p.startsWith('/css') || p.startsWith('/js') ||
            p.startsWith('/images') || p.startsWith('/uploads') || /\.[a-z0-9]{2,5}$/i.test(p)) return next();
        const { redirects } = await loadRules(false);
        if (!redirects.length) return next();
        const current = normalizePath(p);
        const hit = redirects.find(r => normalizePath(r.from_path) === current);
        if (hit) return res.redirect(hit.type === 302 ? 302 : 301, hit.to_url);
        return next();
    } catch (e) { return next(); }
}

const SKIP_TAGS = ['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style', 'code', 'pre', 'textarea', 'button'];
function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Gan link tu dong vao noi dung HTML (bai viet): moi tu khoa toi da max_links lan,
// khong gan trong the a/heading/script de tranh long link va hong cau truc.
async function applyAutoLinks(html) {
    if (!html || typeof html !== 'string') return html;
    const { links } = await loadRules(false);
    if (!links.length) return html;
    const rules = links.map(r => ({
        keyword: (r.keyword || '').trim(),
        url: r.url,
        left: Math.max(1, parseInt(r.max_links, 10) || 1),
    })).filter(r => r.keyword.length >= 2);
    if (!rules.length) return html;

    const parts = html.split(/(<[^>]+>)/g);
    let skipDepth = 0;
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!part) continue;
        if (part.startsWith('<')) {
            const m = part.match(/^<\s*(\/?)\s*([a-zA-Z0-9]+)/);
            if (m) {
                const tag = m[2].toLowerCase();
                if (SKIP_TAGS.includes(tag)) {
                    if (m[1] === '/') skipDepth = Math.max(0, skipDepth - 1);
                    else if (!part.endsWith('/>')) skipDepth++;
                }
            }
            continue;
        }
        if (skipDepth > 0) continue;
        let text = part;
        for (const rule of rules) {
            if (rule.left <= 0) continue;
            const re = new RegExp('(?<![\\p{L}\\p{N}])(' + escapeRegExp(rule.keyword) + ')(?![\\p{L}\\p{N}])', 'iu');
            if (re.test(text)) {
                text = text.replace(re, (match) => {
                    rule.left--;
                    return '<a href="' + rule.url + '" title="' + rule.keyword.replace(/"/g, '&quot;') + '">' + match + '</a>';
                });
            }
        }
        parts[i] = text;
    }
    return parts.join('');
}

module.exports = { seoRedirectMiddleware, applyAutoLinks, invalidateSeoCache: invalidate };
