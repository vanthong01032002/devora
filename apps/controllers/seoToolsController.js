const SeoToolsModel = require('../models/seoToolsModel');
const { invalidateSeoCache } = require('../middleware/seoTools');

function go(res, path, ok, msg) {
    return res.redirect(path + (path.includes('?') ? '&' : '?') + (ok ? 'success=' : 'error=') + encodeURIComponent(msg));
}
function pageData(req, extra) {
    return Object.assign({
        layout: 'layouts/admin',
        success: req.query.success || null,
        error: req.query.error || null,
    }, extra || {});
}

// ================= LINK NOI DUNG =================
exports.linksPage = async (req, res) => {
    try {
        const items = await SeoToolsModel.getAllLinks();
        let editItem = null;
        if (req.query.edit) editItem = await SeoToolsModel.getLink(parseInt(req.query.edit, 10));
        res.render('admin/seo-tools/links', pageData(req, { title: 'Link nội dung', items, editItem }));
    } catch (e) { res.render('admin/seo-tools/links', pageData(req, { title: 'Link nội dung', items: [], editItem: null, error: 'Chưa có bảng seo_links. Hãy import file database/seo_tools.sql (hoặc devora-update-du-lieu.sql) vào phpMyAdmin.' })); }
};
exports.linksSave = async (req, res) => {
    const back = '/admin/seo-tools/links';
    try {
        const d = {
            keyword: (req.body.keyword || '').trim(),
            url: (req.body.url || '').trim(),
            max_links: Math.min(10, Math.max(1, parseInt(req.body.max_links, 10) || 1)),
            is_active: req.body.is_active ? 1 : 0,
        };
        if (!d.keyword || !d.url) return go(res, back, false, 'Vui lòng nhập đầy đủ từ khóa và link đích.');
        if (req.body.id) { await SeoToolsModel.updateLink(parseInt(req.body.id, 10), d); invalidateSeoCache(); return go(res, back, true, 'Đã cập nhật link nội dung.'); }
        await SeoToolsModel.createLink(d); invalidateSeoCache();
        return go(res, back, true, 'Đã thêm link nội dung. Từ khóa sẽ tự gắn link trong nội dung bài viết.');
    } catch (e) { return go(res, back, false, 'Lỗi lưu dữ liệu: ' + e.message); }
};
exports.linksDelete = async (req, res) => {
    try { await SeoToolsModel.deleteLink(parseInt(req.params.id, 10)); invalidateSeoCache(); return go(res, '/admin/seo-tools/links', true, 'Đã xóa link nội dung.'); }
    catch (e) { return go(res, '/admin/seo-tools/links', false, 'Lỗi xóa: ' + e.message); }
};
exports.linksToggle = async (req, res) => {
    try { await SeoToolsModel.toggleLink(parseInt(req.params.id, 10)); invalidateSeoCache(); return go(res, '/admin/seo-tools/links', true, 'Đã đổi trạng thái hiển thị.'); }
    catch (e) { return go(res, '/admin/seo-tools/links', false, 'Lỗi: ' + e.message); }
};

