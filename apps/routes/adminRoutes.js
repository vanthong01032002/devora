const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const adminController = require('../controllers/adminController');
const seoToolsController = require('../controllers/seoToolsController');
const systemController = require('../controllers/systemController');

// Ghi lịch sử thao tác admin (POST/PUT/PATCH/DELETE) vào bảng admin_logs
router.use(require('../middleware/adminLogger'));

// ===== MULTER ERROR HANDLER MIDDLEWARE =====
function handleMulterError(err, req, res, next) {
    if (err && err.code === 'LIMIT_FILE_SIZE') {
        const back = req.headers.referer || '/admin';
        // Lấy giới hạn MB từ limit (bytes)
        const mb = err.field ? '' : '';
        return res.redirect(back + (back.includes('?') ? '&' : '?') + 'error=File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
    }
    if (err && err.code === 'LIMIT_UNEXPECTED_FILE') {
        const back = req.headers.referer || '/admin';
        return res.redirect(back + (back.includes('?') ? '&' : '?') + 'error=Loại file không được hỗ trợ.');
    }
    if (err) {
        const back = req.headers.referer || '/admin';
        return res.redirect(back + (back.includes('?') ? '&' : '?') + `error=${encodeURIComponent(err.message || 'Lỗi upload file.')}`);
    }
    next();
}

// Multer config cho slideshow
const uploadDir = path.join(__dirname, '../../public/uploads/slideshow');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, 'slide_' + Date.now() + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|avif/;
        const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
                   allowed.test(file.mimetype);
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
    }
});

// Dashboard
router.get('/admin', adminController.dashboard);

// Settings
router.get('/admin/settings',  adminController.settingsIndex);
router.post('/admin/settings', adminController.settingsSave);

// Popup
const popupUploadDir = path.join(__dirname, '../../public/uploads/popup');
if (!fs.existsSync(popupUploadDir)) fs.mkdirSync(popupUploadDir, { recursive: true });
const uploadPopup = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, popupUploadDir),
        filename: (req, file, cb) => cb(null, 'popup_' + Date.now() + path.extname(file.originalname))
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp|avif/.test(path.extname(file.originalname).toLowerCase());
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
    }
});

router.get('/admin/pages/popup',  adminController.popupIndex);
router.post('/admin/pages/popup', uploadPopup.single('image'), adminController.popupSave);

// Logo & Favicon upload
const mediaUploadDir = require('path').join(__dirname, '../../public/uploads/media');
if (!require('fs').existsSync(mediaUploadDir)) require('fs').mkdirSync(mediaUploadDir, { recursive: true });

const mediaStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, mediaUploadDir),
    filename: (req, file, cb) => cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
});
const uploadMedia = multer({
    storage: mediaStorage,
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp|avif|svg|ico/.test(path.extname(file.originalname).toLowerCase());
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
    }
});

router.get('/admin/media/logo',    adminController.logoIndex);
router.post('/admin/media/logo',   uploadMedia.single('logo'), adminController.logoUpload);
router.get('/admin/media/favicon', adminController.faviconIndex);
router.post('/admin/media/favicon',uploadMedia.single('favicon'), adminController.faviconUpload);

// Blog / Tin tức
const blogUploadDir = path.join(__dirname, '../../public/uploads/blog');
if (!fs.existsSync(blogUploadDir)) fs.mkdirSync(blogUploadDir, { recursive: true });
const blogStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, blogUploadDir),
    filename: (req, file, cb) => cb(null, 'blog_' + Date.now() + path.extname(file.originalname))
});
const uploadBlog = multer({ storage: blogStorage, limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp|avif/.test(path.extname(file.originalname).toLowerCase());
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
    }
});

router.get('/admin/content/news',              adminController.blogIndex);
router.get('/admin/content/news/create',       adminController.blogCreate);
router.post('/admin/content/news/store',       uploadBlog.single('thumbnail'), adminController.blogStore);
router.get('/admin/content/news/edit/:id',     adminController.blogEdit);
router.post('/admin/content/news/update/:id',  uploadBlog.single('thumbnail'), adminController.blogUpdate);
router.delete('/admin/content/news/:id',       adminController.blogDelete);
router.post('/admin/content/news/toggle-active/:id',   adminController.blogToggleActive);
router.post('/admin/content/news/toggle-featured/:id', adminController.blogToggleFeatured);
router.get('/admin/content/news/slug-check',   adminController.blogSlugCheck);

