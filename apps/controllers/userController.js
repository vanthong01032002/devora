const userService = require('../services/userService');
const SlideshowModel = require('../models/slideshowModel');
const PricingModel   = require('../models/pricingModel');
const ServicesModel  = require('../models/servicesModel');
const SocialModel    = require('../models/socialModel');
const SocialFooterModel = require('../models/socialFooterModel');
const SettingsModel     = require('../models/settingsModel');
const BlogModel         = require('../models/blogModel');
const SeoModel          = require('../models/seoModel');
const ProcessModel      = require('../models/processModel');
const TeamModel         = require('../models/teamModel');
const TemplateModel     = require('../models/templateModel');
const ClientModel       = require('../models/clientModel');
const PopupModel        = require('../models/popupModel');

// Helper: load social buttons cho mọi trang
async function getSocialButtons() {
    try { return await SocialModel.getAllActive(); } catch { return []; }
}
async function getSocialFooter() {
    try { return await SocialFooterModel.getAllActive(); } catch { return []; }
}
async function getSettings() {
    try { return await SettingsModel.getAll(); } catch { return {}; }
}

// render login
exports.login = (req, res) => {
    res.render('user/login');
};

// trang chủ
exports.home = async (req, res) => {
    try {
        const [users, slides, pricing, socialButtons, socialFooter, settings, featuredPosts, seo, processSteps] = await Promise.all([
            userService.getAllUsers(),
            SlideshowModel.getAllActive(),
            PricingModel.getAllActive(),
            getSocialButtons(),
            getSocialFooter(),
            getSettings(),
            BlogModel.getFeatured(6),
            SeoModel.getByKey('home'),
            ProcessModel.getAllActive()
        ]);
        res.render('user/index', { layout: 'layouts/main', title: seo.title || 'Trang chủ', users, slides, pricing, socialButtons, socialFooter, settings, featuredPosts, seo, processSteps });
    } catch (error) {
        console.error(error);
        res.send("Lỗi database");
    }
};

// trang dịch vụ
exports.dichVu = async (req, res) => {
    try {
        const [services, socialButtons, socialFooter, settings, seo] = await Promise.all([ServicesModel.getAllActive(), getSocialButtons(), getSocialFooter(), getSettings(), SeoModel.getByKey('services')]);
        res.render('user/dich-vu', { layout: 'layouts/main', title: seo.title || 'Dịch vụ - Devora', services, socialButtons, socialFooter, settings, seo });
    } catch (error) {
        console.error(error);
        res.render('user/dich-vu', { layout: 'layouts/main', title: 'Dịch vụ - Devora', services: [], socialButtons: [], socialFooter: [], settings: {}, seo: {} });
    }
};

// trang khách hàng
exports.khachHang = async (req, res) => {
    const [socialButtons, socialFooter, settings, clients] = await Promise.all([getSocialButtons(), getSocialFooter(), getSettings(), ClientModel.getAllActive()]);
    res.render('user/khach-hang', { layout: 'layouts/main', title: 'Khách hàng - Devora', socialButtons, socialFooter, settings, seo: {}, clients });
};

// trang về chúng tôi
exports.veChungToi = async (req, res) => {
    const [socialButtons, socialFooter, settings, team] = await Promise.all([
        getSocialButtons(), getSocialFooter(), getSettings(), TeamModel.getAllActive()
    ]);
    res.render('user/ve-chung-toi', { layout: 'layouts/main', title: 'Về chúng tôi - Devora', socialButtons, socialFooter, settings, seo: {}, team });
};

// kho giao diện
exports.khoGiaoDien = async (req, res) => {
    const [socialButtons, socialFooter, settings, templates] = await Promise.all([
        getSocialButtons(), getSocialFooter(), getSettings(), TemplateModel.getAllActive()
    ]);
    res.render('user/kho-giao-dien', { layout: 'layouts/main', title: 'Kho giao diện website - Devora', socialButtons, socialFooter, settings, seo: {}, templates });
};

// blog

exports.blog = async (req, res) => {
    const [posts, socialButtons, socialFooter, settings, seo] = await Promise.all([
        BlogModel.getAllActive(), getSocialButtons(), getSocialFooter(), getSettings(), SeoModel.getByKey('news')
    ]);
    res.render('user/blog', { layout: 'layouts/main', title: seo.title || 'Blog - Devora', posts, socialButtons, socialFooter, settings, seo });
};

exports.blogDetail = async (req, res) => {
    try {
        const [post, socialButtons, socialFooter, settings] = await Promise.all([
            BlogModel.getBySlug(req.params.slug), getSocialButtons(), getSocialFooter(), getSettings()
        ]);
        if (!post) return res.status(404).render('user/blog', { layout: 'layouts/main', title: 'Không tìm thấy', posts: [], socialButtons, socialFooter, settings });
        await BlogModel.incrementViews(post.id);
        res.render('user/blog-detail', {
            layout: 'layouts/main',
            title: post.seo_title || post.title,
            post, socialButtons, socialFooter, settings
        });
    } catch (err) {
        console.error(err);
        res.redirect('/blog');
    }
};

// liên hệ
const ContactModel = require('../models/contactModel');

