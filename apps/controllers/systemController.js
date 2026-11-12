const fs = require('fs');
const path = require('path');
const AdminUserModel = require('../models/adminUserModel');
const SystemToolsModel = require('../models/systemToolsModel');

const UPLOAD_ROOT = path.join(__dirname, '../../public/uploads');
const TRASH_DIR = path.join(UPLOAD_ROOT, '.trash');
const IMG_EXT = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg', '.ico'];

function ensureTrashDir() {
    if (!fs.existsSync(TRASH_DIR)) fs.mkdirSync(TRASH_DIR, { recursive: true });
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function formatDate(d) {
    return new Date(d).toLocaleString('vi-VN', { hour12: false });
}

// Giải path tương đối trong UPLOAD_ROOT — chống path traversal tuyệt đối
function resolveInUpload(rel) {
    if (!rel || typeof rel !== 'string') return null;
    const cleaned = rel.replace(/\\/g, '/').replace(/^\/+/, '');
    if (!cleaned || cleaned.split('/').includes('..')) return null;
    const abs = path.resolve(UPLOAD_ROOT, cleaned);
    if (abs !== UPLOAD_ROOT && !abs.startsWith(UPLOAD_ROOT + path.sep)) return null;
    return { rel: cleaned, abs };
}

// ================= TÀI KHOẢN =================
exports.accountPage = async (req, res) => {
    try {
        const user = await AdminUserModel.findById(req.session.adminUser.id);
        res.render('admin/system/account', {
            layout: 'layouts/admin', title: 'Tài khoản',
            user: user || req.session.adminUser,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin?error=' + encodeURIComponent('Lỗi tải trang tài khoản'));
    }
};

exports.accountChangePassword = async (req, res) => {
    const back = (q) => res.redirect('/admin/account?' + q + '#doi-mat-khau');
    try {
        const { current_password, new_password, confirm_password } = req.body;
        if (!current_password || !new_password || !confirm_password) {
            return back('error=' + encodeURIComponent('Vui lòng nhập đầy đủ các trường mật khẩu.'));
        }
        if (new_password.length < 8) {
            return back('error=' + encodeURIComponent('Mật khẩu mới phải có ít nhất 8 ký tự.'));
        }
        if (new_password !== confirm_password) {
            return back('error=' + encodeURIComponent('Mật khẩu nhập lại không khớp.'));
        }
        const user = await AdminUserModel.findById(req.session.adminUser.id);
        if (!user) return back('error=' + encodeURIComponent('Không tìm thấy tài khoản.'));
        const match = await AdminUserModel.verifyPassword(current_password, user.password);
        if (!match) {
            return back('error=' + encodeURIComponent('Mật khẩu hiện tại không đúng.'));
        }
        const hash = await AdminUserModel.hashPassword(new_password);
        await AdminUserModel.updatePassword(user.id, hash);
        return back('success=' + encodeURIComponent('Đổi mật khẩu thành công.'));
    } catch (err) {
        console.error(err);
        return back('error=' + encodeURIComponent('Lỗi đổi mật khẩu, vui lòng thử lại.'));
    }
};

// ================= QUẢN LÝ FILE =================
function walkUploads(dir, baseRel, groups) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
        .sort((a, b) => a.name.localeCompare(b.name));
    for (const e of entries) {
        if (e.name === '.trash') continue;
        const rel = baseRel ? baseRel + '/' + e.name : e.name;
        const abs = path.join(dir, e.name);
        if (e.isDirectory()) {
            walkUploads(abs, rel, groups);
        } else if (e.isFile()) {
            const st = fs.statSync(abs);
            const groupKey = baseRel.split('/')[0] || '';
            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push({
                name: e.name,
                rel,
                size: st.size,
                size_str: formatSize(st.size),
                mtime_str: formatDate(st.mtime),
                isImage: IMG_EXT.includes(path.extname(e.name).toLowerCase()),
                url: '/uploads/' + rel.split('/').map(encodeURIComponent).join('/')
            });
        }
    }
}

exports.filesPage = (req, res) => {
    try {
        const groups = {};
        walkUploads(UPLOAD_ROOT, '', groups);
        const subdirs = fs.readdirSync(UPLOAD_ROOT, { withFileTypes: true })
            .filter(d => d.isDirectory() && d.name !== '.trash')
            .map(d => d.name).sort();
        const total = Object.values(groups).reduce((s, g) => s + g.length, 0);
        res.render('admin/system/files', {
            layout: 'layouts/admin', title: 'Quản lý file, hình ảnh',
            groups, subdirs, total,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin?error=' + encodeURIComponent('Lỗi tải danh sách file'));
    }
};

exports.filesUpload = (req, res) => {
    if (!req.file) {
        return res.redirect('/admin/files?error=' + encodeURIComponent('Chưa chọn file hoặc loại file không được hỗ trợ.'));
    }
    const sub = (req.body.sub || '').replace(/[^a-zA-Z0-9_-]/g, '');
    const rel = (sub ? sub + '/' : '') + req.file.filename;
    res.redirect('/admin/files?success=' + encodeURIComponent('Đã tải lên file: ' + rel));
};

exports.filesDelete = async (req, res) => {
    try {
        const resolved = resolveInUpload(req.body.path);
        if (!resolved || resolved.rel.startsWith('.trash/')) {
            return res.redirect('/admin/files?error=' + encodeURIComponent('Đường dẫn file không hợp lệ.'));
        }
        if (!fs.existsSync(resolved.abs) || !fs.statSync(resolved.abs).isFile()) {
            return res.redirect('/admin/files?error=' + encodeURIComponent('File không tồn tại.'));
        }
        ensureTrashDir();
        let trashName = Date.now() + '_' + path.basename(resolved.abs);
        while (fs.existsSync(path.join(TRASH_DIR, trashName))) trashName = Date.now() + '_' + trashName;
        fs.renameSync(resolved.abs, path.join(TRASH_DIR, trashName));
        await SystemToolsModel.trashAdd({
            item_type: 'file',
            item_id: null,
            title: resolved.rel,
            payload: { rel: resolved.rel, trashName },
            deleted_by: req.session.adminUser.username
        });
        res.redirect('/admin/files?success=' + encodeURIComponent('Đã chuyển file vào thùng rác: ' + resolved.rel));
    } catch (err) {
        console.error(err);
        res.redirect('/admin/files?error=' + encodeURIComponent('Lỗi xóa file.'));
    }
};

// ================= XÓA CACHE =================
exports.clearCache = (req, res) => {
    try {
        const ejs = require('ejs');
        if (typeof ejs.clearCache === 'function') ejs.clearCache();
    } catch (e) { /* ejs cache không có cũng không sao */ }
    try {
        if (req.app && req.app.cache) {
            Object.keys(req.app.cache).forEach(k => { delete req.app.cache[k]; });
        }
    } catch (e) { /* bỏ qua */ }
    const wantsJson = req.xhr || (req.headers.accept || '').includes('application/json') || req.headers['x-requested-with'] === 'XMLHttpRequest';
    if (wantsJson) return res.json({ success: true, message: 'Đã xóa files cache' });
    const back = req.headers.referer || '/admin';
    return res.redirect(back + (back.includes('?') ? '&' : '?') + 'success=' + encodeURIComponent('Đã xóa files cache'));
};

// ================= THÙNG RÁC =================
const TYPE_LABELS = { blog_post: 'Tin tức', client: 'Khách hàng', file: 'File' };
const BLOG_COLS = ['id', 'title', 'slug', 'description', 'content', 'thumbnail', 'is_featured', 'is_active', 'display_order', 'seo_title', 'seo_keywords', 'seo_description', 'seo_keyword_main', 'views', 'created_at'];
const CLIENT_COLS = ['id', 'full_name', 'position', 'company', 'avatar', 'testimonial', 'rating', 'website', 'display_order', 'is_active', 'created_at'];

exports.trashPage = async (req, res) => {
    try {
        const items = await SystemToolsModel.trashGetAll();
        items.forEach(it => {
            it.type_label = TYPE_LABELS[it.item_type] || it.item_type;
            it.deleted_str = formatDate(it.deleted_at);
        });
        res.render('admin/system/trash', {
            layout: 'layouts/admin', title: 'Thùng rác',
            items,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin?error=' + encodeURIComponent('Lỗi tải thùng rác'));
    }
};

exports.trashRestore = async (req, res) => {
    const back = (q) => res.redirect('/admin/trash?' + q);
    try {
        const item = await SystemToolsModel.trashGetById(req.params.id);
        if (!item) return back('error=' + encodeURIComponent('Mục không tồn tại trong thùng rác.'));
        const payload = SystemToolsModel.parsePayload(item);

        if (item.item_type === 'file') {
            if (!payload || !payload.rel || !payload.trashName) {
                return back('error=' + encodeURIComponent('Dữ liệu file trong thùng rác không hợp lệ.'));
            }
            const src = path.join(TRASH_DIR, path.basename(payload.trashName));
            const dest = resolveInUpload(payload.rel);
            if (!dest) return back('error=' + encodeURIComponent('Đường dẫn khôi phục không hợp lệ.'));
            if (!fs.existsSync(src)) return back('error=' + encodeURIComponent('File vật lý trong thùng rác đã mất.'));
            if (fs.existsSync(dest.abs)) return back('error=' + encodeURIComponent('File đích đã tồn tại: ' + payload.rel));
            fs.mkdirSync(path.dirname(dest.abs), { recursive: true });
            fs.renameSync(src, dest.abs);
            await SystemToolsModel.trashRemove(item.id);
            return back('success=' + encodeURIComponent('Đã khôi phục file: ' + payload.rel));
        }

        if (item.item_type === 'blog_post' || item.item_type === 'client') {
            if (!payload) return back('error=' + encodeURIComponent('Dữ liệu bản ghi không hợp lệ.'));
            const table = item.item_type === 'blog_post' ? 'blog_posts' : 'clients';
            const cols = item.item_type === 'blog_post' ? BLOG_COLS : CLIENT_COLS;
            await SystemToolsModel.restoreRow(table, payload, cols);
            await SystemToolsModel.trashRemove(item.id);
            return back('success=' + encodeURIComponent('Đã khôi phục: ' + (item.title || table)));
        }

        return back('error=' + encodeURIComponent('Loại mục không hỗ trợ khôi phục.'));
    } catch (err) {
        console.error(err);
        return back('error=' + encodeURIComponent('Lỗi khôi phục (có thể trùng ID/slug với bản ghi hiện có): ' + err.message));
    }
};

exports.trashPurge = async (req, res) => {
    const back = (q) => res.redirect('/admin/trash?' + q);
    try {
        const item = await SystemToolsModel.trashGetById(req.params.id);
        if (!item) return back('error=' + encodeURIComponent('Mục không tồn tại trong thùng rác.'));
        const payload = SystemToolsModel.parsePayload(item);

        if (item.item_type === 'file' && payload && payload.trashName) {
            const f = path.join(TRASH_DIR, path.basename(payload.trashName));
            if (fs.existsSync(f)) fs.unlinkSync(f);
        }
        // Xóa vĩnh viễn bài viết/khách hàng: dọn luôn file ảnh đi kèm còn nằm trong uploads
        if (payload && (item.item_type === 'blog_post' || item.item_type === 'client')) {
            const imgPath = item.item_type === 'blog_post' ? payload.thumbnail : payload.avatar;
            if (imgPath && imgPath.startsWith('/uploads/')) {
                const resolved = resolveInUpload(imgPath.replace('/uploads/', ''));
                if (resolved && fs.existsSync(resolved.abs)) fs.unlinkSync(resolved.abs);
            }
        }
        await SystemToolsModel.trashRemove(item.id);
        return back('success=' + encodeURIComponent('Đã xóa vĩnh viễn: ' + (item.title || item.item_type)));
    } catch (err) {
        console.error(err);
        return back('error=' + encodeURIComponent('Lỗi xóa vĩnh viễn.'));
    }
};

// ================= LỊCH SỬ =================
exports.historyPage = async (req, res) => {
    try {
        const logs = await SystemToolsModel.logGetLatest(200);
        logs.forEach(l => { l.time_str = formatDate(l.created_at); });
        res.render('admin/system/history', {
            layout: 'layouts/admin', title: 'Lịch sử thao tác',
            logs,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin?error=' + encodeURIComponent('Lỗi tải lịch sử thao tác'));
    }
};