// Contact page
const contactUploadDir = path.join(__dirname, '../../public/uploads/contact');
if (!fs.existsSync(contactUploadDir)) fs.mkdirSync(contactUploadDir, { recursive: true });
const uploadContact = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, contactUploadDir),
        filename: (req, file, cb) => cb(null, 'contact_' + Date.now() + path.extname(file.originalname))
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp|avif/.test(path.extname(file.originalname).toLowerCase());
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
    }
});

router.get('/admin/pages/contact',       adminController.contactPageIndex);
router.post('/admin/pages/contact',      uploadContact.single('image'), adminController.contactPageSave);

// Trang Giới thiệu (Về chúng tôi)
const aboutUploadDir = path.join(__dirname, '../../public/uploads/about');
if (!fs.existsSync(aboutUploadDir)) fs.mkdirSync(aboutUploadDir, { recursive: true });
const uploadAbout = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, aboutUploadDir),
        filename: (req, file, cb) => cb(null, 'about_' + Date.now() + path.extname(file.originalname))
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp|avif/.test(path.extname(file.originalname).toLowerCase());
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
    }
});
router.get('/admin/pages/about',  adminController.aboutPageIndex);
router.post('/admin/pages/about', uploadAbout.fields([{ name: 'hero_image', maxCount: 1 }, { name: 'story_image', maxCount: 1 }]), adminController.aboutPageSave);
router.get('/admin/mail/contact',        adminController.contactMessages);
router.post('/admin/mail/contact/read-all', adminController.contactMarkAllRead);
router.delete('/admin/mail/contact/:id', adminController.contactMessageDelete);

// SEO Pages
const seoUploadDir = path.join(__dirname, '../../public/uploads/seo');
if (!fs.existsSync(seoUploadDir)) fs.mkdirSync(seoUploadDir, { recursive: true });
const uploadSeo = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, seoUploadDir),
        filename: (req, file, cb) => cb(null, 'seo_' + req.params.key + '_' + Date.now() + path.extname(file.originalname))
    }),
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp|avif/.test(path.extname(file.originalname).toLowerCase());
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
    }
});

router.get('/admin/seo-pages/:key',  adminController.seoPageIndex);
router.post('/admin/seo-pages/:key', uploadSeo.single('og_image'), adminController.seoPageSave);

// ===== CONG CU SEO =====
router.get('/admin/seo-tools/check', seoToolsController.checkPage);
router.post('/admin/seo-tools/check', seoToolsController.checkRun);
router.get('/admin/seo-tools/links', seoToolsController.linksPage);
router.post('/admin/seo-tools/links/save', seoToolsController.linksSave);
router.post('/admin/seo-tools/links/delete/:id', seoToolsController.linksDelete);
router.post('/admin/seo-tools/links/toggle/:id', seoToolsController.linksToggle);
router.get('/admin/seo-tools/redirects', seoToolsController.redirectsPage);
router.post('/admin/seo-tools/redirects/save', seoToolsController.redirectsSave);
router.post('/admin/seo-tools/redirects/delete/:id', seoToolsController.redirectsDelete);
router.post('/admin/seo-tools/redirects/toggle/:id', seoToolsController.redirectsToggle);

// Process steps
const procUploadDir = path.join(__dirname, '../../public/uploads/process');
if (!fs.existsSync(procUploadDir)) fs.mkdirSync(procUploadDir, { recursive: true });
const uploadProc = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, procUploadDir),
        filename: (req, file, cb) => cb(null, 'proc_' + Date.now() + path.extname(file.originalname))
    }),
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp|avif/.test(path.extname(file.originalname).toLowerCase());
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
    }
});

router.get('/admin/pages/process',              adminController.processIndex);
router.get('/admin/pages/process/create',       adminController.processCreate);
router.post('/admin/pages/process/store',       uploadProc.single('image'), adminController.processStore);
router.get('/admin/pages/process/edit/:id',     adminController.processEdit);
router.post('/admin/pages/process/update/:id',  uploadProc.single('image'), adminController.processUpdate);
router.delete('/admin/pages/process/:id',       adminController.processDelete);
router.post('/admin/pages/process/toggle/:id',  adminController.processToggle);

// Slideshow CRUD
router.get('/admin/media/slideshow',              adminController.slideshowIndex);
router.get('/admin/media/slideshow/create',       adminController.slideshowCreate);
router.post('/admin/media/slideshow/store',       upload.single('image'), adminController.slideshowStore);
router.get('/admin/media/slideshow/edit/:id',     adminController.slideshowEdit);
router.post('/admin/media/slideshow/update/:id',  upload.single('image'), adminController.slideshowUpdate);
router.delete('/admin/media/slideshow/:id',       adminController.slideshowDelete);
router.post('/admin/media/slideshow/toggle/:id',  adminController.slideshowToggle);
router.delete('/admin/media/slideshow',           adminController.slideshowDeleteAll);

