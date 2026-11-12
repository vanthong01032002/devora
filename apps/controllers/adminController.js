const SlideshowModel = require('../models/slideshowModel');
const PricingModel   = require('../models/pricingModel');
const { VisitorModel } = require('../models/visitorModel');
const path = require('path');
const fs = require('fs');

exports.dashboard = async (req, res) => {
    try {
        const [topIPs, browsers, devices, totalToday, totalMonth, unreadMessages] = await Promise.all([
            VisitorModel.getTopIPs(10),
            VisitorModel.getBrowserStats(),
            VisitorModel.getDeviceStats(),
            VisitorModel.getTotalToday(),
            VisitorModel.getTotalMonth(),
            require('../models/contactModel').getMessages().then(msgs => msgs.filter(m => !m.is_read).length).catch(() => 0)
        ]);
        res.render('admin/dashboard', {
            layout: 'layouts/admin',
            title: 'Dashboard',
            topIPs, browsers, devices, totalToday, totalMonth, unreadMessages
        });
    } catch (err) {
        console.error(err);
        res.render('admin/dashboard', {
            layout: 'layouts/admin', title: 'Dashboard',
            topIPs: [], browsers: [], devices: [], totalToday: 0, totalMonth: 0, unreadMessages: 0
        });
    }
};

// ===== SLIDESHOW =====

