const AdminUserModel = require('../models/adminUserModel');

exports.loginPage = (req, res) => {
    if (req.session && req.session.adminUser) return res.redirect('/admin');
    res.render('admin/auth/login', {
        layout: false,
        error: req.session.loginError || null,
        siteUrl: process.env.SITE_URL || '/'
    });
    delete req.session.loginError;
};

exports.loginPost = async (req, res) => {
    const { username, password, remember } = req.body;

    if (!username || !password) {
        req.session.loginError = 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.';
        return res.redirect('/admin/user/login');
    }

    try {
        const user = await AdminUserModel.findByUsername(username.trim());
        if (!user) {
            req.session.loginError = 'Tài khoản không tồn tại hoặc đã bị khóa.';
            return res.redirect('/admin/user/login');
        }

        const match = await AdminUserModel.verifyPassword(password, user.password);
        if (!match) {
            req.session.loginError = 'Mật khẩu không đúng.';
            return res.redirect('/admin/user/login');
        }

        // Lưu session
        req.session.adminUser = { id: user.id, username: user.username, full_name: user.full_name };

        // Ghi nhớ đăng nhập 7 ngày
        if (remember) req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;

        const returnTo = req.session.returnTo || '/admin';
        delete req.session.returnTo;
        res.redirect(returnTo);
    } catch (err) {
        console.error(err);
        req.session.loginError = 'Lỗi hệ thống, vui lòng thử lại.';
        res.redirect('/admin/user/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect('/admin/user/login'));
};
