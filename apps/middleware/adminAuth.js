module.exports = function adminAuth(req, res, next) {
    // Bỏ qua route login
    if (req.path === '/admin/user/login') return next();

    if (req.session && req.session.adminUser) {
        res.locals.adminUser = req.session.adminUser;
        return next();
    }

    // Lưu URL muốn vào để redirect sau login
    req.session.returnTo = req.originalUrl;
    res.redirect('/admin/user/login');
};