// ================= DIEU HUONG LINK =================
exports.redirectsPage = async (req, res) => {
    try {
        const items = await SeoToolsModel.getAllRedirects();
        let editItem = null;
        if (req.query.edit) editItem = await SeoToolsModel.getRedirect(parseInt(req.query.edit, 10));
        res.render('admin/seo-tools/redirects', pageData(req, { title: 'Điều hướng link', items, editItem }));
    } catch (e) { res.render('admin/seo-tools/redirects', pageData(req, { title: 'Điều hướng link', items: [], editItem: null, error: 'Chưa có bảng seo_redirects. Hãy import file database/seo_tools.sql (hoặc devora-update-du-lieu.sql) vào phpMyAdmin.' })); }
};
exports.redirectsSave = async (req, res) => {
    const back = '/admin/seo-tools/redirects';
    try {
        let from = (req.body.from_path || '').trim();
        const d = {
            from_path: from.startsWith('/') ? from : '/' + from,
            to_url: (req.body.to_url || '').trim(),
            type: req.body.type === '302' ? 302 : 301,
            is_active: req.body.is_active ? 1 : 0,
        };
        if (!from || !d.to_url) return go(res, back, false, 'Vui lòng nhập đầy đủ link cũ và link đích.');
        if (d.from_path === d.to_url) return go(res, back, false, 'Link cũ và link đích đang trùng nhau.');
        if (req.body.id) { await SeoToolsModel.updateRedirect(parseInt(req.body.id, 10), d); invalidateSeoCache(); return go(res, back, true, 'Đã cập nhật điều hướng.'); }
        await SeoToolsModel.createRedirect(d); invalidateSeoCache();
        return go(res, back, true, 'Đã thêm điều hướng link.');
    } catch (e) { return go(res, back, false, 'Lỗi lưu dữ liệu: ' + e.message); }
};
exports.redirectsDelete = async (req, res) => {
    try { await SeoToolsModel.deleteRedirect(parseInt(req.params.id, 10)); invalidateSeoCache(); return go(res, '/admin/seo-tools/redirects', true, 'Đã xóa điều hướng.'); }
    catch (e) { return go(res, '/admin/seo-tools/redirects', false, 'Lỗi xóa: ' + e.message); }
};
exports.redirectsToggle = async (req, res) => {
    try { await SeoToolsModel.toggleRedirect(parseInt(req.params.id, 10)); invalidateSeoCache(); return go(res, '/admin/seo-tools/redirects', true, 'Đã đổi trạng thái điều hướng.'); }
    catch (e) { return go(res, '/admin/seo-tools/redirects', false, 'Lỗi: ' + e.message); }
};

// ================= CHECK SEO =================
function siteBase(req) { return req.protocol + '://' + req.get('host'); }
exports.checkPage = (req, res) => {
    const base = siteBase(req);
    const quickPages = [
        { label: 'Trang chủ', path: '/' }, { label: 'Về chúng tôi', path: '/ve-chung-toi' },
        { label: 'Thiết kế website', path: '/thiet-ke-website' }, { label: 'Dịch vụ', path: '/dich-vu' },
        { label: 'Khách hàng', path: '/khach-hang' }, { label: 'Blog', path: '/blog' }, { label: 'Liên hệ', path: '/lien-he' },
    ].map(p => ({ label: p.label, url: base + p.path }));
    res.render('admin/seo-tools/check', pageData(req, { title: 'Check SEO', quickPages, result: null, form: { url: '', keyword: '' } }));
};

function stripTags(html) {
    return (html || '')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
        .replace(/\s+/g, ' ').trim();
}
function metaContent(html, attr, value) {
    const tags = html.match(/<meta[^>]+>/gi) || [];
    for (const t of tags) {
        if (new RegExp(attr + '\\s*=\\s*["\']' + value + '["\']', 'i').test(t)) {
            const m = t.match(/content\s*=\s*"([^"]*)"/i) || t.match(/content\s*=\s*'([^']*)'/i);
            return m ? m[1].trim() : '';
        }
    }
    return '';
}
function countOccurrences(text, phrase) {
    if (!phrase) return 0;
    const esc = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = text.match(new RegExp('(?<![\\p{L}\\p{N}])' + esc + '(?![\\p{L}\\p{N}])', 'giu'));
    return m ? m.length : 0;
}

