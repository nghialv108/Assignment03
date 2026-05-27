const express = require('express');
const router = express.Router();
const CategoryController = require('./category.controller');
const { requireAuth, requireRole } = require('../../Share/middleware/auth.middleware');

// Ai đăng nhập cũng có thể xem danh mục
router.get('/', requireAuth, CategoryController.getAllCategories);
router.get('/:id', requireAuth, CategoryController.getCategoryById);

// CHẶN QUYỀN TRỰC TIẾP TẠI ROUTE: Phải là Admin mới được thêm/sửa/xóa
router.post('/', requireAuth, requireRole(['admin']), CategoryController.createCategory);
router.put('/:id', requireAuth, requireRole(['admin']), CategoryController.updateCategory);
router.delete('/:id', requireAuth, requireRole(['admin']), CategoryController.deleteCategory);

module.exports = router;