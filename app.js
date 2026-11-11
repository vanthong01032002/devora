require('dotenv').config();

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'apps/views'));

app.use(expressLayouts);
app.set('layout', 'layouts/main');

// static
app.use(express.static(path.join(__dirname, 'public')));

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'devora_secret_2024',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 ngày
}));

// Visitor tracking
const { VisitorModel } = require('./apps/models/visitorModel');
app.use(function(req, res, next) {
    if (!req.path.startsWith('/admin') && !req.path.startsWith('/api') &&
        !req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|webp|avif|woff|woff2)$/)) {
        const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
        VisitorModel.log(ip, req.headers['user-agent'] || '', req.path).catch(() => {});
    }
    next();
});

// ===== HELPER: getSocialIcon =====
const SOCIAL_ICONS = {
  facebook:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>',
  youtube:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>',
  zalo:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-5h2v5zm0-7h-2V7.5h2V9.5z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
  tiktok:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>',
  twitter:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  linkedin:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>',
  telegram:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
  custom:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93V18c0-.55-.45-1-1-1s-1 .45-1 1v1.93C7.06 19.44 4.56 16.94 4.07 13H6c.55 0 1-.45 1-1s-.45-1-1-1H4.07C4.56 7.06 7.06 4.56 11 4.07V6c0 .55.45 1 1 1s1-.45 1-1V4.07C16.94 4.56 19.44 7.06 19.93 11H18c-.55 0-1 .45-1 1s.45 1 1 1h1.93c-.49 3.94-2.99 6.44-6.93 6.93z"/></svg>'
};

app.locals.getSocialIcon = (type) => SOCIAL_ICONS[type] || SOCIAL_ICONS.custom;
app.locals.tinymceKey = process.env.TINYMCE_KEY || 'no-api-key';

// Inject popup vào mọi trang user
const PopupModel = require('./apps/models/popupModel');
app.use(async (req, res, next) => {
    if (!req.path.startsWith('/admin') && !req.path.startsWith('/api') &&
        !req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|webp|avif|woff|woff2)$/)) {
        try {
            const popup = await PopupModel.get();
            res.locals.sitePopup = (popup && popup.is_active) ? popup : null;
        } catch { res.locals.sitePopup = null; }
    }
    next();
});

// routes
const userRoutes = require('./apps/routes/userRoutes');
app.use('/', userRoutes);

// Auth routes (không cần middleware)
const authController = require('./apps/controllers/authController');
app.get('/admin/user/login',  authController.loginPage);
app.post('/admin/user/login', authController.loginPost);
app.get('/admin/user/logout', authController.logout);

const adminRoutes = require('./apps/routes/adminRoutes');

// Auth middleware bảo vệ toàn bộ /admin
const adminAuth = require('./apps/middleware/adminAuth');
app.use('/admin', adminAuth);

// Middleware: inject adminSiteUrl từ settings vào mọi trang admin
const SettingsModel = require('./apps/models/settingsModel');
app.use('/admin', async (req, res, next) => {
    try {
        const s = await SettingsModel.getAll();
        res.locals.adminSiteUrl = s.website || '/';
    } catch {
        res.locals.adminSiteUrl = '/';
    }
    next();
});

app.use('/', adminRoutes);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});