// Services upload dir
const svcUploadDir = path.join(__dirname, '../../public/uploads/services');
if (!fs.existsSync(svcUploadDir)) fs.mkdirSync(svcUploadDir, { recursive: true });

const svcStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, svcUploadDir),
    filename: (req, file, cb) => cb(null, 'svc_' + Date.now() + path.extname(file.originalname))
});
const uploadSvc = multer({ storage: svcStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|gif|webp|avif/.test(path.extname(file.originalname).toLowerCase());
    ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
}});

// Services CRUD
router.get('/admin/content/services',              adminController.servicesIndex);
router.get('/admin/content/services/create',       adminController.servicesCreate);
router.post('/admin/content/services/store',       uploadSvc.single('image'), adminController.servicesStore);
router.get('/admin/content/services/edit/:id',     adminController.servicesEdit);
router.post('/admin/content/services/update/:id',  uploadSvc.single('image'), adminController.servicesUpdate);
router.delete('/admin/content/services/:id',       adminController.servicesDelete);
router.post('/admin/content/services/toggle/:id',  adminController.servicesToggle);

// Pricing CRUD
router.get('/admin/media/pricing',              adminController.pricingIndex);
router.get('/admin/media/pricing/create',       adminController.pricingCreate);
router.post('/admin/media/pricing/store',       adminController.pricingStore);
router.get('/admin/media/pricing/edit/:id',     adminController.pricingEdit);
router.post('/admin/media/pricing/update/:id',  adminController.pricingUpdate);
router.delete('/admin/media/pricing/:id',       adminController.pricingDelete);
router.post('/admin/media/pricing/toggle/:id',  adminController.pricingToggle);

// Social buttons CRUD
const socUploadDir = path.join(__dirname, '../../public/uploads/social');
if (!fs.existsSync(socUploadDir)) fs.mkdirSync(socUploadDir, { recursive: true });
const socStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, socUploadDir),
    filename: (req, file, cb) => cb(null, 'soc_' + Date.now() + path.extname(file.originalname))
});
const uploadSoc = multer({ storage: socStorage, limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp|avif|svg/.test(path.extname(file.originalname).toLowerCase());
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
    }
});

router.get('/admin/media/social',              adminController.socialIndex);
router.get('/admin/media/social/create',       adminController.socialCreate);
router.post('/admin/media/social/store',       uploadSoc.single('image'), adminController.socialStore);
router.get('/admin/media/social/edit/:id',     adminController.socialEdit);
router.post('/admin/media/social/update/:id',  uploadSoc.single('image'), adminController.socialUpdate);
router.delete('/admin/media/social/:id',       adminController.socialDelete);
router.post('/admin/media/social/toggle/:id',  adminController.socialToggle);
router.delete('/admin/media/social',           adminController.socialDeleteAll);

// Social Footer CRUD
router.get('/admin/media/social-footer',              adminController.socialFooterIndex);
router.get('/admin/media/social-footer/create',       adminController.socialFooterCreate);
router.post('/admin/media/social-footer/store',       adminController.socialFooterStore);
router.get('/admin/media/social-footer/edit/:id',     adminController.socialFooterEdit);
router.post('/admin/media/social-footer/update/:id',  adminController.socialFooterUpdate);
router.delete('/admin/media/social-footer/:id',       adminController.socialFooterDelete);
router.post('/admin/media/social-footer/toggle/:id',  adminController.socialFooterToggle);
router.delete('/admin/media/social-footer',           adminController.socialFooterDeleteAll);

// Team members
const teamUploadDir = path.join(__dirname, '../../public/uploads/team');
if (!fs.existsSync(teamUploadDir)) fs.mkdirSync(teamUploadDir, { recursive: true });
const uploadTeam = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, teamUploadDir),
        filename: (req, file, cb) => cb(null, 'team_' + Date.now() + path.extname(file.originalname))
    }),
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp|avif/.test(path.extname(file.originalname).toLowerCase());
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
    }
});

router.get('/admin/media/team',              adminController.teamIndex);
router.get('/admin/media/team/create',       adminController.teamCreate);
router.post('/admin/media/team/store',       uploadTeam.single('image'), adminController.teamStore);
router.get('/admin/media/team/edit/:id',     adminController.teamEdit);
router.post('/admin/media/team/update/:id',  uploadTeam.single('image'), adminController.teamUpdate);
router.delete('/admin/media/team/:id',       adminController.teamDelete);
router.post('/admin/media/team/toggle/:id',  adminController.teamToggle);

