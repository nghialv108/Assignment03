const express = require('express');
const router = express.Router();
const BookController = require('./book.controller');
const { requireAuth, requireRole } = require('../../Share/middleware/auth.middleware');

router.get('/', requireAuth, BookController.getAllBooks);
router.get('/:id', requireAuth, BookController.getBookById);

router.post('/', requireAuth, requireRole(['admin']), BookController.createBook);
router.put('/:id', requireAuth, requireRole(['admin']), BookController.updateBook);
router.delete('/:id', requireAuth, requireRole(['admin']), BookController.deleteBook);

module.exports = router;