const express = require('express');
const router = express.Router();
const UserController = require('./user.controller');
const { requireAuth, requireRole } = require('../../Share/middleware/auth.middleware');

// Đăng ký tài khoản (Không cần đăng nhập)
router.post('/', UserController.createUser);

// Các tính năng cần đăng nhập
router.use(requireAuth);

router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);

// Chỉ Admin mới được xem toàn bộ danh sách và xóa người dùng
router.get('/', requireRole(['admin']), UserController.getAllUsers);
router.delete('/:id', requireRole(['admin']), UserController.deleteUser);

module.exports = router;