exports.slideshowIndex = async (req, res) => {
    try {
        const slides = await SlideshowModel.getAll();
        res.render('admin/slideshow/index', {
            layout: 'layouts/admin',
            title: 'Quản lý Slideshow',
            slides,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin?error=Lỗi tải slideshow');
    }
};

exports.slideshowCreate = (req, res) => {
    res.render('admin/slideshow/form', {
        layout: 'layouts/admin',
        title: 'Thêm Slide',
        slide: null,
        action: '/admin/media/slideshow/store'
    });
};

exports.slideshowStore = async (req, res) => {
    try {
        const { title, link, display_order, is_active } = req.body;
        const image_path = req.file ? '/uploads/slideshow/' + req.file.filename : '';

        if (!image_path) {
            return res.redirect('/admin/media/slideshow/create?error=Vui lòng chọn ảnh');
        }

        await SlideshowModel.create({
            title: title || 'Slide mới',
            image_path,
            link: link || '#',
            display_order: parseInt(display_order) || 0,
            is_active: is_active === '1' ? 1 : 0
        });

        res.redirect('/admin/media/slideshow?success=Thêm slide thành công');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/media/slideshow?error=Lỗi thêm slide');
    }
};

exports.slideshowEdit = async (req, res) => {
    try {
        const slide = await SlideshowModel.getById(req.params.id);
        if (!slide) return res.redirect('/admin/media/slideshow?error=Không tìm thấy slide');

        res.render('admin/slideshow/form', {
            layout: 'layouts/admin',
            title: 'Sửa Slide',
            slide,
            action: '/admin/media/slideshow/update/' + slide.id
        });
    } catch (err) {
        res.redirect('/admin/media/slideshow?error=Lỗi tải slide');
    }
};

exports.slideshowUpdate = async (req, res) => {
    try {
        const { title, link, display_order, is_active } = req.body;
        const slide = await SlideshowModel.getById(req.params.id);
        if (!slide) return res.redirect('/admin/media/slideshow?error=Không tìm thấy slide');

        let image_path = slide.image_path;

        // Nếu có ảnh mới upload
        if (req.file) {
            // Xóa ảnh cũ nếu không phải ảnh mặc định
            if (slide.image_path && slide.image_path.startsWith('/uploads/')) {
                const oldPath = path.join(__dirname, '../../public', slide.image_path);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            image_path = '/uploads/slideshow/' + req.file.filename;
        }

        await SlideshowModel.update(req.params.id, {
            title: title || slide.title,
            image_path,
            link: link || '#',
            display_order: parseInt(display_order) || 0,
            is_active: is_active === '1' ? 1 : 0
        });

        res.redirect('/admin/media/slideshow?success=Cập nhật slide thành công');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/media/slideshow?error=Lỗi cập nhật slide');
    }
};

exports.slideshowDelete = async (req, res) => {
    try {
        const slide = await SlideshowModel.getById(req.params.id);
        if (slide && slide.image_path && slide.image_path.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '../../public', slide.image_path);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await SlideshowModel.delete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

exports.slideshowToggle = async (req, res) => {
    try {
        const { is_active } = req.body;
        await SlideshowModel.toggleActive(req.params.id, is_active);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

exports.slideshowDeleteAll = async (req, res) => {
    try {
        const slides = await SlideshowModel.getAll();
        for (const slide of slides) {
            if (slide.image_path && slide.image_path.startsWith('/uploads/')) {
                const filePath = path.join(__dirname, '../../public', slide.image_path);
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        }
        const db = require('../../config/db');
        await new Promise((resolve, reject) => {
            db.query('DELETE FROM slideshow', (err) => err ? reject(err) : resolve());
        });
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// ===== BẢNG GIÁ DỊCH VỤ =====

exports.pricingIndex = async (req, res) => {
    try {
        const packages = await PricingModel.getAll();
        res.render('admin/pricing/index', {
            layout: 'layouts/admin',
            title: 'Quản lý Bảng giá',
            packages,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin?error=Lỗi tải bảng giá');
    }
};

exports.pricingCreate = (req, res) => {
    res.render('admin/pricing/form', {
        layout: 'layouts/admin',
        title: 'Thêm gói dịch vụ',
        pkg: null,
        action: '/admin/media/pricing/store'
    });
};

exports.pricingStore = async (req, res) => {
    try {
        const { name, description, price, unit, features_raw, badge, is_featured, display_order, is_active } = req.body;
        const features = (features_raw || '').split('\n').map(f => f.trim()).filter(Boolean);
        await PricingModel.create({
            name, description, price: parseFloat(price) || 0,
            unit: unit || 'gói', features, badge: badge || null,
            is_featured: is_featured === '1' ? 1 : 0,
            display_order: parseInt(display_order) || 0,
            is_active: is_active === '1' ? 1 : 0
        });
        res.redirect('/admin/media/pricing?success=Thêm gói thành công');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/media/pricing?error=Lỗi thêm gói');
    }
};

exports.pricingEdit = async (req, res) => {
    try {
        const pkg = await PricingModel.getById(req.params.id);
        if (!pkg) return res.redirect('/admin/media/pricing?error=Không tìm thấy gói');
        res.render('admin/pricing/form', {
            layout: 'layouts/admin',
            title: 'Sửa gói dịch vụ',
            pkg,
            action: '/admin/media/pricing/update/' + pkg.id
        });
    } catch (err) {
        res.redirect('/admin/media/pricing?error=Lỗi tải gói');
    }
};

exports.pricingUpdate = async (req, res) => {
    try {
        const { name, description, price, unit, features_raw, badge, is_featured, display_order, is_active } = req.body;
        const features = (features_raw || '').split('\n').map(f => f.trim()).filter(Boolean);
        await PricingModel.update(req.params.id, {
            name, description, price: parseFloat(price) || 0,
            unit: unit || 'gói', features, badge: badge || null,
            is_featured: is_featured === '1' ? 1 : 0,
            display_order: parseInt(display_order) || 0,
            is_active: is_active === '1' ? 1 : 0
        });
        res.redirect('/admin/media/pricing?success=Cập nhật gói thành công');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/media/pricing?error=Lỗi cập nhật gói');
    }
};

exports.pricingDelete = async (req, res) => {
    try {
        await PricingModel.delete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

exports.pricingToggle = async (req, res) => {
    try {
        await PricingModel.toggleActive(req.params.id, req.body.is_active);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

// ===== DỊCH VỤ =====
const ServicesModel = require('../models/servicesModel');
const path2 = require('path');
const fs2   = require('fs');

exports.servicesIndex = async (req, res) => {
    try {
        const services = await ServicesModel.getAll();
        res.render('admin/services/index', {
            layout: 'layouts/admin', title: 'Quản lý Dịch vụ',
            services, success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải dịch vụ'); }
};

exports.servicesCreate = (req, res) => {
    res.render('admin/services/form', {
        layout: 'layouts/admin', title: 'Thêm dịch vụ', sv: null, action: '/admin/content/services/store'
    });
};

exports.servicesStore = async (req, res) => {
    try {
        const { title, description, tags, icon_color, display_order, is_active } = req.body;
        const image_path = req.file ? '/uploads/services/' + req.file.filename : '/images/default.png';
        await ServicesModel.create({ title, description, tags, image_path, icon_color: icon_color || 'blue', display_order: parseInt(display_order) || 0, is_active: is_active === '1' ? 1 : 0 });
        res.redirect('/admin/content/services?success=Thêm dịch vụ thành công');
    } catch (err) { res.redirect('/admin/content/services?error=Lỗi thêm dịch vụ'); }
};

exports.servicesEdit = async (req, res) => {
    try {
        const sv = await ServicesModel.getById(req.params.id);
        if (!sv) return res.redirect('/admin/content/services?error=Không tìm thấy');
        res.render('admin/services/form', {
            layout: 'layouts/admin', title: 'Sửa dịch vụ', sv, action: '/admin/content/services/update/' + sv.id
        });
    } catch (err) { res.redirect('/admin/content/services?error=Lỗi tải dịch vụ'); }
};

exports.servicesUpdate = async (req, res) => {
    try {
        const { title, description, tags, icon_color, display_order, is_active } = req.body;
        const sv = await ServicesModel.getById(req.params.id);
        if (!sv) return res.redirect('/admin/content/services?error=Không tìm thấy');
        let image_path = sv.image_path;
        if (req.file) {
            if (image_path && image_path.startsWith('/uploads/')) {
                const old = path2.join(__dirname, '../../public', image_path);
                if (fs2.existsSync(old)) fs2.unlinkSync(old);
            }
            image_path = '/uploads/services/' + req.file.filename;
        }
        await ServicesModel.update(req.params.id, { title, description, tags, image_path, icon_color: icon_color || 'blue', display_order: parseInt(display_order) || 0, is_active: is_active === '1' ? 1 : 0 });
        res.redirect('/admin/content/services?success=Cập nhật thành công');
    } catch (err) { res.redirect('/admin/content/services?error=Lỗi cập nhật'); }
};

exports.servicesDelete = async (req, res) => {
    try {
        const sv = await ServicesModel.getById(req.params.id);
        if (sv && sv.image_path && sv.image_path.startsWith('/uploads/')) {
            const f = path2.join(__dirname, '../../public', sv.image_path);
            if (fs2.existsSync(f)) fs2.unlinkSync(f);
        }
        await ServicesModel.delete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.json({ success: false, message: err.message }); }
};

exports.servicesToggle = async (req, res) => {
    try {
        await ServicesModel.toggleActive(req.params.id, req.body.is_active);
        res.json({ success: true });
    } catch (err) { res.json({ success: false, message: err.message }); }
};

// ===== MẠNG XÃ HỘI / NÚT GỌI =====
const SocialModel = require('../models/socialModel');
const pathSoc = require('path');
const fsSoc   = require('fs');

exports.socialIndex = async (req, res) => {
    try {
        const buttons = await SocialModel.getAll();
        res.render('admin/social/index', {
            layout: 'layouts/admin', title: 'Quản lý Mạng xã hội',
            buttons, success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải mạng xã hội'); }
};

exports.socialCreate = (req, res) => {
    res.render('admin/social/form', {
        layout: 'layouts/admin', title: 'Thêm nút', btn: null, action: '/admin/media/social/store'
    });
};

exports.socialStore = async (req, res) => {
    try {
        const { title, link, bg_color, display_order, is_active } = req.body;
        const image_path = req.file ? '/uploads/social/' + req.file.filename : null;
        await SocialModel.create({
            title, link, image_path, bg_color: bg_color || '#1565c0',
            display_order: parseInt(display_order) || 0,
            is_active: is_active === '1' ? 1 : 0
        });
        res.redirect('/admin/media/social?success=Thêm nút thành công');
    } catch (err) { res.redirect('/admin/media/social?error=Lỗi thêm nút'); }
};

exports.socialEdit = async (req, res) => {
    try {
        const btn = await SocialModel.getById(req.params.id);
        if (!btn) return res.redirect('/admin/media/social?error=Không tìm thấy');
        res.render('admin/social/form', {
            layout: 'layouts/admin', title: 'Sửa nút', btn, action: '/admin/media/social/update/' + btn.id
        });
    } catch (err) { res.redirect('/admin/media/social?error=Lỗi tải nút'); }
};

exports.socialUpdate = async (req, res) => {
    try {
        const { title, link, bg_color, display_order, is_active } = req.body;
        const btn = await SocialModel.getById(req.params.id);
        if (!btn) return res.redirect('/admin/media/social?error=Không tìm thấy');
        let image_path = btn.image_path;
        if (req.file) {
            if (image_path && image_path.startsWith('/uploads/')) {
                const old = pathSoc.join(__dirname, '../../public', image_path);
                if (fsSoc.existsSync(old)) fsSoc.unlinkSync(old);
            }
            image_path = '/uploads/social/' + req.file.filename;
        }
        await SocialModel.update(req.params.id, {
            title, link, image_path, bg_color: bg_color || '#1565c0',
            display_order: parseInt(display_order) || 0,
            is_active: is_active === '1' ? 1 : 0
        });
        res.redirect('/admin/media/social?success=Cập nhật thành công');
    } catch (err) { res.redirect('/admin/media/social?error=Lỗi cập nhật'); }
};

exports.socialDelete = async (req, res) => {
    try {
        const btn = await SocialModel.getById(req.params.id);
        if (btn && btn.image_path && btn.image_path.startsWith('/uploads/')) {
            const f = pathSoc.join(__dirname, '../../public', btn.image_path);
            if (fsSoc.existsSync(f)) fsSoc.unlinkSync(f);
        }
        await SocialModel.delete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.json({ success: false, message: err.message }); }
};

exports.socialToggle = async (req, res) => {
    try {
        await SocialModel.toggleActive(req.params.id, req.body.is_active);
        res.json({ success: true });
    } catch (err) { res.json({ success: false, message: err.message }); }
};

exports.socialDeleteAll = async (req, res) => {
    try {
        await SocialModel.deleteAll();
        res.json({ success: true });
    } catch (err) { res.json({ success: false, message: err.message }); }
};

// ===== MẠNG XÃ HỘI FOOTER =====
const SocialFooterModel = require('../models/socialFooterModel');

exports.socialFooterIndex = async (req, res) => {
    try {
        const items = await SocialFooterModel.getAll();
        res.render('admin/social-footer/index', {
            layout: 'layouts/admin', title: 'Mạng xã hội - Footer',
            items, success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải social footer'); }
};

exports.socialFooterCreate = (req, res) => {
    res.render('admin/social-footer/form', {
        layout: 'layouts/admin', title: 'Thêm mạng xã hội', item: null,
        action: '/admin/media/social-footer/store'
    });
};

exports.socialFooterStore = async (req, res) => {
    try {
        const { title, link, icon_type, display_order, is_active } = req.body;
        await SocialFooterModel.create({
            title, link, icon_type: icon_type || 'custom',
            display_order: parseInt(display_order) || 0,
            is_active: is_active === '1' ? 1 : 0
        });
        res.redirect('/admin/media/social-footer?success=Thêm thành công');
    } catch (err) { res.redirect('/admin/media/social-footer?error=Lỗi thêm'); }
};

exports.socialFooterEdit = async (req, res) => {
    try {
        const item = await SocialFooterModel.getById(req.params.id);
        if (!item) return res.redirect('/admin/media/social-footer?error=Không tìm thấy');
        res.render('admin/social-footer/form', {
            layout: 'layouts/admin', title: 'Sửa mạng xã hội', item,
            action: '/admin/media/social-footer/update/' + item.id
        });
    } catch (err) { res.redirect('/admin/media/social-footer?error=Lỗi tải'); }
};

exports.socialFooterUpdate = async (req, res) => {
    try {
        const { title, link, icon_type, display_order, is_active } = req.body;
        await SocialFooterModel.update(req.params.id, {
            title, link, icon_type: icon_type || 'custom',
            display_order: parseInt(display_order) || 0,
            is_active: is_active === '1' ? 1 : 0
        });
        res.redirect('/admin/media/social-footer?success=Cập nhật thành công');
    } catch (err) { res.redirect('/admin/media/social-footer?error=Lỗi cập nhật'); }
};

exports.socialFooterDelete = async (req, res) => {
    try {
        await SocialFooterModel.delete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.json({ success: false, message: err.message }); }
};

exports.socialFooterToggle = async (req, res) => {
    try {
        await SocialFooterModel.toggleActive(req.params.id, req.body.is_active);
        res.json({ success: true });
    } catch (err) { res.json({ success: false, message: err.message }); }
};

exports.socialFooterDeleteAll = async (req, res) => {
    try {
        await SocialFooterModel.deleteAll();
        res.json({ success: true });
    } catch (err) { res.json({ success: false, message: err.message }); }
};

// ===== THIẾT LẬP THÔNG TIN =====
const SettingsModel = require('../models/settingsModel');

exports.settingsIndex = async (req, res) => {
    try {
        const settings = await SettingsModel.getAll();
        res.render('admin/settings/index', {
            layout: 'layouts/admin',
            title: 'Thiết lập thông tin',
            settings,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin?error=Lỗi tải cài đặt');
    }
};

exports.settingsSave = async (req, res) => {
    try {
        const allowed = [
            'site_name','site_title','address','phone','phone2',
            'hotline','hotline2','email','website','zalo',
            'fanpage','google_maps','working_hours','copyright','fanpage_embed','map_embed',
            'google_analytics','google_webmaster','head_js','body_js'
        ];
        const data = {};
        allowed.forEach(k => { if (req.body[k] !== undefined) data[k] = req.body[k]; });
        await SettingsModel.saveAll(data);
        res.redirect('/admin/settings?success=Lưu thông tin thành công');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/settings?error=Lỗi lưu thông tin');
    }
};

// ===== LOGO & FAVICON =====

exports.logoIndex = async (req, res) => {
    try {
        const settings = await SettingsModel.getAll();
        res.render('admin/media/logo', {
            layout: 'layouts/admin', title: 'Quản lý Logo',
            logo: settings.logo_path || '/images/logodavora.png',
            success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải logo'); }
};

exports.logoUpload = async (req, res) => {
    try {
        if (!req.file) return res.redirect('/admin/media/logo?error=Vui lòng chọn file');
        const logo_path = '/uploads/media/' + req.file.filename;
        await SettingsModel.saveAll({ logo_path });
        res.redirect('/admin/media/logo?success=Cập nhật logo thành công');
    } catch (err) { res.redirect('/admin/media/logo?error=Lỗi upload logo'); }
};

exports.faviconIndex = async (req, res) => {
    try {
        const settings = await SettingsModel.getAll();
        res.render('admin/media/favicon', {
            layout: 'layouts/admin', title: 'Quản lý Favicon',
            favicon: settings.favicon_path || '/images/favicon.ico',
            success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải favicon'); }
};

exports.faviconUpload = async (req, res) => {
    try {
        if (!req.file) return res.redirect('/admin/media/favicon?error=Vui lòng chọn file');
        const favicon_path = '/uploads/media/' + req.file.filename;
        await SettingsModel.saveAll({ favicon_path });
        res.redirect('/admin/media/favicon?success=Cập nhật favicon thành công');
    } catch (err) { res.redirect('/admin/media/favicon?error=Lỗi upload favicon'); }
};

// ===== BLOG / TIN TỨC =====
const BlogModel = require('../models/blogModel');
const pathBlog  = require('path');
const fsBlog    = require('fs');

function toSlug(str) {
    return str.toLowerCase()
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g,'a')
        .replace(/[èéẹẻẽêềếệểễ]/g,'e')
        .replace(/[ìíịỉĩ]/g,'i')
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g,'o')
        .replace(/[ùúụủũưừứựửữ]/g,'u')
        .replace(/[ỳýỵỷỹ]/g,'y')
        .replace(/đ/g,'d')
        .replace(/[^a-z0-9\s-]/g,'')
        .trim().replace(/\s+/g,'-').replace(/-+/g,'-');
}

exports.blogIndex = async (req, res) => {
    try {
        const posts = await BlogModel.getAll();
        res.render('admin/blog/index', {
            layout: 'layouts/admin', title: 'Quản lý Tin tức',
            posts, success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải bài viết'); }
};

exports.blogCreate = (req, res) => {
    res.render('admin/blog/form', {
        layout: 'layouts/admin', title: 'Thêm bài viết',
        post: null, action: '/admin/content/news/store'
    });
};

exports.blogStore = async (req, res) => {
    try {
        const { title, slug, description, content, is_featured, is_active, display_order,
                seo_title, seo_keywords, seo_description, seo_keyword_main } = req.body;

        let finalSlug = slug ? toSlug(slug) : toSlug(title);
        const exists = await BlogModel.slugExists(finalSlug);
        if (exists) finalSlug = finalSlug + '-' + Date.now();

        const thumbnail = req.file ? '/uploads/blog/' + req.file.filename : null;

        await BlogModel.create({
            title, slug: finalSlug, description, content, thumbnail,
            is_featured: is_featured === '1' ? 1 : 0,
            is_active: is_active === '1' ? 1 : 0,
            display_order: parseInt(display_order) || 0,
            seo_title: seo_title || null, seo_keywords: seo_keywords || null,
            seo_description: seo_description || null, seo_keyword_main: seo_keyword_main || null
        });
        res.redirect('/admin/content/news?success=Thêm bài viết thành công');
    } catch (err) { console.error(err); res.redirect('/admin/content/news?error=Lỗi thêm bài viết'); }
};

exports.blogEdit = async (req, res) => {
    try {
        const post = await BlogModel.getById(req.params.id);
        if (!post) return res.redirect('/admin/content/news?error=Không tìm thấy bài viết');
        res.render('admin/blog/form', {
            layout: 'layouts/admin', title: 'Sửa bài viết',
            post, action: '/admin/content/news/update/' + post.id
        });
    } catch (err) { res.redirect('/admin/content/news?error=Lỗi tải bài viết'); }
};

exports.blogUpdate = async (req, res) => {
    try {
        const post = await BlogModel.getById(req.params.id);
        if (!post) return res.redirect('/admin/content/news?error=Không tìm thấy');

        const { title, slug, description, content, is_featured, is_active, display_order,
                seo_title, seo_keywords, seo_description, seo_keyword_main } = req.body;

        let finalSlug = slug ? toSlug(slug) : toSlug(title);
        const exists = await BlogModel.slugExists(finalSlug, req.params.id);
        if (exists) finalSlug = finalSlug + '-' + Date.now();

        let thumbnail = post.thumbnail;
        if (req.file) {
            if (thumbnail && thumbnail.startsWith('/uploads/')) {
                const old = pathBlog.join(__dirname, '../../public', thumbnail);
                if (fsBlog.existsSync(old)) fsBlog.unlinkSync(old);
            }
            thumbnail = '/uploads/blog/' + req.file.filename;
        }

        await BlogModel.update(req.params.id, {
            title, slug: finalSlug, description, content, thumbnail,
            is_featured: is_featured === '1' ? 1 : 0,
            is_active: is_active === '1' ? 1 : 0,
            display_order: parseInt(display_order) || 0,
            seo_title: seo_title || null, seo_keywords: seo_keywords || null,
            seo_description: seo_description || null, seo_keyword_main: seo_keyword_main || null
        });
        res.redirect('/admin/content/news?success=Cập nhật thành công');
    } catch (err) { console.error(err); res.redirect('/admin/content/news?error=Lỗi cập nhật'); }
};

exports.blogDelete = async (req, res) => {
    try {
        const post = await BlogModel.getById(req.params.id);
        if (post) {
            // Sao chép vào thùng rác trước khi xóa (giữ file ảnh để khôi phục được trọn vẹn)
            try {
                await require('../models/systemToolsModel').trashAdd({
                    item_type: 'blog_post', item_id: post.id, title: post.title,
                    payload: post, deleted_by: req.session.adminUser ? req.session.adminUser.username : null
                });
            } catch (e) { console.error('Trash blog:', e.message); }
        }
        await BlogModel.delete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.json({ success: false, message: err.message }); }
};

exports.blogToggleActive   = async (req, res) => { try { await BlogModel.toggleActive(req.params.id, req.body.is_active); res.json({ success: true }); } catch (err) { res.json({ success: false }); } };
exports.blogToggleFeatured = async (req, res) => { try { await BlogModel.toggleFeatured(req.params.id, req.body.is_featured); res.json({ success: true }); } catch (err) { res.json({ success: false }); } };

exports.blogSlugCheck = async (req, res) => {
    try {
        const exists = await BlogModel.slugExists(req.query.slug, req.query.exclude || null);
        res.json({ exists });
    } catch { res.json({ exists: false }); }
};

// ===== TRANG LIÊN HỆ =====
const ContactModel = require('../models/contactModel');
const pathContact  = require('path');
const fsContact    = require('fs');

exports.contactPageIndex = async (req, res) => {
    try {
        const page = await ContactModel.getPage();
        res.render('admin/contact/index', {
            layout: 'layouts/admin', title: 'Quản lý trang Liên hệ',
            page, success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải trang liên hệ'); }
};

exports.contactPageSave = async (req, res) => {
    try {
        const { title, description } = req.body;
        const current = await ContactModel.getPage();
        let image_path = current.image_path || null;
        if (req.file) {
            if (image_path && image_path.startsWith('/uploads/')) {
                const old = pathContact.join(__dirname, '../../public', image_path);
                if (fsContact.existsSync(old)) fsContact.unlinkSync(old);
            }
            image_path = '/uploads/contact/' + req.file.filename;
        }
        await ContactModel.updatePage({ title, description, image_path });
        res.redirect('/admin/pages/contact?success=Cập nhật thành công');
    } catch (err) { res.redirect('/admin/pages/contact?error=Lỗi lưu'); }
};

exports.contactMessages = async (req, res) => {
    try {
        const messages = await ContactModel.getMessages();
        res.render('admin/contact/messages', {
            layout: 'layouts/admin', title: 'Tin nhắn liên hệ',
            messages, success: req.query.success || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải tin nhắn'); }
};

exports.contactMessageDelete = async (req, res) => {
    try {
        await ContactModel.deleteMessage(req.params.id);
        res.json({ success: true });
    } catch (err) { res.json({ success: false }); }
};

// ===== SEO PAGES =====
const SeoModel = require('../models/seoModel');
const pathSeo  = require('path');
const fsSeo    = require('fs');

const SEO_PAGES = {
    home:     { label: 'Trang chủ',  route: '/' },
    services: { label: 'Dịch vụ',    route: '/dich-vu' },
    news:     { label: 'Tin tức',     route: '/blog' }
};

exports.seoPageIndex = async (req, res) => {
    const key = req.params.key;
    if (!SEO_PAGES[key]) return res.redirect('/admin?error=Trang không tồn tại');
    try {
        const seo = await SeoModel.getByKey(key);
        res.render('admin/seo/index', {
            layout: 'layouts/admin',
            title: 'SEO - ' + SEO_PAGES[key].label,
            seo, key, pageInfo: SEO_PAGES[key],
            success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải SEO'); }
};

exports.seoPageSave = async (req, res) => {
    const key = req.params.key;
    if (!SEO_PAGES[key]) return res.redirect('/admin');
    try {
        const { title, keywords, description } = req.body;
        const current = await SeoModel.getByKey(key);
        let og_image = current.og_image || null;
        if (req.file) {
            if (og_image && og_image.startsWith('/uploads/')) {
                const old = pathSeo.join(__dirname, '../../public', og_image);
                if (fsSeo.existsSync(old)) fsSeo.unlinkSync(old);
            }
            og_image = '/uploads/seo/' + req.file.filename;
        }
        await SeoModel.save(key, { title, keywords, description, og_image });
        res.redirect('/admin/seo-pages/' + key + '?success=Lưu SEO thành công');
    } catch (err) { res.redirect('/admin/seo-pages/' + key + '?error=Lỗi lưu SEO'); }
};

// ===== QUY TRÌNH =====
const ProcessModel = require('../models/processModel');
const pathProc = require('path');
const fsProc   = require('fs');

const CUBE_COLORS = ['blue','purple','red','indigo','teal','orange','pink','green'];

exports.processIndex = async (req, res) => {
    try {
        const steps = await ProcessModel.getAll();
        res.render('admin/process/index', {
            layout: 'layouts/admin', title: 'Quản lý Quy trình',
            steps, success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải quy trình'); }
};

exports.processCreate = (req, res) => {
    res.render('admin/process/form', {
        layout: 'layouts/admin', title: 'Thêm bước',
        step: null, action: '/admin/pages/process/store', CUBE_COLORS
    });
};

exports.processStore = async (req, res) => {
    try {
        const { step_number, title, description, color, display_order, is_active } = req.body;
        const image_path = req.file ? '/uploads/process/' + req.file.filename : null;
        await ProcessModel.create({ step_number: parseInt(step_number)||1, title, description, image_path, color: color||'blue', display_order: parseInt(display_order)||0, is_active: is_active==='1'?1:0 });
        res.redirect('/admin/pages/process?success=Thêm bước thành công');
    } catch (err) { res.redirect('/admin/pages/process?error=Lỗi thêm bước'); }
};

exports.processEdit = async (req, res) => {
    try {
        const step = await ProcessModel.getById(req.params.id);
        if (!step) return res.redirect('/admin/pages/process?error=Không tìm thấy');
        res.render('admin/process/form', {
            layout: 'layouts/admin', title: 'Sửa bước',
            step, action: '/admin/pages/process/update/' + step.id, CUBE_COLORS
        });
    } catch (err) { res.redirect('/admin/pages/process?error=Lỗi tải bước'); }
};

exports.processUpdate = async (req, res) => {
    try {
        const { step_number, title, description, color, display_order, is_active } = req.body;
        const current = await ProcessModel.getById(req.params.id);
        if (!current) return res.redirect('/admin/pages/process?error=Không tìm thấy');
        let image_path = current.image_path;
        if (req.file) {
            if (image_path && image_path.startsWith('/uploads/')) {
                const old = pathProc.join(__dirname, '../../public', image_path);
                if (fsProc.existsSync(old)) fsProc.unlinkSync(old);
            }
            image_path = '/uploads/process/' + req.file.filename;
        }
        await ProcessModel.update(req.params.id, { step_number: parseInt(step_number)||1, title, description, image_path, color: color||'blue', display_order: parseInt(display_order)||0, is_active: is_active==='1'?1:0 });
        res.redirect('/admin/pages/process?success=Cập nhật thành công');
    } catch (err) { res.redirect('/admin/pages/process?error=Lỗi cập nhật'); }
};

exports.processDelete = async (req, res) => {
    try {
        const step = await ProcessModel.getById(req.params.id);
        if (step && step.image_path && step.image_path.startsWith('/uploads/')) {
            const f = pathProc.join(__dirname, '../../public', step.image_path);
            if (fsProc.existsSync(f)) fsProc.unlinkSync(f);
        }
        await ProcessModel.delete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.json({ success: false }); }
};

exports.processToggle = async (req, res) => {
    try { await ProcessModel.toggleActive(req.params.id, req.body.is_active); res.json({ success: true }); }
    catch (err) { res.json({ success: false }); }
};

// ===== ĐỘI NGŨ =====
const TeamModel  = require('../models/teamModel');
const pathTeam   = require('path');
const fsTeam     = require('fs');

exports.teamIndex = async (req, res) => {
    try {
        const members = await TeamModel.getAll();
        res.render('admin/team/index', {
            layout: 'layouts/admin', title: 'Quản lý Đội ngũ',
            members, success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải đội ngũ'); }
};

exports.teamCreate = (req, res) => {
    res.render('admin/team/form', {
        layout: 'layouts/admin', title: 'Thêm thành viên',
        member: null, action: '/admin/media/team/store'
    });
};

exports.teamStore = async (req, res) => {
    try {
        const { full_name, position, facebook, linkedin, display_order, is_active } = req.body;
        const image_path = req.file ? '/uploads/team/' + req.file.filename : null;
        await TeamModel.create({ full_name, position, image_path, facebook: facebook||null, linkedin: linkedin||null, display_order: parseInt(display_order)||0, is_active: is_active==='1'?1:0 });
        res.redirect('/admin/media/team?success=Thêm thành viên thành công');
    } catch (err) { res.redirect('/admin/media/team?error=Lỗi thêm'); }
};

exports.teamEdit = async (req, res) => {
    try {
        const member = await TeamModel.getById(req.params.id);
        if (!member) return res.redirect('/admin/media/team?error=Không tìm thấy');
        res.render('admin/team/form', {
            layout: 'layouts/admin', title: 'Sửa thành viên',
            member, action: '/admin/media/team/update/' + member.id
        });
    } catch (err) { res.redirect('/admin/media/team?error=Lỗi tải'); }
};

exports.teamUpdate = async (req, res) => {
    try {
        const { full_name, position, facebook, linkedin, display_order, is_active } = req.body;
        const current = await TeamModel.getById(req.params.id);
        if (!current) return res.redirect('/admin/media/team?error=Không tìm thấy');
        let image_path = current.image_path;
        if (req.file) {
            if (image_path && image_path.startsWith('/uploads/')) {
                const old = pathTeam.join(__dirname, '../../public', image_path);
                if (fsTeam.existsSync(old)) fsTeam.unlinkSync(old);
            }
            image_path = '/uploads/team/' + req.file.filename;
        }
        await TeamModel.update(req.params.id, { full_name, position, image_path, facebook: facebook||null, linkedin: linkedin||null, display_order: parseInt(display_order)||0, is_active: is_active==='1'?1:0 });
        res.redirect('/admin/media/team?success=Cập nhật thành công');
    } catch (err) { res.redirect('/admin/media/team?error=Lỗi cập nhật'); }
};

exports.teamDelete = async (req, res) => {
    try {
        const m = await TeamModel.getById(req.params.id);
        if (m && m.image_path && m.image_path.startsWith('/uploads/')) {
            const f = pathTeam.join(__dirname, '../../public', m.image_path);
            if (fsTeam.existsSync(f)) fsTeam.unlinkSync(f);
        }
        await TeamModel.delete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.json({ success: false }); }
};

exports.teamToggle = async (req, res) => {
    try { await TeamModel.toggleActive(req.params.id, req.body.is_active); res.json({ success: true }); }
    catch (err) { res.json({ success: false }); }
};

// ===== KHO GIAO DIỆN =====
const TemplateModel = require('../models/templateModel');
const pathTpl = require('path');
const fsTpl   = require('fs');

const CATEGORIES = [
  { value: 'bds',     label: 'Bất động sản' },
  { value: 'fnb',     label: 'F&B' },
  { value: 'noithat', label: 'Nội thất' },
  { value: 'dulich',  label: 'Du lịch' },
  { value: 'giaoduc', label: 'Giáo dục' },
  { value: 'lamdep',  label: 'Làm đẹp' },
  { value: 'banhang', label: 'Bán hàng' },
  { value: 'xaydung', label: 'Xây dựng' },
  { value: 'khac',    label: 'Khác' },
];

exports.templateIndex = async (req, res) => {
    try {
        const templates = await TemplateModel.getAll();
        res.render('admin/templates/index', {
            layout: 'layouts/admin', title: 'Kho giao diện Website',
            templates, success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải kho giao diện'); }
};

exports.templateCreate = (req, res) => {
    res.render('admin/templates/form', {
        layout: 'layouts/admin', title: 'Thêm giao diện',
        tpl: null, action: '/admin/media/templates/store', CATEGORIES
    });
};

exports.templateStore = async (req, res) => {
    try {
        const { name, category, description, uses, is_hot, display_order, is_active } = req.body;
        const cat = CATEGORIES.find(c => c.value === category) || { label: 'Khác' };
        const image_path = req.file ? '/uploads/templates/' + req.file.filename : null;
        await TemplateModel.create({
            name, category: category||'khac', category_label: cat.label,
            description, image_path, uses: parseInt(uses)||0,
            is_hot: is_hot==='1'?1:0, display_order: parseInt(display_order)||0,
            is_active: is_active==='1'?1:0
        });
        res.redirect('/admin/media/templates?success=Thêm giao diện thành công');
    } catch (err) { res.redirect('/admin/media/templates?error=Lỗi thêm'); }
};

exports.templateEdit = async (req, res) => {
    try {
        const tpl = await TemplateModel.getById(req.params.id);
        if (!tpl) return res.redirect('/admin/media/templates?error=Không tìm thấy');
        res.render('admin/templates/form', {
            layout: 'layouts/admin', title: 'Sửa giao diện',
            tpl, action: '/admin/media/templates/update/' + tpl.id, CATEGORIES
        });
    } catch (err) { res.redirect('/admin/media/templates?error=Lỗi tải'); }
};

exports.templateUpdate = async (req, res) => {
    try {
        const { name, category, description, uses, is_hot, display_order, is_active } = req.body;
        const current = await TemplateModel.getById(req.params.id);
        if (!current) return res.redirect('/admin/media/templates?error=Không tìm thấy');
        const cat = CATEGORIES.find(c => c.value === category) || { label: 'Khác' };
        let image_path = current.image_path;
        if (req.file) {
            if (image_path && image_path.startsWith('/uploads/')) {
                const old = pathTpl.join(__dirname, '../../public', image_path);
                if (fsTpl.existsSync(old)) fsTpl.unlinkSync(old);
            }
            image_path = '/uploads/templates/' + req.file.filename;
        }
        await TemplateModel.update(req.params.id, {
            name, category: category||'khac', category_label: cat.label,
            description, image_path, uses: parseInt(uses)||0,
            is_hot: is_hot==='1'?1:0, display_order: parseInt(display_order)||0,
            is_active: is_active==='1'?1:0
        });
        res.redirect('/admin/media/templates?success=Cập nhật thành công');
    } catch (err) { res.redirect('/admin/media/templates?error=Lỗi cập nhật'); }
};

exports.templateDelete = async (req, res) => {
    try {
        const tpl = await TemplateModel.getById(req.params.id);
        if (tpl && tpl.image_path && tpl.image_path.startsWith('/uploads/')) {
            const f = pathTpl.join(__dirname, '../../public', tpl.image_path);
            if (fsTpl.existsSync(f)) fsTpl.unlinkSync(f);
        }
        await TemplateModel.delete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.json({ success: false }); }
};

exports.templateToggle = async (req, res) => {
    try { await TemplateModel.toggleActive(req.params.id, req.body.is_active); res.json({ success: true }); }
    catch (err) { res.json({ success: false }); }
};

// ===== KHÁCH HÀNG =====
const ClientModel = require('../models/clientModel');
const pathClient  = require('path');
const fsClient    = require('fs');

exports.clientIndex = async (req, res) => {
    try {
        const clients = await ClientModel.getAll();
        res.render('admin/clients/index', {
            layout: 'layouts/admin', title: 'Khách hàng của Devora',
            clients, success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải khách hàng'); }
};

exports.clientCreate = (req, res) => {
    res.render('admin/clients/form', {
        layout: 'layouts/admin', title: 'Thêm khách hàng',
        client: null, action: '/admin/media/clients/store'
    });
};

exports.clientStore = async (req, res) => {
    try {
        const { full_name, position, company, testimonial, rating, website, display_order, is_active } = req.body;
        const avatar = req.file ? '/uploads/clients/' + req.file.filename : null;
        await ClientModel.create({ full_name, position, company, avatar, testimonial, rating: parseInt(rating)||5, website: website||null, display_order: parseInt(display_order)||0, is_active: is_active==='1'?1:0 });
        res.redirect('/admin/media/clients?success=Thêm khách hàng thành công');
    } catch (err) { res.redirect('/admin/media/clients?error=Lỗi thêm'); }
};

exports.clientEdit = async (req, res) => {
    try {
        const client = await ClientModel.getById(req.params.id);
        if (!client) return res.redirect('/admin/media/clients?error=Không tìm thấy');
        res.render('admin/clients/form', {
            layout: 'layouts/admin', title: 'Sửa khách hàng',
            client, action: '/admin/media/clients/update/' + client.id
        });
    } catch (err) { res.redirect('/admin/media/clients?error=Lỗi tải'); }
};

exports.clientUpdate = async (req, res) => {
    try {
        const { full_name, position, company, testimonial, rating, website, display_order, is_active } = req.body;
        const current = await ClientModel.getById(req.params.id);
        if (!current) return res.redirect('/admin/media/clients?error=Không tìm thấy');
        let avatar = current.avatar;
        if (req.file) {
            if (avatar && avatar.startsWith('/uploads/')) {
                const old = pathClient.join(__dirname, '../../public', avatar);
                if (fsClient.existsSync(old)) fsClient.unlinkSync(old);
            }
            avatar = '/uploads/clients/' + req.file.filename;
        }
        await ClientModel.update(req.params.id, { full_name, position, company, avatar, testimonial, rating: parseInt(rating)||5, website: website||null, display_order: parseInt(display_order)||0, is_active: is_active==='1'?1:0 });
        res.redirect('/admin/media/clients?success=Cập nhật thành công');
    } catch (err) { res.redirect('/admin/media/clients?error=Lỗi cập nhật'); }
};

exports.clientDelete = async (req, res) => {
    try {
        const c = await ClientModel.getById(req.params.id);
        if (c) {
            // Sao chép vào thùng rác trước khi xóa (giữ file avatar để khôi phục được trọn vẹn)
            try {
                await require('../models/systemToolsModel').trashAdd({
                    item_type: 'client', item_id: c.id, title: c.full_name,
                    payload: c, deleted_by: req.session.adminUser ? req.session.adminUser.username : null
                });
            } catch (e) { console.error('Trash client:', e.message); }
        }
        await ClientModel.delete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.json({ success: false }); }
};

exports.clientToggle = async (req, res) => {
    try { await ClientModel.toggleActive(req.params.id, req.body.is_active); res.json({ success: true }); }
    catch (err) { res.json({ success: false }); }
};

// ===== POPUP =====
const PopupModel  = require('../models/popupModel');
const pathPopup   = require('path');
const fsPopup     = require('fs');

exports.popupIndex = async (req, res) => {
    try {
        const popup = await PopupModel.get();
        res.render('admin/popup/index', {
            layout: 'layouts/admin', title: 'Cấu hình Popup',
            popup: popup || {}, success: req.query.success || null, error: req.query.error || null
        });
    } catch (err) { res.redirect('/admin?error=Lỗi tải popup'); }
};

exports.popupSave = async (req, res) => {
    try {
        const { title, content, link, delay_seconds, show_once, is_active } = req.body;
        const current = await PopupModel.get();
        let image_path = current ? current.image_path : null;
        if (req.file) {
            if (image_path && image_path.startsWith('/uploads/')) {
                const old = pathPopup.join(__dirname, '../../public', image_path);
                if (fsPopup.existsSync(old)) fsPopup.unlinkSync(old);
            }
            image_path = '/uploads/popup/' + req.file.filename;
        }
        await PopupModel.save({
            title: title || null, content: content || null,
            link: link || null, image_path,
            delay_seconds: parseInt(delay_seconds) || 3,
            show_once: show_once === '1' ? 1 : 0,
            is_active: is_active === '1' ? 1 : 0
        });
        res.redirect('/admin/pages/popup?success=Lưu popup thành công');
    } catch (err) { res.redirect('/admin/pages/popup?error=Lỗi lưu popup'); }
};