exports.checkRun = async (req, res) => {
    const base = siteBase(req);
    let url = (req.body.url || '').trim();
    const keyword = (req.body.keyword || '').trim();
    const quickPages = [
        { label: 'Trang chủ', path: '/' }, { label: 'Về chúng tôi', path: '/ve-chung-toi' },
        { label: 'Thiết kế website', path: '/thiet-ke-website' }, { label: 'Dịch vụ', path: '/dich-vu' },
        { label: 'Khách hàng', path: '/khach-hang' }, { label: 'Blog', path: '/blog' }, { label: 'Liên hệ', path: '/lien-he' },
    ].map(p => ({ label: p.label, url: base + p.path }));
    const renderBack = (result, error) => res.render('admin/seo-tools/check', pageData(req, { title: 'Check SEO', quickPages, result, form: { url, keyword }, error: error || null }));
    try {
        if (!url) return renderBack(null, 'Vui lòng nhập URL cần kiểm tra.');
        if (url.startsWith('/')) url = base + url;
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

        const t0 = Date.now();
        const resp = await fetch(url, {
            redirect: 'follow',
            signal: AbortSignal.timeout(15000),
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 DevoraSEOCheck/1.0' },
        });
        const html = await resp.text();
        const loadMs = Date.now() - t0;
        const finalUrl = resp.url || url;
        const host = new URL(finalUrl).hostname;

        const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = titleM ? stripTags(titleM[1]) : '';
        const desc = metaContent(html, 'name', 'description');
        const kwMeta = metaContent(html, 'name', 'keywords');
        const robots = metaContent(html, 'name', 'robots');
        const viewport = /<meta[^>]+name\s*=\s*["']viewport["']/i.test(html);
        const canonicalM = html.match(/<link[^>]+rel\s*=\s*["']canonical["'][^>]*>/i);
        const canonical = canonicalM ? (canonicalM[0].match(/href\s*=\s*"([^"]*)"/i) || [])[1] || '' : '';
        const hasOg = /property\s*=\s*["']og:/i.test(html);
        const h1s = (html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || []).map(h => stripTags(h));
        const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
        const imgTags = html.match(/<img[^>]*>/gi) || [];
        const imgNoAlt = imgTags.filter(t => { const m = t.match(/alt\s*=\s*"([^"]*)"/i) || t.match(/alt\s*=\s*'([^']*)'/i); return !m || !m[1].trim(); }).length;
        const hrefs = (html.match(/<a[^>]+href\s*=\s*["'][^"']+["']/gi) || []).map(t => (t.match(/href\s*=\s*["']([^"']+)["']/i) || [])[1]).filter(Boolean);
        let internal = 0, external = 0;
        for (const h of hrefs) {
            if (h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:') || h.startsWith('javascript:')) continue;
            try { const u = new URL(h, finalUrl); if (u.hostname === host) internal++; else external++; } catch (e) { /* bo qua */ }
        }
        const text = stripTags(html);
        const words = text ? text.split(/\s+/).filter(Boolean) : [];
        const first100 = words.slice(0, 100).join(' ');
        const kwLower = keyword.toLowerCase();
        const kwCount = keyword ? countOccurrences(text, kwLower) : 0;
        const density = keyword && words.length ? (kwCount * kwLower.split(/\s+/).length / words.length * 100) : 0;

        const checks = [];
        const add = (label, status, detail, points, earned) => checks.push({ label, status, detail, points: points || 0, earned: earned || 0 });
        add('Mã trạng thái HTTP', resp.status === 200 ? 'pass' : 'fail', 'Trang trả về HTTP ' + resp.status, 6, resp.status === 200 ? 6 : 0);
        add('HTTPS', finalUrl.startsWith('https://') ? 'pass' : 'warn', finalUrl.startsWith('https://') ? 'Trang dùng HTTPS an toàn' : 'Trang chưa dùng HTTPS', 3, finalUrl.startsWith('https://') ? 3 : 0);
        add('Thẻ tiêu đề (title)', !title ? 'fail' : (title.length >= 30 && title.length <= 65 ? 'pass' : 'warn'),
            !title ? 'Trang thiếu thẻ title' : 'Title dài ' + title.length + ' ký tự (chuẩn 30–65): "' + title + '"', 10, !title ? 0 : (title.length >= 30 && title.length <= 65 ? 10 : 5));
        add('Thẻ mô tả (meta description)', !desc ? 'fail' : (desc.length >= 140 && desc.length <= 160 ? 'pass' : 'warn'),
            !desc ? 'Trang thiếu meta description' : 'Mô tả dài ' + desc.length + ' ký tự (chuẩn vàng 160 ký tự)' + (desc.length > 160 ? ' — đang thừa ' + (desc.length - 160) + ' ký tự' : ''), 12, !desc ? 0 : (desc.length >= 140 && desc.length <= 160 ? 12 : desc.length >= 100 && desc.length <= 185 ? 6 : 2));
        add('Thẻ H1', h1s.length === 1 ? 'pass' : (h1s.length === 0 ? 'fail' : 'warn'),
            h1s.length === 0 ? 'Trang không có thẻ H1' : 'Có ' + h1s.length + ' thẻ H1' + (h1s[0] ? ': "' + h1s[0].slice(0, 90) + '"' : '') + (h1s.length > 1 ? ' — nên chỉ để đúng 1 H1' : ''), 8, h1s.length === 1 ? 8 : h1s.length > 1 ? 4 : 0);
        add('Thẻ canonical', canonical ? 'pass' : 'warn', canonical ? 'Canonical: ' + canonical : 'Chưa khai báo canonical — nên thêm để tránh trùng lặp nội dung', 4, canonical ? 4 : 0);
        add('Hiển thị trên mobile (viewport)', viewport ? 'pass' : 'fail', viewport ? 'Đã có thẻ viewport' : 'Thiếu thẻ viewport — trang khó đạt chuẩn mobile', 4, viewport ? 4 : 0);
        add('Ảnh có thẻ alt', imgTags.length === 0 ? 'info' : (imgNoAlt === 0 ? 'pass' : (imgNoAlt / imgTags.length <= 0.3 ? 'warn' : 'fail')),
            imgTags.length === 0 ? 'Trang không có ảnh' : imgNoAlt === 0 ? 'Cả ' + imgTags.length + ' ảnh đều có alt' : imgNoAlt + '/' + imgTags.length + ' ảnh thiếu alt — Google không đọc được ảnh', 8, imgTags.length === 0 ? 8 : imgNoAlt === 0 ? 8 : (imgNoAlt / imgTags.length <= 0.3 ? 4 : 0));
        add('Độ dài nội dung', words.length >= 300 ? 'pass' : (words.length >= 150 ? 'warn' : 'fail'),
            'Trang có khoảng ' + words.length + ' từ' + (words.length < 300 ? ' — nội dung hơi mỏng, nên từ 300 từ trở lên' : ''), 6, words.length >= 300 ? 6 : words.length >= 150 ? 3 : 0);
        add('Link nội bộ', internal >= 3 ? 'pass' : (internal >= 1 ? 'warn' : 'fail'),
            'Có ' + internal + ' link nội bộ, ' + external + ' link ra ngoài', 4, internal >= 3 ? 4 : internal >= 1 ? 2 : 0);
        add('Tốc độ tải trang', loadMs < 2500 ? 'pass' : (loadMs < 5000 ? 'warn' : 'fail'),
            'Máy chủ phản hồi + tải xong trong ' + loadMs + 'ms', 5, loadMs < 2500 ? 5 : loadMs < 5000 ? 2 : 0);
        if (keyword) {
            const inTitle = countOccurrences(title.toLowerCase(), kwLower) > 0;
            const inDesc = countOccurrences(desc.toLowerCase(), kwLower) > 0;
            const inH1 = h1s.some(h => countOccurrences(h.toLowerCase(), kwLower) > 0);
            const inFirst = countOccurrences(first100.toLowerCase(), kwLower) > 0;
            const inUrl = decodeURIComponent(finalUrl).toLowerCase().includes(kwLower.replace(/\s+/g, '-')) || decodeURIComponent(finalUrl).toLowerCase().includes(kwLower);
            add('Từ khóa trong title', inTitle ? 'pass' : 'fail', inTitle ? 'Title chứa từ khóa "' + keyword + '"' : 'Title CHƯA chứa từ khóa "' + keyword + '" — nên đưa từ khóa lên đầu title', 8, inTitle ? 8 : 0);
            add('Từ khóa trong meta description', inDesc ? 'pass' : 'fail', inDesc ? 'Mô tả chứa từ khóa' : 'Mô tả CHƯA chứa từ khóa — nên chèn tự nhiên 1 lần', 8, inDesc ? 8 : 0);
            add('Từ khóa trong H1', inH1 ? 'pass' : 'warn', inH1 ? 'H1 chứa từ khóa' : 'H1 chưa chứa từ khóa', 6, inH1 ? 6 : 0);
            add('Từ khóa trong 100 từ đầu tiên', inFirst ? 'pass' : 'warn', inFirst ? 'Từ khóa xuất hiện ngay phần mở đầu' : 'Từ khóa chưa xuất hiện trong 100 từ đầu — nên mở đầu bài bằng từ khóa', 4, inFirst ? 4 : 0);
            add('Từ khóa trong URL', inUrl ? 'pass' : 'warn', inUrl ? 'URL chứa từ khóa' : 'URL chưa chứa từ khóa (dạng không dấu, gạch nối)', 4, inUrl ? 4 : 0);
            const dOk = density >= 0.5 && density <= 2.5;
            add('Mật độ từ khóa', kwCount === 0 ? 'fail' : (dOk ? 'pass' : 'warn'),
                kwCount === 0 ? 'Từ khóa không xuất hiện lần nào trong nội dung' : 'Từ khóa xuất hiện ' + kwCount + ' lần, mật độ ' + density.toFixed(2) + '% (chuẩn 0.5–2.5%)', 6, kwCount === 0 ? 0 : dOk ? 6 : 3);
        }
        add('Thẻ Open Graph (chia sẻ MXH)', hasOg ? 'pass' : 'warn', hasOg ? 'Đã có thẻ OG' : 'Chưa có thẻ OG — link chia sẻ Facebook/Zalo sẽ xấu', 0, 0);
        add('Meta keywords', kwMeta ? 'info' : 'info', kwMeta ? 'Có khai báo: ' + kwMeta.slice(0, 80) : 'Không khai báo (Google bỏ qua thẻ này, không ảnh hưởng điểm)', 0, 0);
        add('Cấu trúc heading', 'info', 'Trang có ' + h2Count + ' thẻ H2' + (robots ? ' · Robots: ' + robots : ''), 0, 0);

        const total = checks.reduce((s, c) => s + c.points, 0);
        const earned = checks.reduce((s, c) => s + c.earned, 0);
        const score = total ? Math.round(earned / total * 100) : 0;
        const grade = score >= 85 ? 'Tốt' : score >= 65 ? 'Khá' : score >= 45 ? 'Cần cải thiện' : 'Yếu';
        const gradeColor = score >= 85 ? '#16a34a' : score >= 65 ? '#65a30d' : score >= 45 ? '#d97706' : '#dc2626';

        return renderBack({
            url, finalUrl, keyword, score, grade, gradeColor, loadMs,
            sizeKb: Math.round(Buffer.byteLength(html, 'utf8') / 1024),
            words: words.length, title, titleLen: title.length, desc, descLen: desc.length,
            h1Count: h1s.length, imgTotal: imgTags.length, imgNoAlt, internal, external, checks,
        }, null);
    } catch (e) {
        return renderBack(null, 'Không phân tích được URL này: ' + (e.name === 'TimeoutError' ? 'trang phản hồi quá chậm (>15 giây).' : e.message));
    }
};