exports.lienHe = async (req, res) => {
    const [contactPage, socialButtons, socialFooter, settings] = await Promise.all([
        ContactModel.getPage(), getSocialButtons(), getSocialFooter(), getSettings()
    ]);
    res.render('user/lien-he', { layout: 'layouts/main', title: 'Liên hệ - Devora', contactPage, socialButtons, socialFooter, settings, sent: false });
};

exports.lienHeSend = async (req, res) => {
    try {
        const { full_name, email, phone, subject, message } = req.body;
        await ContactModel.saveMessage({ full_name, email, phone, subject, message });
        const [contactPage, socialButtons, socialFooter, settings] = await Promise.all([
            ContactModel.getPage(), getSocialButtons(), getSocialFooter(), getSettings()
        ]);
        res.render('user/lien-he', { layout: 'layouts/main', title: 'Liên hệ - Devora', contactPage, socialButtons, socialFooter, settings, sent: true });
    } catch (err) {
        console.error(err);
        res.redirect('/lien-he');
    }
};

// ===== THIẾT KẾ WEBSITE SUB-PAGES =====

// Trang chính thiết kế website
exports.tkwIndex = async (req, res) => {
    const [pricing, services, socialButtons, socialFooter, settings] = await Promise.all([
        PricingModel.getAllActive(), ServicesModel.getAllActive(),
        getSocialButtons(), getSocialFooter(), getSettings()
    ]);
    res.render('user/tkw/index', {
        layout: 'layouts/main',
        title: 'Thiết kế Website chuyên nghiệp | Devora',
        pricing, services, socialButtons, socialFooter, settings, seo: {}
    });
};

// Giới thiệu dịch vụ thiết kế website
exports.tkwGioiThieu = async (req, res) => {
    const [socialButtons, socialFooter, settings, seo] = await Promise.all([
        getSocialButtons(), getSocialFooter(), getSettings(), SeoModel.getByKey('home')
    ]);
    res.render('user/tkw/gioi-thieu', {
        layout: 'layouts/main',
        title: 'Giới thiệu dịch vụ thiết kế website | Devora',
        socialButtons, socialFooter, settings, seo
    });
};

// Bảng giá thiết kế website
exports.tkwBangGia = async (req, res) => {
    const [pricing, socialButtons, socialFooter, settings] = await Promise.all([
        PricingModel.getAllActive(), getSocialButtons(), getSocialFooter(), getSettings()
    ]);
    res.render('user/tkw/bang-gia', {
        layout: 'layouts/main',
        title: 'Bảng giá thiết kế website | Devora',
        pricing, socialButtons, socialFooter, settings, seo: {}
    });
};

// Portfolio / dự án đã thực hiện
exports.tkwPortfolio = async (req, res) => {
    const [socialButtons, socialFooter, settings] = await Promise.all([
        getSocialButtons(), getSocialFooter(), getSettings()
    ]);
    res.render('user/tkw/portfolio', {
        layout: 'layouts/main',
        title: 'Portfolio - Dự án thiết kế website | Devora',
        socialButtons, socialFooter, settings, seo: {}
    });
};

// ===== DOMAIN CHECK =====
const https = require('https');

exports.checkDomain = async (req, res) => {
    let domain = (req.query.domain || '').trim().toLowerCase()
        .replace(/^https?:\/\//,'').replace(/\/.*$/,'').replace(/^www\./,'');

    if (!domain) return res.json({ error: 'Vui lòng nhập tên miền' });
    if (!domain.includes('.')) domain += '.com';
    if (!/^[a-z0-9][a-z0-9\-\.]{0,61}[a-z0-9]\.[a-z]{2,}$/.test(domain)) {
        return res.json({ error: 'Tên miền không hợp lệ' });
    }

    try {
        const rdapUrl = `https://rdap.org/domain/${encodeURIComponent(domain)}`;
        const data = await new Promise((resolve) => {
            const r = require('https').get(rdapUrl, {
                headers: { 'Accept': 'application/rdap+json, application/json' },
                timeout: 8000
            }, (resp) => {
                let body = '';
                resp.on('data', chunk => body += chunk);
                resp.on('end', () => {
                    try { resolve({ status: resp.statusCode, body: JSON.parse(body) }); }
                    catch { resolve({ status: resp.statusCode, body: null }); }
                });
            });
            r.on('error', () => resolve({ status: 0, body: null }));
            r.on('timeout', () => { r.destroy(); resolve({ status: 0, body: null }); });
        });

        if (data.status === 200 && data.body) {
            const events = data.body.events || [];
            const expiry  = events.find(e => e.eventAction === 'expiration');
            const created = events.find(e => e.eventAction === 'registration');
            const registrar = data.body.entities?.find(e => e.roles?.includes('registrar'))
                ?.vcardArray?.[1]?.find(v => v[0] === 'fn')?.[3] || null;
            return res.json({ domain, available: false, status: 'registered',
                expiry: expiry ? expiry.eventDate : null,
                created: created ? created.eventDate : null, registrar });
        }

        if (data.status === 404) {
            return res.json({ domain, available: true, status: 'available' });
        }

        // Fallback DNS
        const dns = require('dns').promises;
        try {
            await dns.lookup(domain);
            return res.json({ domain, available: false, status: 'registered' });
        } catch {
            return res.json({ domain, available: true, status: 'available' });
        }
    } catch (err) {
        return res.json({ error: 'Không thể kiểm tra lúc này, vui lòng thử lại.' });
    }
};