// Website Templates (Kho giao diện)
const tplUploadDir = path.join(__dirname, '../../public/uploads/templates');
if (!fs.existsSync(tplUploadDir)) fs.mkdirSync(tplUploadDir, { recursive: true });
const uploadTpl = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, tplUploadDir),
        filename: (req, file, cb) => cb(null, 'tpl_' + Date.now() + path.extname(file.originalname))
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp|avif/.test(path.extname(file.originalname).toLowerCase());
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
    }
});

router.get('/admin/media/templates',              adminController.templateIndex);
router.get('/admin/media/templates/create',       adminController.templateCreate);
router.post('/admin/media/templates/store',       uploadTpl.single('image'), adminController.templateStore);
router.get('/admin/media/templates/edit/:id',     adminController.templateEdit);
router.post('/admin/media/templates/update/:id',  uploadTpl.single('image'), adminController.templateUpdate);
router.delete('/admin/media/templates/:id',       adminController.templateDelete);
router.post('/admin/media/templates/toggle/:id',  adminController.templateToggle);

// Clients (Khách hàng)
const clientUploadDir = path.join(__dirname, '../../public/uploads/clients');
if (!fs.existsSync(clientUploadDir)) fs.mkdirSync(clientUploadDir, { recursive: true });
const uploadClient = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, clientUploadDir),
        filename: (req, file, cb) => cb(null, 'client_' + Date.now() + path.extname(file.originalname))
    }),
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp|avif/.test(path.extname(file.originalname).toLowerCase());
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh'));
    }
});

router.get('/admin/media/clients',              adminController.clientIndex);
router.get('/admin/media/clients/create',       adminController.clientCreate);
router.post('/admin/media/clients/store',       uploadClient.single('avatar'), adminController.clientStore);
router.get('/admin/media/clients/edit/:id',     adminController.clientEdit);
router.post('/admin/media/clients/update/:id',  uploadClient.single('avatar'), adminController.clientUpdate);
router.delete('/admin/media/clients/:id',       adminController.clientDelete);
router.post('/admin/media/clients/toggle/:id',  adminController.clientToggle);

// ===== HỆ THỐNG (Tài khoản / File / Cache / Thùng rác / Lịch sử) =====
router.get('/admin/account', systemController.accountPage);
router.post('/admin/account/password', systemController.accountChangePassword);
router.get('/admin/password', (req, res) => res.redirect('/admin/account#doi-mat-khau'));

// Quản lý file: upload vào public/uploads (chọn thư mục con có sẵn)
const filesUploadRoot = path.join(__dirname, '../../public/uploads');
const uploadFiles = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const sub = (req.body && req.body.sub ? String(req.body.sub) : '').replace(/[^a-zA-Z0-9_-]/g, '');
            let dest = filesUploadRoot;
            if (sub && fs.existsSync(path.join(filesUploadRoot, sub)) && fs.statSync(path.join(filesUploadRoot, sub)).isDirectory()) {
                dest = path.join(filesUploadRoot, sub);
            }
            cb(null, dest);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            let base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'file';
            let name = base + ext;
            const sub = (req.body && req.body.sub ? String(req.body.sub) : '').replace(/[^a-zA-Z0-9_-]/g, '');
            const dir = sub ? path.join(filesUploadRoot, sub) : filesUploadRoot;
            if (fs.existsSync(path.join(dir, name))) name = base + '_' + Date.now() + ext;
            cb(null, name);
        }
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp|avif|svg|pdf|zip/.test(path.extname(file.originalname).toLowerCase());
        ok ? cb(null, true) : cb(new Error('Chỉ chấp nhận file ảnh, PDF hoặc ZIP'));
    }
});
router.get('/admin/files', systemController.filesPage);
router.post('/admin/files/upload', uploadFiles.single('file'), systemController.filesUpload);
router.post('/admin/files/delete', systemController.filesDelete);

router.post('/admin/system/clear-cache', systemController.clearCache);

router.get('/admin/trash', systemController.trashPage);
router.post('/admin/trash/restore/:id', systemController.trashRestore);
router.post('/admin/trash/purge/:id', systemController.trashPurge);

router.get('/admin/history', systemController.historyPage);

// ===== GLOBAL MULTER ERROR HANDLER =====
router.use(handleMulterError);

module.exports = router;
