const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.home);
router.get('/login', userController.login);
router.get('/dich-vu', userController.dichVu);
router.get('/khach-hang', userController.khachHang);
router.get('/about', userController.veChungToi);
router.get('/kho-giao-dien', userController.khoGiaoDien);
router.get('/blog', userController.blog);
router.get('/blog/:slug', userController.blogDetail);
router.get('/lien-he',  userController.lienHe);
router.post('/lien-he', userController.lienHeSend);

// Domain check API
router.get('/api/check-domain', userController.checkDomain);

// Thiết kế website sub-pages
router.get('/thiet-ke-website',            userController.tkwIndex);
router.get('/thiet-ke-website/gioi-thieu', userController.tkwGioiThieu);
router.get('/thiet-ke-website/bang-gia',   userController.tkwBangGia);
router.get('/thiet-ke-website/portfolio',  userController.tkwPortfolio);

module.exports = router;