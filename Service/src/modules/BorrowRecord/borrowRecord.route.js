const express = require('express');
const router = express.Router();
const BorrowRecordController = require('./borrowRecord.controller');
const { requireAuth, requireRole } = require('../../Share/middleware/auth.middleware');

router.use(requireAuth);

router.get('/', BorrowRecordController.getAllRecords);
router.get('/:id', BorrowRecordController.getRecordById);
router.post('/', BorrowRecordController.createRecord);

// Các thao tác Cập nhật (duyệt/trả) và Xóa (hủy phiếu) chỉ dành cho admin
router.put('/:id', requireRole(['admin']), BorrowRecordController.updateRecord);
router.delete('/:id', requireRole(['admin']), BorrowRecordController.deleteRecord);

module.exports = router;